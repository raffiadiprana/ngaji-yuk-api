import axios from 'axios'
const UI = 'https://ngaji-yuk-ui-tadn.vercel.app'
try {
  const res = await axios.post(`${UI}/modules`, { title: 'x' }, { headers: { Origin: 'https://ngaji-yuk-ui-tadn.vercel.app' } })
  console.log('UI POST /modules', res.status)
} catch (e) {
  console.log('UI POST /modules ERROR', e.response?.status, '| server:', e.response?.headers?.server, '| body:', JSON.stringify(e.response?.data).slice(0,150))
}
