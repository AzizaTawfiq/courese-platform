import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const ACCEPTED_SCHEDULE_FILE_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

const sanitizeFilename = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

const resolveUploadDirectory = () =>
  path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? 'uploads');

const resolveScheduleFilesDirectory = () =>
  path.join(resolveUploadDirectory(), 'schedule-files');

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    const directory = resolveScheduleFilesDirectory();
    fs.mkdirSync(directory, { recursive: true });
    callback(null, directory);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const safeName = sanitizeFilename(basename) || 'schedule-file';
    callback(null, `${Date.now()}-${safeName}${extension.toLowerCase()}`);
  },
});

export const uploadScheduleFile = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB ?? 10) * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (ACCEPTED_SCHEDULE_FILE_MIME_TYPES.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

export const scheduleFileUpload = uploadScheduleFile.single('file');
export const scheduleFileMimeTypes = [...ACCEPTED_SCHEDULE_FILE_MIME_TYPES];
export const scheduleFilesDirectory = resolveScheduleFilesDirectory;
