import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const h = { Authorization: auth.data.accessToken }
for (const q of ['section_id=1&is_deleted=0','section_id=1','is_deleted=0']) {
  try { const r = await axios.get(`${API}/modules?${q}`, { headers: h }); console.log(q, '->', r.status, 'items', r.data.data?.length) }
  catch (e) { console.log(q, '->', e.response?.status, JSON.stringify(e.response?.data?.data||e.response?.data?.message).slice(0,150)) }
}
