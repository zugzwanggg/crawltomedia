import { db } from "../db.js";
import { Storage } from "@google-cloud/storage";
import { log } from "console";
import crypto from "crypto";
import { google } from "googleapis";
import axios from "axios";
import { title } from "process";
import {passport} from "../services/passport.js";


export const getUserById = async (req,res) => {
  try {

    const {user_id} = req.params;

    const user = await db.query("SELECT * FROM users WHERE id = $1", [user_id]);

    res.status(200).json(user.rows[0]);

  } catch (error) {
    console.log("Error at getUserById: " + error);
    res.status(500).send(error);
  }
}

const randomUserImgName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export const updateUserPicture = async (req,res) => {
  try {
    const {user_id} = req.body;
    let fileName = randomUserImgName();
    const storage = new Storage({
      keyFilename: Buffer.from(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8'),
      projectId: process.env.GOOGLE_CLOUD_ID
    })

    const bucket = process.env.GOOGLE_CLOUD_BUCKET_NAME||'';
    const blob = storage.bucket(bucket).file(fileName)
    const blobStream = blob.createWriteStream({
      contentType: req.file.mimetype,
      resumable: false
    })

    blobStream.on('error', (err)=> {
      console.log(err);
      res.status(500).send(err);
    })
    
    blobStream.on('finish', async () => {
      await db.query('UPDATE users SET user_pic = $2 WHERE id = $1', [user_id, `https://storage.googleapis.com/crawltomedia-bucket/${fileName}`]);
    })

    blobStream.end(req.file.buffer);
    res.status(200).json({
      message: "Succesfully updated profile picture"
    })
  } catch (error) {
    console.log("Error at updateUserPicture: " + error);
    res.status(500).send(error);
  }
}

export const updateProfile = async (req,res) => {
  try {

    const {user_id, username} = req.body;

    if (!user_id || !username) {
      return res.status(400).json({
        message: "Empty user fields are not allowed"
      })
    }

    const checkName = await db.query("SELECT * FROM users WHERE username = $1", [username]);

    if (checkName.rows.length > 0) {
      return res.status(400).json({
        message: "User with this username already exists"
      })
    }

    await db.query("UPDATE users SET username = $2 WHERE id = $1", [user_id, username]);

    res.status(204).json({
      message: "Succesfully updated profile"
    })
    
  } catch (error) {
    console.log("Error at updateProfile: " + error);
    res.status(500).send(error);
  }
}

export const searchApp = async (req,res) => {
  try {
    const {q} = req.query;

    const searchResults = await db.query('SELECT * FROM apps WHERE LOWER(name) LIKE $1 LIMIT 10', [`%${q.toLowerCase()}%`]);

    res.status(200).json(searchResults.rows);

  } catch (error) {
    console.log("Error at getApps: " + error);
    res.status(500).send(error);
  }
}

export const getAvailableApps = async (req,res) => {
  try {

    const apps = await db.query("SELECT * FROM apps JOIN user_apps ON user_apps.app_id != apps.app_id");

    res.status(200).json(apps.rows);
    
  } catch (error) {
    console.log("Error at getApps: " + error);
    res.status(500).send(error);
  }
}

export const getUserApps = async (req,res) => {
  try {

    const {user_id} = req.params;

    const apps = await db.query("SELECT apps.id, apps.name, apps.logo_path FROM apps JOIN user_apps ON apps.id = user_apps.app_id WHERE user_id = $1", [user_id]);
    res.status(200).json(apps.rows);

  } catch (error) {
    console.log("Error at userApps: " + error);
    res.status(500).send(error);
  }
}

export const postApp = async (req,res) => {
  try {
    const {user_id, app_id, title, privacy} = req.body;

    const userAppData = await db.query('SELECT * FROM user_apps WHERE user_id = $1 AND app_id = $2', [user_id, app_id]);
    const token = userAppData.rows[0].access_token
    const youtube = google.youtube({
      version: 'v3',
      auth: token
    })

    console.log();

    await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title,
          description: 'Video description',
          tags: ['tag1'],
        },
        status: {
          privacyStatus: privacy,
        },
      },
    })

  
    await db.query("INSERT INTO posts (title, user_id, app_id) VALUES($2, $1, $3)", [user_id, title, app_id]);

    res.status(201).json({
        message: "Succesfully added a post"
    })
    
  } catch (error) {
    console.log("Error at postApp: " + error);
    res.status(500).send(error);
  }
}


export const getUserPosts = async (req,res) => {
  try {
    const {user_id} = req.params;
    const q = req.query.q || '%'
    const p = JSON.parse(req.query.p);
    const app = req.query.app || '%';
    const todaysDate = new Date();
    const date = new Date(req.query.date) || todaysDate;
    const limit = 4;
    const offset = (p - 1) * limit;

    const posts = await db.query("SELECT posts.id, posts.user_id, posts.status, apps.logo_path, posts.status, posts.title, posts.created_at FROM posts JOIN apps ON apps.id = posts.app_id WHERE posts.user_id = $1 AND apps.name LIKE $4 AND DATE(created_at) = DATE($5) AND LOWER(title) LIKE $6 LIMIT $2 OFFSET $3", [user_id, limit, offset, app, date, `%${q.toLowerCase()}%`]);
    let getAllPosts;

    if (app === '%') {
      getAllPosts = await db.query("SELECT count(*) as count FROM posts WHERE user_id = $1 AND DATE(created_at) = DATE($2)", [user_id, date]);
    } else {
      getAllPosts = await db.query("SELECT count(posts.id) as count FROM posts JOIN apps ON apps.id = posts.app_id WHERE user_id = $1 AND apps.name LIKE $2 GROUP BY posts.id", [user_id, app]);
    }

    const totalPage = Math.ceil(getAllPosts.rows[0]?.count / limit);
    const getApps = await db.query("SELECT DISTINCT apps.name FROM apps JOIN posts ON posts.app_id = apps.id WHERE user_id = $1 AND DATE(created_at) = DATE($2)", [user_id, date]);

    const results = {}

    if (p < totalPage) {
      results.next = {
        page: p + 1
      }
    }

    if (offset > 0) {
      results.previous = {
        page: p - 1,
      }
    }
    
    res.status(200).json({posts: posts.rows, results, totalPage, apps: getApps.rows})
  } catch (error) {
    console.log("Error at getUserPosts: " + error);
    res.status(500).send(error);
  }
}

export const deleteUserPost = async (req,res) => {
  try {

    const {agreement , post_id, user_id} = req.body;

    const app = await db.query("SELECT * FROM apps WHERE user_id = $1", [user_id]);

    if (agreement !== `Delete post on ${app.rows[0].name}`) {
      return res.status(400).json({
        message: "Your text is incorrect"
      })
    }

    await db.query('DELETE FROM posts WHERE id = $1', [post_id]);
     
  } catch (error) {
    console.log("Error at deleteUserPost: " + error);
    res.status(500).send(error);
  }
}



export const getNotifications = async (req,res) => {
  try {
    const {user_id} = req.params;
    const notifications = await db.query("SELECT apps.name as title,apps.logo_path, notifications.content, notifications.created_at FROM notifications JOIN apps ON apps.id = notifications.app_id WHERE notifications.user_id = $1", [user_id]);

    res.status(200).json(notifications.rows)

  } catch (error) {
    console.log("Error at getNotifications: " + error);
    res.status(500).send(error);
  }
}