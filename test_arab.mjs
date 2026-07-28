import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const payload = {
  title: 'Idzhar Halqi',
  description: `Apabila Nun Sukun atau Tanwin bertemu dengan salah satu huruf Idzhar, maka huruf Nun Sukun atau Tanwin dibaca jelas tanpa ada dengung atau samar dan tidak ditahan.\n\nHuruf-huruf Idzhar Halqi adalah sebagai berikut:\nء ه ع ح غ خ\n\nContoh Idzhar:\nمِنْ خَيْرٍ - يَنْأَوْنَ - عَذَابٌ أَلِيمٌ - مِنْ عِلْمٍ`,
  video_header_id: 'https://youtu.be/si48d_8BjIo?si=IlywaTTW7OlCoZnB',
  thumbnail: '',
  section_id: 1,
  instructor_id: 2
}
try {
  const res = await axios.post(`${API}/modules/`, payload, { headers: { Authorization: token, Origin: 'https://ngaji-yuk-ui-tadn.vercel.app', 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } })
  console.log('ARABIC PAYLOAD SUCCESS', res.status, 'id', res.data.id)
} catch (e) {
  console.log('ARABIC PAYLOAD ERROR', e.response?.status, '| headers:', JSON.stringify(e.response?.headers).slice(0,400))
  console.log('| body:', String(JSON.stringify(e.response?.data)).slice(0,300))
}
