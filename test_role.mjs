import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
// 1. register user santri baru
const email = `cieltest${Date.now()}@test.com`
let user
try {
  user = await axios.post(`${API}/users`, { email, password: 'Test12345', role: 'santri' })
  console.log('register santri OK id', user.data.id, 'role', user.data.role)
} catch (e) {
  console.log('register fail', e.response?.status, JSON.stringify(e.response?.data).slice(0,150))
  process.exit(1)
}
// 2. login
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email, password: 'Test12345' })
const token = auth.data.accessToken
// 3. POST modules as santri
try {
  const res = await axios.post(`${API}/modules`, { title: 'ROLETEST', description: 'x', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: user.data.id }, { headers: { Authorization: token } })
  console.log('SANTRI POST modules:', res.status)
} catch (e) {
  console.log('SANTRI POST modules ERROR:', e.response?.status, '| body:', JSON.stringify(e.response?.data).slice(0,300))
}
