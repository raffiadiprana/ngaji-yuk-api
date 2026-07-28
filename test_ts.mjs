import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const headers = { Authorization: token, Origin: 'https://ngaji-yuk-ui-tadn.vercel.app' }
try {
  const res = await axios.post(`${API}/modules/`, { title: 'TESTTS', description: 'x', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: 2 }, { headers })
  console.log('TRAILING SLASH SUCCESS', res.status)
} catch (e) {
  console.log('TRAILING SLASH STATUS', e.response?.status, '| body:', JSON.stringify(e.response?.data).slice(0,200))
}
