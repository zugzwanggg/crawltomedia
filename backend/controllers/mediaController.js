import { db } from "../db.js";
import axios from "axios";
import { STATISTICS, POST_TO_MEDIA } from "../helpers/platforms.js";
import qs from 'qs';

export const getStatistics = async (req,res) => {
  try {

    const { user_id } = req.params;
    
    const result = await db.query("SELECT user_apps.media_user_id, user_apps.access_token, apps.name FROM user_apps JOIN apps ON apps.id = user_apps.app_id  WHERE user_id = $1", [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No connect apps. Please, connect to one of them."
      })
    }

    const today = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);


    const statsPromises = result.rows.map(async app => {
      if (STATISTICS[app.name.toLowerCase()]) {
        try {
          
          return await STATISTICS[app.name.toLowerCase()](app.media_user_id, formatDate(sevenDaysAgo), formatDate(today), app.access_token);

        } catch (error) {
          console.log('Error at getStatistics', error);
          res.status(500).send(error)
        }
      }
    })

    const statsResults = await Promise.all(statsPromises);

    return statsResults;




    
  } catch (error) {
    console.log('Error at getStatistics', error);
    res.status(500).send(error)
  }
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export const getYoutubeStatistics = async (req,res) => {
  try {
    
    const { user_id, app_id } = req.params;
    const data = await db.query("SELECT * FROM user_apps WHERE user_id = $1 AND app_id = $2", [user_id, app_id]);

    const dataMediaUserId = data.rows[0].media_user_id;
    const accessToken = data.rows[0].access_token;

    const today = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
      params: {
        ids: 'channel==MINE',
        metrics: 'views,likes,comments,subscribersGained',
        dimensions: 'day',
        startDate: formatDate(sevenDaysAgo),
        endDate: formatDate(today),
        access_token: accessToken
      }
    })

    const formattedResponse = {
      app: 'YouTube',
      data: response.data.rows.map(row => ({
        date: row[0],
        views: row[1], 
        likes: row[2], 
        comments: row[3], 
        subscribersGained: row[4]
      }))
    }

    res.status(200).json(formattedResponse)

  } catch (error) {
    console.log('Error at getYoutubeStatistics', error);
    res.status(500).send(error)
  }
}

export const getInstaStatistics = async (req, res) => {
  const { user_id, app_id } = req.params;

  try {
    const instaData = await db.query(
      "SELECT * FROM user_apps WHERE user_id = $1 AND app_id = $2",
      [user_id, app_id]
    );

    if (instaData.rowCount === 0) {
      return res.status(404).json({ message: "Instagram account not found" });
    }

    const instaUserId = instaData.rows[0].media_user_id;
    const accessToken = instaData.rows[0].access_token;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // 1. Получаем insights по поддерживаемым метрикам
    const insightsResponse = await axios.get(`https://graph.instagram.com/${instaUserId}/insights`, {
      params: {
        metric: 'reach',  // только поддерживаемые метрики!
        period: 'day',
        since: formatDate(sevenDaysAgo),
        until: formatDate(today),
        access_token: accessToken
      }
    });

    if (insightsResponse.data.error) {
      console.error("Instagram Insights API error:", insightsResponse.data.error);
      return res.status(500).json({ message: "Error fetching Instagram insights data" });
    }

    // 2. Получаем подписчиков через fields
    const followersResponse = await axios.get(`https://graph.instagram.com/${instaUserId}`, {
      params: {
        fields: 'followers_count',
        access_token: accessToken
      }
    });

    if (followersResponse.data.error) {
      console.error("Instagram Followers API error:", followersResponse.data.error);
      return res.status(500).json({ message: "Error fetching Instagram followers data" });
    }

    const followersCount = followersResponse.data.followers_count || 0;

    // 3. Обработка данных
    const rows = [];
    const dateLabels = [];

    insightsResponse.data.data.forEach((metric) => {
      metric.values.forEach((value, index) => {
        if (!rows[index]) rows[index] = [0];
        rows[index][0] = value.value || 0;

        if (!dateLabels[index]) {
          dateLabels[index] = value.end_time;
        }
      });
    });

    // 4. Финальный ответ
    const formattedResponse = {
      app: 'Instagram',
      data: rows.map((row, index) => ({
        date: dateLabels[index],
        views: row[0], // только reach = views
        likes: 0,
        comments: 0,
        subscribersGained: followersCount
      }))
    };

    res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('Error at getInstaStatistics', error.response?.data || error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
};


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

    refreshInstaToken(userId, accessToken);
    res.redirect(`${process.env.FRONTEND_BASE_URL}/settings/apps`)
  } catch (error) {
    console.log('Error at connectToInstagram', error);
    res.status(500).send(error)
  }
}

export const postToInstagram = async (req,res) => {
  try {
    const { media_user_id, access_token, video, content, status, template_url } = req.body;

    if (!media_user_id || !access_token || !video || !content || !status || !template_url) {
      return res.status(400).json({
        message: "Please provide all the values needed."
      })
    }

    await POST_TO_MEDIA['instagram'](access_token, media_user_id, video, content, status, template_url);

    res.status(201).json({
      message: "Succesfully posted"
    })
    
  } catch (error) {
    console.log('Error at postToInstagram', error);
    res.status(500).send(error)
  }
}


export const refreshInstaToken = async (userId, access_token) => {
  try {

    const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: {
        grant_type: 'ig_refresh_token',
        access_token: access_token
      }
    })

    const newAccessToken = response.data.access_token;

    await db.query('UPDATE user_apps SET access_token = $1 WHERE user_id = $2 AND app_id = 1', [newAccessToken, userId]);

    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh Instagram token:', error.message);
    throw new Error('Token refresh failed');
  }
}