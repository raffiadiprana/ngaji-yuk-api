import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const h = { Authorization: auth.data.accessToken }
for (const q of ['lessons?module_id=1','quiz?modules_id=1','modules/1']) {
  try { const r = await axios.get(`${API}/${q}`, { headers: h }); console.log(q, '->', r.status, 'items', r.data.data?.length ?? '-') }
  catch (e) { console.log(q, '->', e.response?.status, '|', String(e.response?.data?.message||e.response?.data?.name||'').slice(0,120)) }
}
