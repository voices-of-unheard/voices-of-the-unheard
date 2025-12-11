:root{
  --paper:#f3eadc;
  --accent:#b05c00;
  --text:#2b2b2b;
  --muted:#6a5946;
  --card:#fffaf3;
}

/* base */
*{box-sizing:border-box;font-family: "Georgia", serif;}
body.vintage{background:linear-gradient(180deg,#fbf6ef 0%,#f0e6d6 100%);color:var(--text);-webkit-font-smoothing:antialiased;padding:18px;margin:0;}
.page{max-width:1100px;margin:12px auto;background:rgba(255,255,250,0.75);padding:18px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,0.08);}

/* header */
.header{display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid rgba(0,0,0,0.05);gap:12px;}
.brand{display:flex;gap:12px;align-items:center;}
.logo{width:56px;height:56px;background:var(--accent);color:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;}
h1{margin:0;font-size:20px;}
.tag{margin:0;font-size:12px;color:var(--muted);}
.controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.controls select{padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);background:#fff;}

/* hero */
.max{padding:18px;}
.hero-card{display:flex;gap:18px;align-items:center;background:linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,250,240,0.8));padding:12px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.06);}
.hero-card img{width:320px;height:200px;object-fit:cover;border-radius:8px;border:1px solid rgba(0,0,0,0.06);}
.hero-actions{margin-top:8px;display:flex;gap:8px;}
.primary{background:var(--accent);color:#fff;padding:10px 14px;border-radius:8px;border:none;cursor:pointer;}
.secondary{background:#fff;border:1px solid #ddd;padding:10px 12px;border-radius:8px;cursor:pointer;}

/* stories grid */
.stories{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:18px;}
.card{display:flex;gap:12px;background:var(--card);padding:12px;border-radius:10px;align-items:flex-start;box-shadow:0 6px 16px rgba(0,0,0,0.04);transform:translateY(0);opacity:1;transition:transform .35s ease,opacity .35s ease;}
.card img{width:88px;height:68px;object-fit:cover;border-radius:6px;border:1px solid rgba(0,0,0,0.04);}
.card .meta{font-size:12px;color:var(--muted);margin:6px 0;}
.card .excerpt{font-size:14px;margin:4px 0;}
.card .card-actions{display:flex;gap:8px;margin-top:8px;}
.readSmall,.playAudio{padding:6px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);background:#fff;cursor:pointer;}

/* submit */
.submit{margin-top:22px;background:rgba(255,255,255,0.8);padding:14px;border-radius:10px;}
.formWrap iframe{width:100%;height:700px;border:0;border-radius:6px;}

/* modal */
.modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);padding:18px;z-index:60;}
.modal.hidden{display:none;}
.modalBox{background:#fff;padding:20px;border-radius:12px;max-width:900px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,0.5);animation:pop .28s ease;}
@keyframes pop{from{transform:translateY(20px) scale(.98);opacity:0}to{transform:none;opacity:1}}
.close{position:absolute;right:18px;top:18px;padding:6px 8px;border-radius:8px;border:1px solid #ddd;background:#fafafa;cursor:pointer;}
.modalFooter{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin-top:12px;}
.btn{padding:8px 10px;border-radius:8px;border:1px solid #ddd;background:#fff;cursor:pointer;}

/* responsive */
@media(max-width:800px){
  .hero-card{flex-direction:column;}
  .hero-card img{width:100%;height:auto;}
  .controls{justify-content:flex-end;}
}
