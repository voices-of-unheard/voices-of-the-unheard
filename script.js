// script.js - frontend behavior
document.getElementById('year').textContent = new Date().getFullYear();

// read stories loaded in stories.js
const STORIES = window.VOU_STORIES || [];

// DOM refs
const storiesEl = document.getElementById('stories');
const categorySelect = document.getElementById('categorySelect');
const themeSelect = document.getElementById('themeSelect');
const featuredTitle = document.getElementById('featuredTitle');
const featuredExcerpt = document.getElementById('featuredExcerpt');
const featuredImage = document.getElementById('featuredImage');
const featuredRead = document.getElementById('featuredRead');
const featuredListen = document.getElementById('featuredListen');
const submitForm = document.getElementById('submitForm');
const submitStatus = document.getElementById('submitStatus');

// populate categories
const cats = new Set(['All']);
STORIES.forEach(s => cats.add(s.category));
cats.forEach(c => {
  const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
  categorySelect.appendChild(opt);
});

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
          ${s.audio? `<button class="btn outline" data-audio="${s.audio}">Play</button>` : ''}
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
themeSelect.addEventListener('change', () => {
  setTheme(themeSelect.value);
  localStorage.setItem('vouTheme', themeSelect.value);
});
function setTheme(t){
  if(t==='dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

// helper
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// play audio buttons (event delegation)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-audio]');
  if(btn){
    const audioSrc = btn.getAttribute('data-audio');
    // open reader with play param to play audio
    location.href = `reader.html?id=${encodeURIComponent(btn.closest('.card').querySelector('h3').textContent.toLowerCase().split(' ').join('-'))}&play=1`;
  }
});

// ------- Form submission wiring -------
// Two options: A) Post to Formspree endpoint (fast) OR B) Post to your Google Form formResponse endpoint
// Default behavior: attempt to submit to Formspree if FORMSPREE_ENDPOINT is set in window; otherwise fallback to JS "mailto" or local success message.

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xldqojrl"; // <-- set here if you sign up to Formspree, e.g. "https://formspree.io/f/..."

// helper to convert form data to FormData and send
submitForm.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  submitStatus.textContent = 'Sending…';
  const fd = new FormData(submitForm);

  // if Formspree configured
  if(FORMSPREE_ENDPOINT){
    try{
      const res = await fetch(FORMSPREE_ENDPOINT, {method:'POST', body: fd});
      if(res.ok){ submitStatus.textContent = 'Thanks! We received your story. We will contact you for consent.'; submitForm.reset(); }
      else { submitStatus.textContent = 'Submission failed. Try again later.'; }
    } catch(err){ submitStatus.textContent = 'Network error. Try again.'; }
    return;
  }

  // Option B: direct post to Google Forms (requires mapping)
  // If you want this, open your Google Form and find input names 'entry.123456' and then add them as hidden inputs or modify this code to map keys.
  // For now we just store the data in a local downloadable file experience: convert to JSON and offer to download (safe fallback)
  const obj = {};
  fd.forEach((v,k)=>{ obj[k]=v instanceof File? v.name : v; });
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'submission.json'; a.textContent='Download submission (backup)';
  submitStatus.textContent = ''; submitStatus.appendChild(a);
});

// end script
