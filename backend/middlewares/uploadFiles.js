import multer from "multer";

export const uploadUserPic = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

export const uploadPostContent = multer({
  storage: multer.memoryStorage()
})