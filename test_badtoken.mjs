import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const headers = { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.signature', Origin: 'https://ngaji-yuk-ui-tadn.vercel.app' }
const payload = { title: 'TESTBAD', description: 'x', video_header_id: '', thumbnail: '', section_id: 1, instructor_id: 2 }
try {
  const res = await axios.post(`${API}/modules`, payload, { headers })
  console.log('BAD TOKEN SUCCESS', res.status)
} catch (e) {
  console.log('BAD TOKEN STATUS', e.response?.status, '| body:', JSON.stringify(e.response?.data).slice(0,250))
}
