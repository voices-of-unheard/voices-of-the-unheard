document.getElementById('year').textContent = new Date().getFullYear();

const audio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
const themeSelect = document.getElementById('themeSelect');
const modal = document.getElementById('modal');
const readBtn = document.getElementById('readBtn');
const closeModal = document.getElementById('closeModal');

audioToggle.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(()=>{ alert('Autoplay blocked — user gesture needed. Click Play on the audio control.')});
    audioToggle.textContent = 'Pause';
  } else {
    audio.pause();
    audioToggle.textContent = 'Play';
  }
});

themeSelect.addEventListener('change', (e) => {
  const t = e.target.value;
  if (t === 'sepia'){
    document.body.style.background = 'linear-gradient(180deg, #fbf6ef 0%, #f0e6d6 100%)';
  } else if (t === 'mandala'){
    document.body.style.background = 'linear-gradient(180deg, #fff9f2 0%, #f9efe6 100%)';
  } else if (t === 'dark'){
    document.body.style.background = 'linear-gradient(180deg,#111216 0%,#1b1f24 100%)';
    document.body.style.color = '#ddd';
  }
});

// sample modal open
readBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
});
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
});
