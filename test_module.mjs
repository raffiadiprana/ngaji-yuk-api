import axios from 'axios'

const API = 'https://ngaji-yuk-api.onrender.com'
const email = process.env.EMAIL || 'raffiadiprana469@gmail.com'
const password = process.env.PASSWORD || 'NgajiYuk123'

const main = async () => {
  // login
  const auth = await axios.post(`${API}/authentication`, {
    strategy: 'local', email, password
  })
  const token = auth.data.accessToken
  const headers = { Authorization: token }

  // get a section id
  const sec = await axios.get(`${API}/sections`, { headers })
  const sectionId = sec.data.data?.[0]?.id
  const userId = auth.data.user?.id

  console.log('sectionId', sectionId, 'userId', userId)

  const payload = {
    title: 'TEST MODULE CIEL',
    description: 'tes',
    video_header_id: '',
    thumbnail: '',
    section_id: Number(sectionId),
    instructor_id: Number(userId)
  }

  try {
    const res = await axios.post(`${API}/modules`, payload, { headers })
    console.log('SUCCESS', res.status, JSON.stringify(res.data).slice(0, 200))
  } catch (e) {
    console.log('ERROR STATUS', e.response?.status)
    console.log('ERROR BODY', JSON.stringify(e.response?.data, null, 2).slice(0, 800))
  }
}

main().catch(e => { console.error('FATAL', e.message) })
