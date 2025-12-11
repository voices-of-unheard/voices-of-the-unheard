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

// --- Formspree AJAX submission: request JSON to avoid redirect (CORS-safe) ---
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xldqojrl"; // <-- your endpoint

submitForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  submitStatus.textContent = 'Sending…';
  submitStatus.style.color = 'inherit';

  try {
    const fd = new FormData(submitForm);

    // Remove file inputs if present and you don't have Formspree file support:
    // fd.delete('photo'); fd.delete('audio'); // uncomment if needed

    // Debug logging
    console.group('Form submission debug');
    for (let [k, v] of fd.entries()) {
      console.log(k, v instanceof File ? `(file: ${v.name} ${v.size} bytes)` : v);
    }
    console.groupEnd();

    // Important: set Accept: application/json so Formspree returns JSON instead of redirecting
    const resp = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: fd,
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });

    // Read JSON (Formspree returns JSON when Accept header is set)
    const data = await resp.json().catch(()=>null);
    console.log('Formspree response', resp.status, data);

    if (resp.ok) {
      submitStatus.textContent = 'Thanks! Story sent. We will contact you for consent.';
      submitStatus.style.color = 'green';
      submitForm.reset();
    } else {
      submitStatus.textContent = `Submission failed (${resp.status}). See console for details.`;
      submitStatus.style.color = 'crimson';
      console.error('Formspree error', resp.status, data);
    }
  } catch (err) {
    submitStatus.textContent = 'Network or script error. See console for details.';
    submitStatus.style.color = 'crimson';
    console.error('Submission exception:', err);
  }
});


// end script
