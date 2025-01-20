import { db } from "../db.js";
import axios from "axios";
import { statistics } from "../helpers/platforms.js";

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


export const connectToInstagram = async (req,res) => {
  const authCode = req.query.code;
  const userId = req.query.user_id;

  if (!authCode) {
    return res.status(400).send('Authorization cannot be provided')
  }

  try {
    const tokenRes = await axios.post('https://api.instagram.com/oauth/access_token', null, {
      params: {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_API_KEY,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.BASE_URL}auth/instagram/callback`,
        code: authCode
      }
    })

    const accessToken = tokenRes.data.access_token;
    const userInstaId = tokenRes.data.user_id;

    await db.query("INSERT INTO user_apps (user_id, app_id, media_user_id, access_token) VALUES ($1, $2, $3, $4)", [userId, 1, userInstaId, accessToken]);

    res.redirect(`${process.env.FRONTEND_BASE_URL}/settings/apps`)
  } catch (error) {
    console.log('Error at connectToInstagram');
    res.status(500).send(error)
  }
}