import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
// simulate browser preflight + POST with Origin header
try {
  const res = await axios.options(`${API}/modules`, {
    headers: {
      'Origin': 'https://ngaji-yuk-ui-tadn.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'authorization,content-type'
    }
  })
  console.log('OPTIONS status', res.status)
} catch (e) {
  console.log('OPTIONS ERROR', e.response?.status, JSON.stringify(e.response?.data).slice(0,200))
}
