import { Router } from "express";
import { getAvailableApps, getUserApps, getUserById, getUserPosts, postApp, updateProfile, searchApp, updateUserPicture, getNotifications } from "../controllers/userController.js";
import { uploadPostContent, uploadUserPic } from "../middlewares/uploadFiles.js";

export const userRoute = Router();

userRoute.put('/updateProfile', updateProfile);
userRoute.put('/updateUserPicture', uploadUserPic.single('user_pic'), updateUserPicture);
userRoute.get('/getUser/:user_id', getUserById);

// apps
userRoute.get('/searchApp', searchApp);
userRoute.get('/apps/:user_id', getUserApps);
userRoute.get('/availableApps/:user_id', getAvailableApps);


// posts
userRoute.post('/postApp', uploadPostContent.single('video'), postApp);
userRoute.get('/searchPost/:user_id', searchApp)
userRoute.get('/posts/:user_id', getUserPosts);
userRoute.delete('/posts/:user_id/:post_id');

// notifications
userRoute.get('/notifications/:user_id', getNotifications);
userRoute.post('/notifications')