/* ================================================================
   G-LINK CARD — Email Capture Injection
   Add ONE line to index.html before </body>:
   <script src="glink-email.js"></script>
   ================================================================ */

(function() {

// ── SUPABASE ────────────────────────────────────────────────────
const SUPABASE_URL = 'https://qahcpvxiytduqirtjort.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaGNwdnhpeXRkdXFpcnRqb3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjUzODksImV4cCI6MjA4OTMwMTM4OX0.qRKkrdeRZqLVKThu-TFg3zqOV_MCCzOxIKb8PE5dtO4';

async function saveEmail(email, source) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/email_waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        email,
        source,
        signed_up_at: new Date().toISOString()
      })
    });
    return res.ok || res.status === 409; // 409 = already exists, still ok
  } catch(e) {
    console.error('Email save error:', e);
    return false;
  }
}

// ── STYLES ──────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  /* ── POPUP ── */
  #gl-popup-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.75);
    z-index: 9500;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    opacity: 0; pointer-events: none;
    transition: opacity 0.4s;
    backdrop-filter: blur(6px);
  }
  #gl-popup-overlay.show { opacity: 1; pointer-events: all; }

  #gl-popup {
    background: #0C1120;
    border: 1px solid rgba(201,168,76,0.35);
    border-radius: 20px;
    padding: 36px 28px 28px;
    max-width: 380px; width: 100%;
    position: relative;
    box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.1);
    transform: translateY(20px);
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }
  #gl-popup-overlay.show #gl-popup { transform: translateY(0); }

  #gl-popup::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #8A6A1F, #C9A84C, #F0CC6E, #C9A84C, #8A6A1F);
    background-size: 200%;
    animation: shimmerBar 3s linear infinite;
  }
  @keyframes shimmerBar { 0% { background-position: 200%; } 100% { background-position: -200%; } }

  #gl-popup::after {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .gl-popup-close {
    position: absolute; top: 14px; right: 16px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50%; width: 28px; height: 28px;
    cursor: pointer; color: rgba(255,255,255,0.4);
    font-size: 14px; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; line-height: 1;
  }
  .gl-popup-close:hover { background: rgba(255,255,255,0.12); color: #fff; }

  .gl-popup-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(201,168,76,0.12);
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 20px; padding: 5px 12px;
    font-family: "Rajdhani", sans-serif;
    font-size: 10px; font-weight: 600; letter-spacing: 2px;
    color: #F0CC6E; text-transform: uppercase;
    margin-bottom: 16px; position: relative; z-index: 1;
  }
  .gl-badge-dot { width: 6px; height: 6px; background: #F0CC6E; border-radius: 50%; animation: badgePulse 1.5s ease-in-out infinite; }
  @keyframes badgePulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .gl-popup-headline {
    font-family: "Cormorant Garamond", serif;
    font-size: 28px; font-weight: 300; line-height: 1.15;
    color: #F4FAFF; margin-bottom: 10px;
    position: relative; z-index: 1;
  }
  .gl-popup-headline em { font-style: italic; color: #90DEFF; }

  .gl-popup-sub {
    font-family: "Rajdhani", sans-serif;
    font-size: 13px; font-weight: 400; letter-spacing: 0.5px;
    color: rgba(192,220,238,0.7); line-height: 1.5;
    margin-bottom: 22px; position: relative; z-index: 1;
  }

  .gl-email-form { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }

  .gl-email-input {
    width: 100%; padding: 14px 16px;
    background: rgba(80,200,255,0.05);
    border: 1px solid rgba(80,200,255,0.2);
    border-radius: 10px;
    color: #F4FAFF; font-family: "Rajdhani", sans-serif;
    font-size: 14px; letter-spacing: 0.5px;
    outline: none; transition: all 0.2s;
  }
  .gl-email-input::placeholder { color: rgba(80,200,255,0.3); }
  .gl-email-input:focus { border-color: rgba(80,200,255,0.55); box-shadow: 0 0 16px rgba(80,200,255,0.1); }

  .gl-submit-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #8A6A1F, #C9A84C, #F0CC6E);
    border: none; border-radius: 10px;
    color: #050810; font-family: "Rajdhani", sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .gl-submit-btn:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }
  .gl-submit-btn:active { transform: translateY(0); }
  .gl-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .gl-success-state {
    text-align: center; padding: 10px 0;
    display: none; position: relative; z-index: 1;
  }
  .gl-success-icon { font-size: 2.5rem; margin-bottom: 10px; display: block; }
  .gl-success-title {
    font-family: "Cormorant Garamond", serif;
    font-size: 22px; font-weight: 300; color: #F0CC6E; margin-bottom: 6px;
  }
  .gl-success-sub {
    font-family: "Rajdhani", sans-serif;
    font-size: 12px; letter-spacing: 1px; color: rgba(192,220,238,0.6);
  }

  .gl-privacy {
    font-family: "Rajdhani", sans-serif;
    font-size: 10px; letter-spacing: 0.5px;
    color: rgba(80,200,255,0.25); text-align: center;
    margin-top: 8px; position: relative; z-index: 1;
  }

  /* ── BOTTOM SECTION ── */
  #gl-email-section {
    position: relative;
    padding: 80px 20px;
    background: linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.04) 50%, transparent 100%);
    border-top: 1px solid rgba(80,200,255,0.1);
    text-align: center;
    overflow: hidden;
  }
  #gl-email-section::before {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .gl-section-eyebrow {
    font-family: "Rajdhani", sans-serif;
    font-size: 10px; font-weight: 500; letter-spacing: 5px;
    color: #F0CC6E; text-transform: uppercase;
    margin-bottom: 16px; display: block;
    text-shadow: 0 0 20px rgba(201,168,76,0.4);
  }

  .gl-section-headline {
    font-family: "Cormorant Garamond", serif;
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 300; line-height: 1.1;
    color: #F4FAFF; margin-bottom: 14px;
    position: relative; z-index: 1;
  }
  .gl-section-headline em { font-style: italic; color: #90DEFF; }

  .gl-section-sub {
    font-family: "Rajdhani", sans-serif;
    font-size: 14px; letter-spacing: 1px;
    color: rgba(192,220,238,0.65); max-width: 420px;
    margin: 0 auto 32px; line-height: 1.6;
    position: relative; z-index: 1;
  }

  .gl-section-form {
    display: flex; gap: 10px; max-width: 440px;
    margin: 0 auto 16px; position: relative; z-index: 1;
  }
  @media (max-width: 480px) { .gl-section-form { flex-direction: column; } }

  .gl-section-form .gl-email-input { flex: 1; }
  .gl-section-form .gl-submit-btn { white-space: nowrap; padding: 14px 24px; width: auto; }
  @media (max-width: 480px) { .gl-section-form .gl-submit-btn { width: 100%; } }

  .gl-section-count {
    font-family: "Rajdhani", sans-serif;
    font-size: 11px; letter-spacing: 2px;
    color: rgba(80,200,255,0.4); position: relative; z-index: 1;
  }
  .gl-section-count strong { color: #90DEFF; }

  .gl-section-success {
    display: none; text-align: center;
    position: relative; z-index: 1;
  }
  .gl-section-success .gl-success-icon { font-size: 3rem; margin-bottom: 12px; display: block; }
  .gl-section-success .gl-success-title {
    font-family: "Cormorant Garamond", serif;
    font-size: 26px; font-weight: 300; color: #F0CC6E; margin-bottom: 8px;
  }
  .gl-section-success .gl-success-sub {
    font-family: "Rajdhani", sans-serif;
    font-size: 12px; letter-spacing: 1.5px; color: rgba(192,220,238,0.5);
  }
`;
document.head.appendChild(style);

// ── POPUP HTML ───────────────────────────────────────────────────
const popupHTML = `
  <div id="gl-popup-overlay">
    <div id="gl-popup">
      <button class="gl-popup-close" onclick="glClosePopup()">✕</button>
      <div class="gl-popup-badge"><div class="gl-badge-dot"></div> Early Access</div>
      <div class="gl-popup-headline">The future of<br><em>business networking</em><br>is here.</div>
      <div class="gl-popup-sub">Join the waitlist for exclusive early access to G-Link Card — the digital business card built for elite professionals.</div>
      <div class="gl-email-form" id="popup-form">
        <input class="gl-email-input" type="email" id="popup-email" placeholder="your@email.com" autocomplete="email"/>
        <button class="gl-submit-btn" onclick="glSubmitPopup()">GET EARLY ACCESS</button>
        <div class="gl-privacy">No spam. Ever. Unsubscribe anytime.</div>
      </div>
      <div class="gl-success-state" id="popup-success">
        <span class="gl-success-icon">🎉</span>
        <div class="gl-success-title">You're on the list.</div>
        <div class="gl-success-sub">WE'LL BE IN TOUCH · GLINKCARD.COM</div>
      </div>
    </div>
  </div>
`;

// ── BOTTOM SECTION HTML ──────────────────────────────────────────
const sectionHTML = `
  <div id="gl-email-section">
    <span class="gl-section-eyebrow">Join the Waitlist</span>
    <div class="gl-section-headline">Be first.<br><em>Get early access.</em></div>
    <div class="gl-section-sub">G-Link Card is the most sophisticated digital business card ever built. Cinematic video · Points rewards · Elite partner perks.</div>
    <div class="gl-section-form" id="section-form">
      <input class="gl-email-input" type="email" id="section-email" placeholder="your@email.com" autocomplete="email"/>
      <button class="gl-submit-btn" onclick="glSubmitSection()">JOIN WAITLIST</button>
    </div>
    <div class="gl-section-count" id="section-count">
      Join <strong id="waitlist-count">—</strong> professionals already on the list
    </div>
    <div class="gl-section-success" id="section-success">
      <span class="gl-success-icon">✨</span>
      <div class="gl-success-title">Welcome to G-Link.</div>
      <div class="gl-success-sub">EARLY ACCESS CONFIRMED · WE'LL BE IN TOUCH</div>
    </div>
  </div>
`;

// ── INJECT HTML ──────────────────────────────────────────────────
document.body.insertAdjacentHTML('beforeend', popupHTML);

// Inject section before </body> — find footer or append
const footer = document.querySelector('.footer') || document.querySelector('footer');
if (footer) {
  footer.insertAdjacentHTML('beforebegin', sectionHTML);
} else {
  document.body.insertAdjacentHTML('beforeend', sectionHTML);
}

// ── POPUP LOGIC ──────────────────────────────────────────────────
function glShowPopup() {
  if (localStorage.getItem('gl_email_captured')) return;
  document.getElementById('gl-popup-overlay').classList.add('show');
}

window.glClosePopup = function() {
  document.getElementById('gl-popup-overlay').classList.remove('show');
  // Try again in 5 min if they close without subscribing
  setTimeout(glShowPopup, 5 * 60 * 1000);
};

window.glSubmitPopup = async function() {
  const input = document.getElementById('popup-email');
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = 'rgba(255,80,96,0.6)';
    input.focus();
    return;
  }
  const btn = document.querySelector('#gl-popup .gl-submit-btn');
  btn.disabled = true;
  btn.textContent = 'SAVING...';
  const ok = await saveEmail(email, 'popup');
  if (ok) {
    localStorage.setItem('gl_email_captured', '1');
    document.getElementById('popup-form').style.display = 'none';
    document.getElementById('popup-success').style.display = 'block';
    loadWaitlistCount();
    setTimeout(() => {
      document.getElementById('gl-popup-overlay').classList.remove('show');
    }, 2800);
  } else {
    btn.disabled = false;
    btn.textContent = 'GET EARLY ACCESS';
    input.style.borderColor = 'rgba(255,80,96,0.6)';
  }
};

window.glSubmitSection = async function() {
  const input = document.getElementById('section-email');
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = 'rgba(255,80,96,0.6)';
    input.focus();
    return;
  }
  const btn = document.querySelector('#section-form .gl-submit-btn');
  btn.disabled = true;
  btn.textContent = 'SAVING...';
  const ok = await saveEmail(email, 'bottom_section');
  if (ok) {
    localStorage.setItem('gl_email_captured', '1');
    document.getElementById('section-form').style.display = 'none';
    document.getElementById('section-count').style.display = 'none';
    document.getElementById('section-success').style.display = 'block';
    loadWaitlistCount();
  } else {
    btn.disabled = false;
    btn.textContent = 'JOIN WAITLIST';
  }
};

// ── WAITLIST COUNT ───────────────────────────────────────────────
async function loadWaitlistCount() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/email_waitlist?select=id`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    const el = document.getElementById('waitlist-count');
    if (el && data?.length) el.textContent = data.length.toLocaleString();
  } catch(e) {}
}

// ── ENTER KEY SUPPORT ────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (document.activeElement?.id === 'popup-email') glSubmitPopup();
    if (document.activeElement?.id === 'section-email') glSubmitSection();
  }
  if (e.key === 'Escape') glClosePopup();
});

// ── TRIGGER POPUP AFTER 8s ───────────────────────────────────────
setTimeout(glShowPopup, 8000);

// ── LOAD COUNT ON INIT ───────────────────────────────────────────
loadWaitlistCount();

})();
