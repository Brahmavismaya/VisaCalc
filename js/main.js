// Mobile nav
const burger = document.querySelector('.nav__burger');
const drawer = document.querySelector('.nav__drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    const open = drawer.classList.contains('open');
    spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity = open ? '0' : '1';
    spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
  });
}

// Active nav link
document.querySelectorAll('.nav__links a, .nav__drawer a').forEach(a => {
  if (a.href === location.href) a.classList.add('active');
});

// Tool search filter (homepage)
const searchInput = document.getElementById('tool-search');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.tool-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// Toast Notification Utility
window.showToast = function(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast toast-enter';
  toast.innerHTML = `<span style="color:var(--teal);font-size:1.1rem">✓</span> ${message}`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.replace('toast-enter', 'toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
};

// Copy result
document.querySelectorAll('.js-copy').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const text = target ? target.innerText : '';
    navigator.clipboard.writeText(text).then(() => {
      showToast('Result copied to clipboard!');
    });
  });
});

// Share result
document.querySelectorAll('.js-share').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.text || document.title;
    if (navigator.share) {
      navigator.share({ title: document.title, text, url: location.href }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(location.href).then(() => {
        showToast('Link copied to clipboard!');
      });
    }
  });
});

// PDF & Image export — handled by js/export.js (loaded on tool pages)
// .js-print  → exportPDF()   (clean pop-up print window, no ads)
// .js-image  → exportImage() (html2canvas PNG download)

// Score history utility
const ScoreHistory = {
  key: 'vc_history_' + (location.pathname.split('/').pop() || 'home'),
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  push(entry) {
    const h = this.get();
    h.unshift({ ...entry, ts: new Date().toLocaleDateString() });
    localStorage.setItem(this.key, JSON.stringify(h.slice(0, 3)));
  },
  render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const h = this.get();
    if (!h.length) { el.style.display = 'none'; return; }
    el.innerHTML = `<div class="history-card">
      <div class="history-card__header">🕑 Score History</div>
      ${h.map(e => `<div class="history-item"><span class="history-item__score">${e.score}</span><span class="history-item__date">${e.ts}</span></div>`).join('')}
    </div>`;
  }
};
window.ScoreHistory = ScoreHistory;

// Animate count-up
window.animateNumber = function(el, target, suffix = '') {
  const duration = 600;
  const start = performance.now();
  const startVal = 0;
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * ease) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-fade-up'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.tool-card, .blog-card, .trust-item').forEach(el => observer.observe(el));