import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

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
    const response = await axios.get(`https://graph.instagram.com/v22.0/${instaUserId}/insights`, {
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
  instagram: async (access_token, user_id, video_url, content, status, template_url) => {
    const response = await axios.post(`https://graph.instagram.com/v22.0/${user_id}/media`,
      {
        meida_type: "VIDEO",
        video_url: video_url,
        caption: content,
        is_reel: true,
        access_token: access_token
      }
    );

    const creationId = response.data.id;
    const publish = await axios.post(`https://graph.instagram.com/v22.0/${user_id}/media_publish`, {
      creation_id: creationId,
      access_token: access_token
    });

    return publish.data;
  },
  youtube: async (access_token, user_id, video_url, content, status) => {
    const fileSize = fs.statSync(video_url).size;

    const response = await axios.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      snippet: {
        title: content
      },
      status: {
        privacyStatus: status,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": fileSize,
      },
    })

    const uploadUrl = response.headers.location;
    const uploadResponse = await axios.put(uploadUrl, fs.createReadStream(video_url), {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "video/mp4",
        "Content-Length": fileSize,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return uploadResponse.data;
  }
}