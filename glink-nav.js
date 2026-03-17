/* ================================================================
   G-LINK CARD — Hamburger Nav Injection
   Drop this file in your GitHub repo, then add ONE line to index.html:
   <script src="glink-nav.js"></script>  (before </body>)
   ================================================================ */

(function() {
  // ── STYLES ──────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ── TOP BAR ── */
    #gl-topbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9000;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      background: rgba(2,5,8,0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(80,200,255,0.18);
    }

    #gl-topbar-logo {
      font-family: "Rajdhani", sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 6px;
      color: #90DEFF;
      text-transform: uppercase;
      text-decoration: none;
      text-shadow: 0 0 20px rgba(80,200,255,0.5);
    }

    /* ── HAMBURGER BUTTON ── */
    #gl-ham-btn {
      width: 40px; height: 40px;
      background: rgba(80,200,255,0.06);
      border: 1px solid rgba(80,200,255,0.25);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: all 0.2s;
      z-index: 9100;
      position: relative;
    }
    #gl-ham-btn:hover {
      background: rgba(80,200,255,0.12);
      border-color: rgba(80,200,255,0.55);
      box-shadow: 0 0 16px rgba(80,200,255,0.2);
    }
    #gl-ham-btn span {
      display: block;
      width: 18px; height: 1.5px;
      background: #90DEFF;
      border-radius: 2px;
      transition: all 0.32s cubic-bezier(0.68,-0.55,0.27,1.55);
      transform-origin: center;
      box-shadow: 0 0 6px rgba(80,200,255,0.5);
    }
    #gl-ham-btn.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
    #gl-ham-btn.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    #gl-ham-btn.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

    /* ── OVERLAY ── */
    #gl-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.65);
      z-index: 8800;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    #gl-overlay.open { opacity: 1; pointer-events: all; }

    /* ── NAV PANEL ── */
    #gl-panel {
      position: fixed;
      top: 0; right: -320px;
      width: 300px; height: 100vh;
      background: rgba(5,12,22,0.98);
      border-left: 1px solid rgba(80,200,255,0.2);
      z-index: 8900;
      transition: right 0.36s cubic-bezier(0.4,0,0.2,1);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 70px 0 30px;
      backdrop-filter: blur(40px);
    }
    #gl-panel::before {
      content: '';
      position: absolute;
      top: 0; right: 0;
      width: 100%; height: 200px;
      background: radial-gradient(ellipse 80% 60% at 80% 0%, rgba(80,200,255,0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    #gl-panel.open { right: 0; }

    /* ── NAV SECTION LABEL ── */
    .gl-nav-sec {
      font-family: "Rajdhani", sans-serif;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 4px;
      color: rgba(80,200,255,0.35);
      text-transform: uppercase;
      padding: 20px 24px 8px;
    }

    /* ── NAV ITEMS ── */
    .gl-nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 24px;
      text-decoration: none;
      color: rgba(192,220,238,0.75);
      font-family: "Rajdhani", sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      transition: all 0.2s;
      border-left: 2px solid transparent;
      position: relative;
    }
    .gl-nav-item:hover {
      color: #90DEFF;
      background: rgba(80,200,255,0.06);
      border-left-color: rgba(80,200,255,0.6);
      text-shadow: 0 0 16px rgba(80,200,255,0.4);
    }
    .gl-nav-item.active {
      color: #90DEFF;
      background: rgba(80,200,255,0.08);
      border-left-color: #50C8FF;
      text-shadow: 0 0 16px rgba(80,200,255,0.5);
    }

    .gl-nav-icon {
      width: 30px; height: 30px;
      background: rgba(80,200,255,0.07);
      border: 1px solid rgba(80,200,255,0.18);
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .gl-nav-item:hover .gl-nav-icon,
    .gl-nav-item.active .gl-nav-icon {
      background: rgba(80,200,255,0.14);
      border-color: rgba(80,200,255,0.4);
      box-shadow: 0 0 10px rgba(80,200,255,0.2);
    }

    .gl-nav-badge {
      margin-left: auto;
      background: rgba(80,200,255,0.15);
      border: 1px solid rgba(80,200,255,0.4);
      color: #90DEFF;
      font-family: "Rajdhani", sans-serif;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 1px;
      padding: 2px 8px;
      border-radius: 20px;
      text-shadow: 0 0 8px rgba(80,200,255,0.5);
    }
    .gl-nav-badge.gold {
      background: rgba(201,168,76,0.15);
      border-color: rgba(201,168,76,0.4);
      color: #F0CC6E;
      text-shadow: 0 0 8px rgba(201,168,76,0.4);
    }

    .gl-nav-divider {
      height: 1px;
      background: rgba(80,200,255,0.1);
      margin: 12px 24px;
    }

    /* ── USER CARD IN NAV ── */
    #gl-nav-user {
      margin: auto 20px 0;
      padding: 16px;
      background: rgba(80,200,255,0.05);
      border: 1px solid rgba(80,200,255,0.2);
      border-radius: 12px;
    }
    #gl-nav-user .u-name {
      font-family: "Rajdhani", sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #D8F0FF;
      text-transform: uppercase;
    }
    #gl-nav-user .u-tier {
      font-family: "Rajdhani", sans-serif;
      font-size: 10px;
      letter-spacing: 2px;
      color: #F0CC6E;
      text-transform: uppercase;
      margin-top: 3px;
      text-shadow: 0 0 10px rgba(201,168,76,0.4);
    }
    #gl-nav-user .u-pts {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: 10px;
    }
    #gl-nav-user .u-pts-val {
      font-family: "Cormorant Garamond", serif;
      font-size: 2rem;
      font-weight: 300;
      color: #F0CC6E;
      line-height: 1;
      text-shadow: 0 0 20px rgba(201,168,76,0.4);
    }
    #gl-nav-user .u-pts-label {
      font-family: "Rajdhani", sans-serif;
      font-size: 8px;
      letter-spacing: 2px;
      color: rgba(80,200,255,0.4);
      text-transform: uppercase;
      padding-bottom: 4px;
    }

    /* ── BODY OFFSET ── */
    body { padding-top: 56px !important; }

    /* ── SCROLL LOCK ── */
    body.gl-nav-open { overflow: hidden; }

    /* ── POINTS BADGE in topbar ── */
    #gl-pts-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(201,168,76,0.1);
      border: 1px solid rgba(201,168,76,0.3);
      border-radius: 20px;
      padding: 5px 12px;
      font-family: "Rajdhani", sans-serif;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #F0CC6E;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      text-shadow: 0 0 8px rgba(201,168,76,0.4);
    }
    #gl-pts-chip:hover {
      background: rgba(201,168,76,0.18);
      border-color: rgba(201,168,76,0.55);
      box-shadow: 0 0 14px rgba(201,168,76,0.2);
    }
  `;
  document.head.appendChild(style);

  // ── HTML ──────────────────────────────────────────────────────────
  const html = `
    <div id="gl-overlay"></div>

    <nav id="gl-topbar">
      <a href="https://glinkcard.com" id="gl-topbar-logo">G-LINK</a>
      <div style="display:flex;align-items:center;gap:10px;">
        <a href="/glink-points-dashboard.html" id="gl-pts-chip">⭐ 1,847 PTS</a>
        <button id="gl-ham-btn" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <div id="gl-panel">
      <div class="gl-nav-sec">Navigation</div>

      <a class="gl-nav-item active" href="https://glinkcard.com">
        <span class="gl-nav-icon">🏠</span>
        Home
      </a>
      <a class="gl-nav-item" href="/glink-points-dashboard.html">
        <span class="gl-nav-icon">⭐</span>
        Points Dashboard
        <span class="gl-nav-badge gold">1,847</span>
      </a>
      <a class="gl-nav-item" href="/CEO-GLINK-GARLAND.html">
        <span class="gl-nav-icon">💳</span>
        My G-Link Card
      </a>
      <a class="gl-nav-item" href="/glink-points-dashboard.html#perks">
        <span class="gl-nav-icon">🎁</span>
        Partner Perks
      </a>

      <div class="gl-nav-divider"></div>
      <div class="gl-nav-sec">Account</div>

      <a class="gl-nav-item" href="/glink-points-dashboard.html#refer">
        <span class="gl-nav-icon">🔗</span>
        Refer & Earn
        <span class="gl-nav-badge gold">+50 PTS</span>
      </a>
      <a class="gl-nav-item" href="mailto:hello@glinkcard.com">
        <span class="gl-nav-icon">✉️</span>
        Contact
      </a>

      <div class="gl-nav-divider"></div>

      <div id="gl-nav-user">
        <div class="u-name">Garland Miller</div>
        <div class="u-tier">⚡ Influencer Tier</div>
        <div class="u-pts">
          <div>
            <div class="u-pts-val">1,847</div>
            <div class="u-pts-label">G-Points Balance</div>
          </div>
          <a href="/glink-points-dashboard.html" style="font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;color:rgba(80,200,255,0.6);text-decoration:none;text-transform:uppercase;padding-bottom:4px;">
            VIEW ALL →
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', html);

  // ── LOGIC ──────────────────────────────────────────────────────────
  const btn     = document.getElementById('gl-ham-btn');
  const panel   = document.getElementById('gl-panel');
  const overlay = document.getElementById('gl-overlay');

  function openNav() {
    btn.classList.add('open');
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('gl-nav-open');
  }

  function closeNav() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('gl-nav-open');
  }

  btn.addEventListener('click', () => btn.classList.contains('open') ? closeNav() : openNav());
  overlay.addEventListener('click', closeNav);

  // Close on ESC
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  // Mark active page
  const path = window.location.pathname;
  document.querySelectorAll('.gl-nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') && item.getAttribute('href').includes(path) && path !== '/') {
      item.classList.add('active');
    } else if (path === '/' && item.getAttribute('href') === 'https://glinkcard.com') {
      item.classList.add('active');
    }
  });

})();
