import multer, { Options } from 'multer'
import path from 'path'
import crypto from 'crypto'

export default {
  limits: {
    fileSize: 8192000
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return callback(new Error('Somente os formatos .png .jpg .jpeg são aceitos.'))
    }
    callback(null, true)
  },
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(req, file, callback) {
      const hash = crypto.randomBytes(6).toString('hex')

      const fileName = `${hash}-${file.originalname}`

      callback(null, fileName)
    }
  })
} as Options