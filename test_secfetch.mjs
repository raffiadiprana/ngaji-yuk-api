import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const headers = {
  Authorization: token,
  Origin: 'https://ngaji-yuk-ui-tadn.vercel.app',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
  'Sec-Fetch-Site': 'cross-site',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'Accept': 'application/json, text/plain, */*'
}
try {
  const res = await axios.post(`${API}/modules`, { title: 'TESTSF', description: 'x', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: 2 }, { headers })
  console.log('WITH SEC-FETCH SUCCESS', res.status, '| server:', res.headers?.server)
} catch (e) {
  console.log('WITH SEC-FETCH STATUS', e.response?.status, '| server:', e.response?.headers?.server, '| body:', JSON.stringify(e.response?.data).slice(0,200))
}
