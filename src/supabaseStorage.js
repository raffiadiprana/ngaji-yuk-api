import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

let _client = null
export const getSupabaseStorageClient = () => {
  if (_client) return _client
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[Supabase Storage] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return null
  }
  _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  return _client
}

export const uploadToSupabase = async (filePath, mimeType = 'application/octet-stream') => {
  const client = getSupabaseStorageClient()
  if (!client) throw new Error('Supabase Storage client is not configured')

  const bucket = 'ngaji-yuk-uploads'
  const fileName = path.basename(filePath)
  const fileBuffer = fs.readFileSync(filePath)

  const { error } = await client.storage.from(bucket).upload(fileName, fileBuffer, {
    contentType: mimeType,
    upsert: true
  })
  if (error) throw error

  const { data } = client.storage.from(bucket).getPublicUrl(fileName)
  return { filename: fileName, url: data?.publicUrl || null }
}
