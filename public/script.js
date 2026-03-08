document.getElementById('likeForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const urlInput = document.getElementById('url');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.getElementById('loader');
    const resultArea = document.getElementById('resultArea');
    const output = document.getElementById('output');

    const videoUrl = urlInput.value.trim();

    if (!videoUrl) return;

    // UI State: Loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'block';
    resultArea.classList.add('hidden');

    try {
        // Panggil API Backend Vercel kita sendiri
        const response = await fetch('/api/tiktok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: videoUrl })
        });

        const data = await response.json();

        // Tampilkan Hasil
        resultArea.classList.remove('hidden');
        
        if (response.ok) {
            output.textContent = JSON.stringify(data, null, 2);
            output.style.color = 'green';
        } else {
            output.textContent = data.error || 'Terjadi kesalahan.';
            output.style.color = 'red';
        }

    } catch (err) {
        resultArea.classList.remove('hidden');
        output.textContent = "Gagal menghubungi server.";
        output.style.color = 'red';
    } finally {
        // UI State: Reset
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        loader.style.display = 'none';
    }
});
