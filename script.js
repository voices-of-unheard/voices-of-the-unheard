// script.js - frontend behavior for index.html
document.getElementById('year').textContent = new Date().getFullYear();

const STORIES = window.VOU_STORIES || [];
const storiesEl = document.getElementById('stories');
const categorySelect = document.getElementById('categorySelect');
const themeSelect = document.getElementById('themeSelect');
const featuredTitle = document.getElementById('featuredTitle');
const featuredExcerpt = document.getElementById('featuredExcerpt');
const featuredImage = document.getElementById('featuredImage');
const featuredRead = document.getElementById('featuredRead');
const featuredListen = document.getElementById('featuredListen');

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// render story cards
function renderCards(list){
  storiesEl.innerHTML = '';
  list.forEach(s=>{
    const a = document.createElement('article'); a.className='card';
    a.setAttribute('data-category', s.category);
    a.innerHTML = `
      <img src="${s.image}" alt="${escapeHtml(s.title)}">
      <div>
        <h3>${escapeHtml(s.title)}</h3>
        <div class="meta">${escapeHtml(s.author)} • ${escapeHtml(s.category)}</div>
        <div class="excerpt">${escapeHtml(s.excerpt)}</div>
        <div class="card-actions">
          <a class="btn" href="reader.html?id=${encodeURIComponent(s.id)}">Read</a>
          ${s.audio? `<a class="btn outline" href="reader.html?id=${encodeURIComponent(s.id)}&play=1">Listen</a>` : ''}
        </div>
      </div>
    `;
    storiesEl.appendChild(a);
  });
}
renderCards(STORIES);

// set featured (first story)
if(STORIES.length){
  const f = STORIES[0];
  featuredTitle.textContent = f.title;
  featuredExcerpt.textContent = f.excerpt;
  featuredImage.src = f.image;
  featuredRead.href = `reader.html?id=${encodeURIComponent(f.id)}`;
  if(f.audio) featuredListen.onclick = ()=> location.href = `reader.html?id=${encodeURIComponent(f.id)}&play=1`;
  else featuredListen.style.display='none';
}

// populate categories
const cats = new Set(['All']);
STORIES.forEach(s => cats.add(s.category));
cats.forEach(c => {
  const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
  categorySelect.appendChild(opt);
});

// category filter
categorySelect.addEventListener('change', ()=>{
  const val = categorySelect.value;
  if(val === 'All') renderCards(STORIES);
  else renderCards(STORIES.filter(s=>s.category===val));
});

// theme persistence
const savedTheme = localStorage.getItem('vouTheme') || 'sepia';
setTheme(savedTheme);
themeSelect.value = savedTheme;
themeSelect.addEventListener('change', () => { setTheme(themeSelect.value); localStorage.setItem('vouTheme', themeSelect.value); });
function setTheme(t){
  if(t==='dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

// lazy load images and fallback, entrance animation
window.addEventListener('load', () => {
  document.querySelectorAll('.card img, .featured img').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.addEventListener('error', () => { img.src = 'https://via.placeholder.com/600x400?text=Image+not+available'; });
  });
  const cards = document.querySelectorAll('.card');
  cards.forEach((c,i) => {
    c.style.opacity = 0;
    c.style.transform = 'translateY(10px)';
    setTimeout(()=> { c.style.transition = 'all .45s cubic-bezier(.2,.9,.2,1)'; c.style.opacity=1; c.style.transform='none'; }, 120 + i*80);
  });
});


