// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import path from 'path'

import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { postgresql } from './postgresql.js'
import { authentication } from './authentication.js'
import { services } from './services/index.js'
import { channels } from './channels.js'
import { fileUploadMiddleware } from './middleware/file-upload.js'
import { uploadToSupabase } from './supabaseStorage.js'

const app = express(feathers())

// Load app configuration (from config/default.json etc.)
app.configure(configuration(configurationValidator))

// CORS dan file statis
app.use(cors())
app.use('/', serveStatic(app.get('public')))
app.use('/uploads', express.static(path.resolve('uploads')))  // expose uploaded files
app.use('/uploads/:filename', async (req, res, next) => {
  try {
    const filename = decodeURIComponent(req.params.filename)
    const client = getSupabaseStorageClient()
    if (!client) return next()

    const bucket = 'ngaji-yuk-uploads'
    const { data, error } = client.storage.from(bucket).createSignedUrl(filename, 60)
    if (!error && data?.signedUrl) {
      return res.redirect(data.signedUrl)
    }
    next()
  } catch (err) {
    next()
  }
})

// Register manual POST /uploads middleware BEFORE json/urlencoded
//    This is important so multer works before body-parser eats the body
app.post('/uploads', fileUploadMiddleware, async (req, res, next) => {
  try {
    console.log('[UPLOAD] req.file =', req.file)

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const result = await uploadToSupabase(req.file.path, req.file.mimetype)

    res.status(201).json(result)  // 201 Created
  } catch (err) {
    console.error('[UPLOAD] failed', err)
    next(err)
  }
})

// Body parsers (placed AFTER upload route)
app.use(json())
app.use(urlencoded({ extended: true }))

// REST API + Realtime Socket
app.configure(rest())
app.configure(socketio({
  cors: {
    origin: app.get('origins')
  }
}))

// Configure DB, auth, services, channels
app.configure(postgresql)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Error & 404 handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Global app hooks
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})

app.hooks({
  setup: [],
  teardown: []
})

export { app }
