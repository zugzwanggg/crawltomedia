import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLOUD_ID,
  clientSecret: process.env.GOOGLE_CLOUD_KEY,
  callbackURL: `${process.env.BASE_URL}auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const checkUser = await db.query("SELECT id, google_id, username, email, user_pic, verified FROM users WHERE google_id = $1", [profile.id]);
    
    if (checkUser.rows.length > 0) {
      return done(null, checkUser.rows[0])
    }
    const user = await db.query("INSERT INTO users (google_id, username, email, user_pic, verified) VALUES($1,$2,$3,$4, true) RETURNING id, google_id, username, email, user_pic, verified", [profile.id, 'user ' + profile.displayName , profile.emails[0].value, profile.photos[0].value]);
    await db.query("INSERT INTO user_apps (user_id, app_id, access_token, refresh_token) VALUES($1, 2, $2, $3)", [user.rows[0].id, accessToken, refreshToken]);

    return done(null, user.rows[0]);
  } catch (error) {
      console.log(error);
      return done(error);
  }
}
));

export {passport}