import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
// tanpa token (simulasi authHeader return {})
const headers = {}
const payload = { title: 'TESTNOTOKEN', description: 'x', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: 2 }
try {
  const res = await axios.post(`${API}/modules`, payload, { headers })
  console.log('NO TOKEN SUCCESS', res.status)
} catch (e) {
  console.log('NO TOKEN STATUS', e.response?.status, '| body:', JSON.stringify(e.response?.data).slice(0,200))
}
