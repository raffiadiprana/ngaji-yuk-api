import axios from 'axios'
const API = 'https://ngaji-yuk-api.onrender.com'
const auth = await axios.post(`${API}/authentication`, { strategy: 'local', email: 'raffiadiprana469@gmail.com', password: 'NgajiYuk123' })
const token = auth.data.accessToken
const res = await axios.get(`${API}/sections`, { headers: { Authorization: token } })
console.log('typeof data:', typeof res.data, '| keys:', Object.keys(res.data))
console.log('data.data isArray:', Array.isArray(res.data.data), '| len:', res.data.data?.length)
console.log('first item:', JSON.stringify(res.data.data?.[0]).slice(0,200))
