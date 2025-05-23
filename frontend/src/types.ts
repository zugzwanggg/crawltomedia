export interface IUser {
  id: number,
  username: string,
  email: string,
  user_pic: string,
  verified: boolean,
  created_at: Date,
  google_id: string | null
}

export interface IPost {
  id: number,
  user_id: number,
  app_id: number,
  status: string,
  title: string,
  logo_path: string,
  link: string,
  created_at: Date
}

export type TypeApp = {
  id: number | string,
  name: string,
  logo_path: string,
  oauth_link: string
}

export interface INotification {
  id: number,
  title: string,
  logo_path: string,
  content: string,
  created_at: Date
}

export interface IMediaData {
  app: string,
  data: IMediaStats[]
}

export interface IMediaStats {
  date: Date,
  views: number,
  likes: number,
  comments: number,
  subscribersGained: number
}