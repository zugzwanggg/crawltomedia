import { db } from "../db.js";
import axios from "axios";
import { statistics } from "../helpers/platforms.js";
import qs from 'qs';

export const getStatistics = async (req,res) => {
  try {

    const { user_id } = req.params;
    const statistics = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=Ks-_Mh1QhMc&key=${process.env.YOUTUBE_API_KEY}`);
    res.status(200).json(statistics.data)
  } catch (error) {
    console.log('Error at getStatistics', error);
    res.status(500).send(error)
  }
}

export const getYoutubeStatistics = async (req,res) => {
  try {
    
    const { user_id, app_id } = req.params;
    const data = await db.query("SELECT * FROM user_apps WHERE user_id = $1 AND app_id = $2", [user_id, app_id]);

    const dataMediaUserId = data.rows[0].media_user_id;
    const accessToken = data.rows[0].access_token;

    const response = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==MINE&startDate=2025-01-01&endDate=2025-01-10&metrics=views,likes,comments,subscribersGained&dimensions=day&access_token=${accessToken}`

    res.status(200).json(response)

  } catch (error) {
    console.log('Error at getYoutubeStatistics', error);
    res.status(500).send(error)
  }
}

export const getInstaStatistics = async (req, res) => {
  const { user_id, app_id } = req.params;
  try {

    const instaData = await db.query("SELECT * FROM user_apps WHERE user_id = $1 AND app_id = $2", [user_id, app_id]);

    const instaUserId = instaData.rows[0].media_user_id;
    const accessToken = instaData.rows[0].access_token;

    const response = await axios.get(`https://graph.facebook.com/v19.0/${instaUserId}/insights`,
    {
      params: {
        metric: 'impressions,reach,profile_views',
        period: 'day',
        access_token: accessToken
        }
    }
    );

    res.status(200).json(response.data);
    
  } catch (error) {
    console.log('Error at getInstaStatistics', error);
    res.status(500).send(error)
  }
}

export const disconnectUserApp = async (req,res) => {
  try {

    const {user_id, app_id} = req.params;
    await db.query("DELETE FROM user_apps WHERE user_id = $1 AND app_id = $2", [user_id, app_id]);

    res.status(204).json({
      message: "Succesfully disconnected"
    })
    
  } catch (error) {
    console.log('Error at disconnectUserApp');
    res.status(500).send(error)
  }
}

export const connectToInstagram = async (req,res) => {
  const authCode = req.query.code;
  const userId = req.query.state;

  if (!authCode) {
    return res.status(400).send('Authorization cannot be provided')
  }

  try {
    const tokenRes = await axios.post(
      'https://api.instagram.com/oauth/access_token', 
      qs.stringify({
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_API_KEY,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.BASE_URL}auth/instagram/callback`,
        code: authCode
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const accessToken = tokenRes.data.access_token;
    const userInstaId = tokenRes.data.user_id;

    await db.query("INSERT INTO user_apps (user_id, app_id, media_user_id, access_token) VALUES ($1, $2, $3, $4)", [userId, 1, userInstaId, accessToken]);

    res.redirect(`${process.env.FRONTEND_BASE_URL}/settings/apps`)
  } catch (error) {
    console.log('Error at connectToInstagram', error);
    res.status(500).send(error)
  }
}