/* ============================================================
   SEVIA AFRICA - SITE SETTINGS  (edit these; everything else can stay)
   ============================================================ */
var SITE_CONFIG = {
  // Forms (Contribute, Partnership, Funding, Contact).
  // Paste your form-service URL here, e.g. 'https://formspree.io/f/xxxxxxxx'.
  // While this is empty, forms open the visitor's email app with their
  // message pre-filled (sent to formFallbackEmail) instead of pretending
  // to send it.
  formEndpoint: '',
  formFallbackEmail: 'partnerships.sevia@proton.me',

  // Transparency page: GitHub account (user or organization) to list repos from.
  githubUser: 'Sevia-Africa',

  // Donate page.
  gyvarLink: 'https://pay.gyvar.com/l/5gzd6y77ek1p',   // Gyvar payment link — leave empty to show "Coming soon"
  lightningAddress: 'seviaafrica@blink.sv',             // leave empty to show "Coming soon"
  bitcoinAddress: ''                                    // leave empty to show "Coming soon" — pending a non-API way to rotate
};

/* ============================================================
   FORM SUBMISSION (used by every form on the site)
   ============================================================ */
function collectFormData(form) {
  var data = {};
  function clean(s) { return (s || '').replace(/\*/g, '').replace(/\s+/g, ' ').trim(); }
  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    if (el.disabled || el.type === 'submit' || el.type === 'button' || el.type === 'hidden') return;
    var group = el.closest('.form-group');
    var q = group && group.querySelector('label');
    var key = clean(q ? q.textContent : '') || el.name || el.placeholder || el.id || 'Field';
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (!el.checked) return;
      var own = el.closest('label');
      var val = clean(own ? own.textContent : el.value) || el.value;
      data[key] = data[key] ? data[key] + ', ' + val : val;
    } else if (el.value && el.value.trim()) {
      var k = key, n = 2;
      while (Object.prototype.hasOwnProperty.call(data, k)) { k = key + ' (' + n + ')'; n++; }
      data[k] = el.value.trim();
    }
  });
  return data;
}

function submitSeviaForm(event, formName, successMessage, onDone) {
  event.preventDefault();
  var form = event.target;
  var data = collectFormData(form);
  var email = SITE_CONFIG.formFallbackEmail;

  if (SITE_CONFIG.formEndpoint) {
    var payload = Object.assign({ _subject: 'Sevia Africa - ' + formName, form: formName }, data);
    fetch(SITE_CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('bad response');
      alert(successMessage);
      form.reset();
      if (onDone) onDone();
    }).catch(function () {
      alert("Sorry, we couldn't send that just now. Please email us directly at " + email + ".");
    });
    return false;
  }

  // No form service connected yet: open the visitor's email app instead.
  var lines = Object.keys(data).map(function (k) { return k + ': ' + data[k]; });
  var subject = 'Sevia Africa - ' + formName;
  var mailto = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) +
               '&body=' + encodeURIComponent(lines.join('\n\n'));
  alert('Your email app will open with your message ready to send. If it does not, please email ' + email + ' directly.');
  window.location.href = mailto;
  return false;
}

/* ============================================================
   Africa connections map (Home > The Sevia Infrastructure)
   ============================================================ */
      (function () {
        // --- 1. JSON CONNECTIONS DATA ---
        const CONNECTIONS = [
          { from: 'Ghana', to: 'Tanzania' },
          { from: 'Kenya', to: 'Malawi' },
          { from: 'Nigeria', to: 'Rwanda' },
          { from: 'Tanzania', to: 'Malawi' },
          { from: 'Ghana', to: 'Kenya' },
          { from: 'Rwanda', to: 'Nigeria' },
          { from: 'Senegal', to: 'Ethiopia' },
          { from: 'Uganda', to: 'Ivory Coast' },
          { from: 'Cameroon', to: 'Zambia' },
          { from: 'DR Congo', to: 'South Africa' },
          { from: 'Mozambique', to: 'Ghana' },
          { from: 'Ethiopia', to: 'Nigeria' },
          { from: 'South Africa', to: 'Kenya' },
          { from: 'Senegal', to: 'DR Congo' },
          { from: 'Zambia', to: 'Rwanda' },
          { from: 'Ivory Coast', to: 'Mozambique' },
          { from: 'Uganda', to: 'Tanzania' },
          { from: 'Cameroon', to: 'Senegal' },
          { from: 'Morocco', to: 'Egypt' },
          { from: 'Algeria', to: 'Mali' },
          { from: 'Burkina Faso', to: 'Niger' },
          { from: 'Chad', to: 'Sudan' },
          { from: 'Somalia', to: 'Ethiopia' },
          { from: 'Angola', to: 'Zimbabwe' },
          { from: 'Namibia', to: 'South Africa' },
          { from: 'Benin', to: 'Ghana' },
          { from: 'Sierra Leone', to: 'Guinea' },
          { from: 'Guinea', to: 'Senegal' },
          { from: 'Morocco', to: 'Mali' },
          { from: 'Sudan', to: 'Egypt' },
          { from: 'Zimbabwe', to: 'Mozambique' },
          { from: 'Namibia', to: 'Angola' },
          { from: 'Niger', to: 'Nigeria' }
        ];

        // --- 2. SCREEN COORDINATES FOR CITIES (% OF IMAGE WIDTH & HEIGHT) ---
        const LOCATIONS = {
          'Morocco':      { x: 26.5, y: 34.0 },
          'Algeria':      { x: 33.0, y: 32.0 },
          'Egypt':        { x: 57.0, y: 31.5 },
          'Senegal':      { x: 21.8, y: 44.0 },
          'Sierra Leone': { x: 24.0, y: 48.0 },
          'Guinea':       { x: 25.0, y: 47.0 },
          'Mali':         { x: 32.0, y: 39.0 },
          'Ivory Coast':  { x: 31.0, y: 48.0 },
          'Burkina Faso': { x: 34.5, y: 43.0 },
          'Ghana':        { x: 34.0, y: 47.0 },
          'Benin':        { x: 55.5, y: 49.0 },
          'Niger':        { x: 41.0, y: 40.0 },
          'Nigeria':      { x: 59.5, y: 55.0 },
          'Cameroon':     { x: 50.5, y: 53.0 },
          'Chad':         { x: 49.0, y: 42.0 },
          'Sudan':        { x: 56.0, y: 40.0 },
          'Ethiopia':     { x: 62.0, y: 48.0 },
          'Somalia':      { x: 68.0, y: 50.0 },
          'Uganda':       { x: 56.0, y: 55.5 },
          'Kenya':        { x: 61.0, y: 56.0 },
          'Rwanda':       { x: 55.5, y: 58.0 },
          'DR Congo':     { x: 49.0, y: 60.0 },
          'Tanzania':     { x: 59.0, y: 62.0 },
          'Angola':       { x: 46.0, y: 68.0 },
          'Zambia':       { x: 52.0, y: 70.0 },
          'Malawi':       { x: 57.5, y: 70.0 },
          'Mozambique':   { x: 59.0, y: 75.0 },
          'Zimbabwe':     { x: 54.5, y: 75.0 },
          'Namibia':      { x: 45.0, y: 78.0 },
          'South Africa': { x: 50.0, y: 84.0 }
        };

        const COLORS = ['#FDB836', '#D9572E', '#6C63FF', '#2FA88A', '#E84393', '#2E86DE'];

        // --- 3. CANVAS & SCENE SETUP ---
        const canvas = document.getElementById('motion-canvas');
        const ctx = canvas.getContext('2d');
        const wrapper = document.getElementById('map-wrapper');
        const scene = document.getElementById('map-scene');

        let activeAnimations = [];

        function resizeCanvas() {
          canvas.width = wrapper.clientWidth;
          canvas.height = wrapper.clientHeight;
        }

        function getBezierPoint(p0, p1, p2, t) {
          const invT = 1 - t;
          return {
            x: invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x,
            y: invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y
          };
        }

        function triggerRandomConnection() {
          const randomConn = CONNECTIONS[Math.floor(Math.random() * CONNECTIONS.length)];
          const startLoc = LOCATIONS[randomConn.from];
          const endLoc = LOCATIONS[randomConn.to];

          if (!startLoc || !endLoc) return;

          const color = COLORS[Math.floor(Math.random() * COLORS.length)];

          activeAnimations.push({
            from: randomConn.from,
            to: randomConn.to,
            startLoc,
            endLoc,
            color,
            startTime: performance.now(),
            duration: 1000 + Math.random() * 600 // Faster duration: 1.0s to 1.6s
          });
        }

        // Faster connection spawn interval (every 350ms)
        setInterval(triggerRandomConnection, 350);

        // --- 4. FASTER 3D CAMERA DRIFT LOGIC ---
        function updateCameraDrift(time) {
          const t = time * 0.0012; // Increased scale for faster 3D camera drift

          const rotX = Math.sin(t * 0.8) * 6;
          const rotY = Math.cos(t * 0.6) * 9;
          const panX = Math.sin(t * 0.5) * 18;
          const panY = Math.cos(t * 0.7) * 12;

          scene.style.transform = `scale(1.18) translate3d(${panX}px, ${panY}px, 0px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }

        // --- 5. RENDER LOOP ---
        function draw(now) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          updateCameraDrift(now);

          const w = canvas.width;
          const h = canvas.height;

          // Draw location nodes
          Object.keys(LOCATIONS).forEach(name => {
            const loc = LOCATIONS[name];
            const px = (loc.x / 100) * w;
            const py = (loc.y / 100) * h;

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(253, 184, 54, 0.7)';
            ctx.fill();
          });

          // Render active motion arcs
          activeAnimations = activeAnimations.filter(anim => {
            const elapsed = now - anim.startTime;
            const progress = Math.min(elapsed / anim.duration, 1);

            const p0 = { x: (anim.startLoc.x / 100) * w, y: (anim.startLoc.y / 100) * h };
            const p2 = { x: (anim.endLoc.x / 100) * w, y: (anim.endLoc.y / 100) * h };

            const midX = (p0.x + p2.x) / 2;
            const midY = (p0.y + p2.y) / 2;
            const dx = p2.x - p0.x;
            const dy = p2.y - p0.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const p1 = {
              x: midX - dy * (dist * 0.0015),
              y: midY - Math.abs(dx) * 0.25 - 15
            };

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);

            const steps = Math.floor(progress * 40);
            for (let i = 1; i <= steps; i++) {
              const t = (i / 40) * progress;
              const pt = getBezierPoint(p0, p1, p2, t);
              ctx.lineTo(pt.x, pt.y);
            }

            ctx.strokeStyle = anim.color;
            ctx.lineWidth = 2;
            ctx.shadowColor = anim.color;
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.shadowBlur = 0;

            const pulsePt = getBezierPoint(p0, p1, p2, progress);
            ctx.beginPath();
            ctx.arc(pulsePt.x, pulsePt.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#FFF';
            ctx.shadowColor = anim.color;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;

            return progress < 1;
          });

          requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        requestAnimationFrame(draw);
      })();
      

/* ============================================================
   GitHub repositories feed (Transparency)
   ============================================================ */
(function () {
  // ---------------- DONATE PAGE ----------------
  // Gyvar, Lightning, and on-chain Bitcoin are switched on from SITE_CONFIG at the top of this file.
  // Gyvar: paste a Gyvar payment link into SITE_CONFIG.gyvarLink to switch it on.
  // Lightning / Bitcoin: paste an address into SITE_CONFIG.lightningAddress /
  // SITE_CONFIG.bitcoinAddress to switch each one on (QR code + tap-to-pay link).
  var DONATE_CONFIG = {
    gyvarLink: SITE_CONFIG.gyvarLink,
    lightningAddress: SITE_CONFIG.lightningAddress,
    bitcoinAddress: SITE_CONFIG.bitcoinAddress
  };

  // Until a Gyvar link is set it shows as "Coming soon" and does nothing,
  // so no one is invited to click through to somewhere that doesn't exist.
  var gBtn = document.getElementById('gyvar-btn');
  if (DONATE_CONFIG.gyvarLink) {
    gBtn.href = DONATE_CONFIG.gyvarLink;
  } else {
    document.getElementById('gyvar-pill').hidden = false;
    gBtn.classList.add('is-pending');
    gBtn.textContent = 'COMING SOON';
    gBtn.setAttribute('aria-disabled', 'true');
  }

  // ---------------- BITCOIN PAYMENTS (Lightning + on-chain) ----------------
  function renderQr(containerId, text) {
    var el = document.getElementById(containerId);
    if (!el || !window.QRCode) return;
    el.innerHTML = '';
    new QRCode(el, {
      text: text,
      width: 134,
      height: 134,
      colorDark: '#1E1309',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  function setupBitcoinOption(opts) {
    var col = document.getElementById(opts.colId);
    var addr = opts.address;
    if (!addr) {
      col.classList.add('is-pending');
      document.getElementById(opts.pillId).hidden = false;
      return;
    }
    renderQr(opts.qrId, opts.uriPrefix + addr);
    var textEl = document.getElementById(opts.textId);
    textEl.textContent = addr;
    var linkEl = document.getElementById(opts.linkId);
    linkEl.href = opts.uriPrefix + addr;
  }

  setupBitcoinOption({
    colId: 'donate-lightning', pillId: 'lightning-pill', qrId: 'lightning-qr',
    textId: 'lightning-address-text', linkId: 'lightning-address-link',
    address: DONATE_CONFIG.lightningAddress, uriPrefix: 'lightning:'
  });

  setupBitcoinOption({
    colId: 'donate-onchain', pillId: 'onchain-pill', qrId: 'onchain-qr',
    textId: 'onchain-address-text', linkId: 'onchain-address-link',
    address: DONATE_CONFIG.bitcoinAddress, uriPrefix: 'bitcoin:'
  });

  // Copy-to-clipboard for both addresses
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetEl = document.getElementById(btn.getAttribute('data-copy-target'));
      var text = targetEl ? targetEl.textContent.trim() : '';
      if (!text) return;
      var done = function () {
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {});
      } else {
        var tmp = document.createElement('textarea');
        tmp.value = text;
        document.body.appendChild(tmp);
        tmp.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        document.body.removeChild(tmp);
      }
    });
  });
})();

/* ============================================================
   Donate page options (Bitcoin / Gyvar)
   ============================================================ */
(function () {
  // GitHub account comes from SITE_CONFIG.githubUser (top of this file).
  var SEVIA_GITHUB_ORG = SITE_CONFIG.githubUser;

  var listEl = document.getElementById('github-repo-list');
  var linkEl = document.getElementById('github-repo-viewall');
  if (!listEl) return;
  if (linkEl) linkEl.href = 'https://github.com/' + SEVIA_GITHUB_ORG;

  function renderRepos(repos) {
    if (!Array.isArray(repos) || repos.length === 0) {
      listEl.innerHTML = '<span class="github-repo-status">No public repositories yet.</span>';
      return;
    }
    listEl.innerHTML = repos.slice(0, 6).map(function (r) {
      return '<a href="' + r.html_url + '" target="_blank" rel="noopener" class="github-repo-item">' +
        '<span class="github-repo-name">' + r.name + '</span>' +
        (r.description ? '<span class="github-repo-desc">' + r.description + '</span>' : '') +
        '</a>';
    }).join('');
  }

  function showFallback() {
    listEl.innerHTML = '<span class="github-repo-status">Repositories will appear here once connected.</span>';
  }

  // Try the org endpoint first; if that fails (wrong slug, personal account,
  // rate limit, offline, etc.) fall back to the user endpoint, then to a
  // static message so the page never looks broken.
  fetch('https://api.github.com/orgs/' + SEVIA_GITHUB_ORG + '/repos?sort=updated&per_page=6')
    .then(function (res) { if (!res.ok) throw new Error('org fetch failed'); return res.json(); })
    .then(renderRepos)
    .catch(function () {
      fetch('https://api.github.com/users/' + SEVIA_GITHUB_ORG + '/repos?sort=updated&per_page=6')
        .then(function (res) { if (!res.ok) throw new Error('user fetch failed'); return res.json(); })
        .then(renderRepos)
        .catch(showFallback);
    });
})();

/* ============================================================
   Navigation, Explore page, Contribute form, modals
   ============================================================ */
  // ==========================================
  // VIEW SWITCHER ROUTER
  // ==========================================
  function switchView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(v => v.classList.remove('active'));

    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ==========================================
  // ANCHOR / CROSS-PAGE NAVIGATION
  // ==========================================
  function scrollToAnchor(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ==========================================
  // EXPLORE PAGE: HUB / DETAIL TOGGLE
  // Keeps the deep-dive sections tucked away until a
  // nav item or teaser card explicitly asks for them.
  // ==========================================
  function showExploreHub() {
    const hub = document.getElementById('explore-hub');
    const details = document.getElementById('explore-details');
    if (details) details.style.display = 'none';
    if (hub) hub.style.display = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showExploreDetail(anchorId) {
    const hub = document.getElementById('explore-hub');
    const details = document.getElementById('explore-details');
    if (hub) hub.style.display = 'none';
    if (details) details.style.display = '';

    const target = document.getElementById(anchorId);
    let sectionEl = target;
    while (sectionEl && !sectionEl.classList.contains('explore-detail-section')) {
      sectionEl = sectionEl.parentElement;
    }
    document.querySelectorAll('.explore-detail-section').forEach(function (s) {
      s.style.display = (s === sectionEl) ? '' : 'none';
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(function () {
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  function goToExplore(anchorId) {
    switchView('explore-page');
    setTimeout(function () {
      if (anchorId) {
        showExploreDetail(anchorId);
      } else {
        showExploreHub();
      }
    }, 150);
  }

  function showExploreGroup(anchorIds) {
    const hub = document.getElementById('explore-hub');
    const details = document.getElementById('explore-details');
    if (hub) hub.style.display = 'none';
    if (details) details.style.display = '';

    const idSet = new Set(anchorIds);
    let firstEl = null;
    document.querySelectorAll('.explore-detail-section').forEach(function (s) {
      if (idSet.has(s.id)) {
        s.style.display = '';
        if (!firstEl) firstEl = s;
      } else {
        s.style.display = 'none';
      }
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
    setTimeout(function () {
      if (firstEl) firstEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  function goToExploreGroup(anchorIds) {
    switchView('explore-page');
    setTimeout(function () {
      showExploreGroup(anchorIds);
    }, 150);
  }


  function goToContribute(category) {
    switchView('contribute-page');
    setTimeout(() => {
      goToStep(2);
      if (category) {
        const box = document.querySelector('#contribution-category-group input[value="' + category + '"]');
        if (box) box.checked = true;
      }
    }, 150);
  }

  // ==========================================
  // MULTI-STEP FORM CONTROLLER
  // ==========================================
  function goToStep(stepNumber) {
    const steps = document.querySelectorAll('#contributor-form .form-step');
    steps.forEach(step => step.classList.remove('active'));
    
    const targetStep = document.getElementById('step-' + stepNumber);
    if (targetStep) {
      targetStep.classList.add('active');
    }
  }

  function handleFormSubmit(event) {
    return submitSeviaForm(
      event,
      'Contribution application',
      'Thank you for your application to Sevia Africa! Our team will review your contribution details and get back to you shortly.',
      function () { goToStep(1); }
    );
  }

  // ==========================================
  // MODAL CONTROLLERS
  // ==========================================
  function toggleContactModal(show) {
    const modal = document.getElementById('contact-modal');
    modal.classList.toggle('active', show);
  }

  function toggleLayersBackendModal(show) {
    const modal = document.getElementById('layers-backend-modal');
    modal.classList.toggle('active', show);
  }

  function openLayersBackendModal() {
    toggleLayersBackendModal(true);
  }

  // ==========================================
  // "WHERE DO I FIT?" CARD ROUTING
  // Clicking a home page category card takes the
  // visitor to that category's deep-dive on the
  // Explore Sevia page (see How Contribution Works).
  // ==========================================
  const roleKeyToCategory = {
    educator: 'educate',
    mentor: 'mentor',
    translator: 'translate',
    builder: 'build',
    researcher: 'research',
    connector: 'connect',
    funder: 'fund',
    organizer: 'organize',
    amplifier: 'amplify'
  };

  function showCriteria(roleKey) {
    const category = roleKeyToCategory[roleKey] || roleKey;
    goToExplore('cat-' + category);
  }
