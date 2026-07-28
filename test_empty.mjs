import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const headers = { Authorization: token, Origin: 'https://ngaji-yuk-ui-tadn.vercel.app' }
for (const ins of ['', null, undefined, 'abc']) {
  try {
    const res = await axios.post(`${API}/modules`, { title: 'X', description: '', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: ins }, { headers })
    console.log(`instructor_id=${JSON.stringify(ins)} ->`, res.status)
  } catch (e) {
    console.log(`instructor_id=${JSON.stringify(ins)} ->`, e.response?.status, (e.response?.data?.message||'').slice(0,60))
  }
}
