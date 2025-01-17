import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const statistics = {
  youtube: async () => {
    try {
      const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=Ks-_Mh1QhMc&key=${process.env.YOUTUBE_API_KEY}`);
      return response.data
    } catch (error) {
      console.log(error);
    }
  }
}