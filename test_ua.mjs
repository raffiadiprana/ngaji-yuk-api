import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const headers = {
  Authorization: token,
  Origin: 'https://ngaji-yuk-ui-tadn.vercel.app',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
try {
  const res = await axios.post(`${API}/modules`, { title: 'TESTUA', description: 'x', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: 2 }, { headers })
  console.log('BROWSER UA SUCCESS', res.status)
} catch (e) {
  console.log('BROWSER UA STATUS', e.response?.status, '| server:', e.response?.headers?.server, '| body:', JSON.stringify(e.response?.data).slice(0,200))
}
