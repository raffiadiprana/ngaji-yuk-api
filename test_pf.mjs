import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
try {
  const res = await axios.options(`${API}/modules/`, { headers: {
    'Origin': 'https://ngaji-yuk-ui-tadn.vercel.app',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'authorization,cache-control,content-type,pragma'
  }})
  console.log('PREFLIGHT status', res.status, '| allow-headers:', res.headers['access-control-allow-headers'], '| allow-origin:', res.headers['access-control-allow-origin'])
} catch (e) {
  console.log('PREFLIGHT ERROR', e.response?.status, '| headers:', JSON.stringify(e.response?.headers).slice(0,300), '| body:', String(e.response?.data).slice(0,200))
}
