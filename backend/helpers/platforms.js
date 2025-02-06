import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const STATISTICS = {
  youtube: async (media_user_id, sevenDaysAgo, today, accessToken) => {
    const response = await axios.get(`https://youtubeanalytics.googleapis.com/v2/reports`, {
      params: {
        ids: 'channel==MINE',
        metrics: 'views,likes,comments,subscribersGained',
        dimensions: 'day',
        startDate: sevenDaysAgo,
        endDate: today,
        access_token: accessToken
      }
    })
    return {
      app: 'YouTube',
      data: response.data.rows.map(row => ({
        views: row[1], 
        likes: row[2], 
        comments: row[3], 
        subscribersGained: row[4]
      }))
    }
  },
  instagram: async (instaUserId, sevenDaysAgo, today, accessToken) => {
    const response = await axios.get(`https://graph.instagram.com/${instaUserId}/insights`, {
      params: {
        metric: 'impressions,reach,views,follower_count',
        period: 'day',
        since: sevenDaysAgo,
        until: today,
        access_token: accessToken
      }
    })

    const metricMapping = {
      impressions: "views",
      reach: "likes",
      profile_views: "comments",
      follower_count: "subscribersGained"
    };

    const rows = [];
    const dateLabels = [];

    response.data.data.forEach((metric) => {
      metric.values.forEach((value, index) => {
        if (!rows[index]) rows[index] = [0, 0, 0, 0];
        rows[index][Object.keys(metricMapping).indexOf(metric.name)] = value.value || 0;

        if (!dateLabels[index]) {
          dateLabels[index] = value.end_time; 
        }
      });
    });

    return {
      app: 'Instagram',
      data: rows.map((row, index) => ({
        date: dateLabels[index],
        views: row[0],
        likes: row[1],
        comments: row[2],
        subscribersGained: row[3]
      }))
    }
  }
}

export const POST_TO_MEDIA = {
  
}