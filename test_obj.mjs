import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const headers = { Authorization: token, Origin: 'https://ngaji-yuk-ui-tadn.vercel.app' }
// simulate q-select NOT emitting value: section_id = object, instructor_id = string
const payload = { title: 'TESTOBJ', description: 'x', video_header_id: '', thumbnail: '', section_id: { id: 1, section_name: 'X' }, instructor_id: '2' }
try {
  const res = await axios.post(`${API}/modules`, payload, { headers })
  console.log('OBJ SECTION SUCCESS', res.status)
} catch (e) {
  console.log('OBJ SECTION STATUS', e.response?.status, '| body:', JSON.stringify(e.response?.data).slice(0,250))
}
