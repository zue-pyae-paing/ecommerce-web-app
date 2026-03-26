import muilter from "multer";

const storage = muilter.memoryStorage();

function fileFilter(req: any, file: Express.Multer.File, cb: any) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

export const upload = muilter({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
