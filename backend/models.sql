-- user
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NUT NULL,
  password VARCHAR(255) NUT NULL,
  user_pic VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT False
);

-- apps
CREATE TABLE apps (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL,
  logo_path VARCHAR(255),
  oauth_link TEXT NOT NULL
);

-- posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT,
  app_id INT,
  status VARCHAR NOT NULL DEFAULT 'pending',
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- user_apps
CREATE TABLE user_apps (
  id SERIAL PRIMARY KEY,
  user_id INT,
  app_id INT,
  access_token TEXT,
  refresh_token TEXT,
  media_user_id BIGINT NOT NULL UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id)
  FOREIGN KEY (app_id) REFERENCES apps(id)
);

-- Email verifications
CREATE TABLE email_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  user_id INT,
  otp VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes')
)

-- notifications

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT,
  app_id INT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (app_id) REFERENCES apps(id)
)