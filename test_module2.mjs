import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const headers = { Authorization: token }
// test instructor_id = 0 (simulasi localStorage id kosong)
const payload = { title: 'TEST0', description: 'x', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: 0 }
try {
  const res = await axios.post(`${API}/modules`, payload, { headers })
  console.log('instructor_id=0 SUCCESS', res.status)
} catch (e) {
  console.log('instructor_id=0 ERROR', e.response?.status, JSON.stringify(e.response?.data).slice(0,300))
}
// test tanpa section_id (undefined)
const p2 = { title: 'TEST2', description: 'x', video_header_id: '', thumbnail: '', instructor_id: 2 }
try {
  const res = await axios.post(`${API}/modules`, p2, { headers })
  console.log('no section SUCCESS', res.status)
} catch (e) {
  console.log('no section ERROR', e.response?.status, JSON.stringify(e.response?.data).slice(0,300))
}
