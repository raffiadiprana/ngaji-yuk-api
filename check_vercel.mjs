import axios from 'axios'
// Ambil index.html Vercel, cari nama bundle JS terbaru, lalu cek apakah mengandung 'onrender'
const UI = 'https://ngaji-yuk-ui-tadn.vercel.app'
const html = await axios.get(`${UI}/`).then(r => r.data)
const m = html.match(/src="\/([^"]+\.js)"/)
console.log('bundle:', m && m[1])
if (m) {
  const js = await axios.get(`${UI}/${m[1]}`).then(r => r.data)
  console.log('contains onrender:', js.includes('onrender'))
  console.log('contains vercel.app/modules or ngaji-yuk-ui:', js.includes('ngaji-yuk-ui-tadn.vercel.app'))
}
