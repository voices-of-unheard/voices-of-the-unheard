// Basic helpers & initialization
document.getElementById('year').textContent = new Date().getFullYear();

const themeSelect = document.getElementById('themeSelect');
const categorySelect = document.getElementById('categorySelect');
const storiesArea = document.getElementById('stories');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalBody = document.getElementById('modalBody');
const storyAudio = document.getElementById('storyAudio');
const copyLink = document.getElementById('copyLink');
const toggleAudio = document.getElementById('toggleAudio');
const shareTwitter = document.getElementById('shareTwitter');

// theme persistence
const savedTheme = localStorage.getItem('vou-theme') || 'sepia';
themeSelect.value = savedTheme;
applyTheme(savedTheme);
themeSelect.addEventListener('change', (e) => {
  applyTheme(e.target.value);
  localStorage.setItem('vou-theme', e.target.value);
});

function applyTheme(name){
  if(name === 'sepia'){
    document.body.style.background = 'linear-gradient(180deg,#fbf6ef 0%,#f0e6d6 100%)';
    document.body.style.color = '#2b2b2b';
  } else if(name === 'mandala'){
    document.body.style.background = 'linear-gradient(180deg,#fff9f2 0%,#f9efe6 100%)';
    document.body.style.color = '#2b2b2b';
  } else if(name === 'dark'){
    document.body.style.background = 'linear-gradient(180deg,#0f1113 0%,#1b1f24 100%)';
    document.body.style.color = '#ddd';
  }
}

// category filter
categorySelect.addEventListener('change', () => {
  const cat = categorySelect.value;
  filterByCategory(cat);
});

function filterByCategory(cat){
  const cards = [...storiesArea.querySelectorAll('.card')];
  cards.forEach(c => {
    const ccat = c.getAttribute('data-category') || 'All';
    if(cat === 'All' || ccat === cat) {
      c.style.display = '';
      // small reveal animation
      requestAnimationFrame(()=>{ c.style.transform = 'translateY(0)'; c.style.opacity = '1'; });
    } else {
      c.style.display = 'none';
    }
  });
}

// modal open from card
function openStoryCard(button){
  const card = button.closest('.card');
  const tpl = card.querySelector('template.story-full');
  const audioFile = card.getAttribute('data-audio');
  if(!tpl) return;
  modalTitle.textContent = tpl.content.querySelector('h2').textContent;
  modalAuthor.textContent = tpl.content.querySelector('.byline')?.textContent || '';
  modalBody.innerHTML = tpl.content.querySelector('.story-body').innerHTML;

  // set share link to current page with fragment (you can craft real per-story URLs later)
  const pageUrl = window.location.href.split('#')[0];
  const storyId = encodeURIComponent(modalTitle.textContent.replace(/\s+/g,'-').toLowerCase());
  const shareUrl = pageUrl + '#' + storyId;
  shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(modalTitle.textContent)}&url=${encodeURIComponent(shareUrl)}`;
  copyLink.onclick = () => { navigator.clipboard.writeText(shareUrl).then(()=>alert('Link copied')) };

  // load audio if present
  if(audioFile){
    storyAudio.src = audioFile;
    toggleAudio.style.display = 'inline-block';
    toggleAudio.textContent = 'Play Background';
    toggleAudio.onclick = () => {
      if(storyAudio.paused){
        storyAudio.play();
        toggleAudio.textContent = 'Pause Background';
      } else {
        storyAudio.pause();
        toggleAudio.textContent = 'Play Background';
      }
    };
  } else {
    storyAudio.pause();
    storyAudio.src = '';
    toggleAudio.style.display = 'none';
  }

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
}

// helper for Read Story on hero
const readBtn = document.getElementById('readBtn');
if(readBtn) readBtn.addEventListener('click', () => {
  // open first card if exists
  const first = document.querySelector('.card .readSmall')?.closest('.card');
  if(first){
    first.querySelector('.readSmall').click();
  }
});

// play story audio quick action
function playStoryAudio(btn){
  const card = btn.closest('.card');
  const audioFile = card.getAttribute('data-audio');
  if(!audioFile) { alert('No audio attached to this story'); return; }
  if(storyAudio.src.indexOf(audioFile) === -1){
    storyAudio.src = audioFile;
  }
  if(storyAudio.paused) {
    storyAudio.play();
    btn.textContent = 'Pause';
  } else {
    storyAudio.pause();
    btn.textContent = 'Play Audio';
  }
}

// close modal
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
  storyAudio.pause();
});

// initial filter
filterByCategory(categorySelect.value);

// small: reveal animation when loading cards
window.addEventListener('load', () => {
  document.querySelectorAll('.card').forEach((c, i) => {
    c.style.transform = 'translateY(14px)';
    c.style.opacity = '0';
    setTimeout(()=>{ c.style.transform = 'translateY(0)'; c.style.opacity = '1'; }, 120 + i*80);
  });
});
