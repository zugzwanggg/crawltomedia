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