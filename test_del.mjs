import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const h = { Authorization: auth.data.accessToken }
for (const q of ['modules?id=1&is_deleted=0','lessons?module_id=1&is_deleted=0','quiz?modules_id=1&is_deleted=0','sections?is_deleted=0']) {
  try { const r = await axios.get(`${API}/${q}`, { headers: h }); console.log(q, '->', r.status) }
  catch (e) { console.log(q, '->', e.response?.status, '|', String(e.response?.data?.message||'').slice(0,120)) }
}
