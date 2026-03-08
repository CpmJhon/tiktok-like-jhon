// api/tiktok.js
const axios = require('axios');

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL TikTok wajib diisi!' });
  }

  try {
    // 1. Ambil Token dan Cookies
    const page = await axios.get('https://leofame.com/free-tiktok-likes');
    const html = page.data;
    
    // Regex untuk mengambil token
    const tokenMatch = html.match(/var\s+token\s*=\s*'([^']+)'/);
    if (!tokenMatch) {
      throw new Error('Gagal mengambil token dari leofame.');
    }
    const token = tokenMatch[1];
    
    // Ambil cookies
    const cookies = page.headers['set-cookie']
      .map(v => v.split(';')[0])
      .join('; ');

    // 2. Kirim Request Post
    const response = await axios.post('https://leofame.com/free-tiktok-likes?api=1',
      new URLSearchParams({
        token,
        timezone_offset: 'Asia/Jakarta',
        free_link: url
      }).toString(),
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://leofame.com',
          'Referer': 'https://leofame.com/free-tiktok-likes',
          'Cookie': cookies
        }
      }
    );

    // Kembalikan hasil ke frontend
    return res.status(200).json(response.data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      error: 'Terjadi kesalahan saat memproses.',
      details: error.message 
    });
  }
}
