/**
 * VisaCalc Export Module
 * Provides PDF (print) and Image (canvas) export for calculator results.
 * Loaded on all tool pages.
 */

/* ─── PDF Export ─────────────────────────────────────────────── */
window.exportPDF = function () {
  const resultBox = document.getElementById('result-box');
  if (!resultBox) { console.warn('No result-box found'); return; }

  const toolTitle = document.title.replace(' | VisaCalc', '').trim();
  const today     = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const scoreEl   = document.getElementById('result-score') || document.getElementById('result-total');
  const labelEl   = document.getElementById('result-label');
  const score     = scoreEl ? scoreEl.textContent : '';
  const label     = labelEl ? labelEl.textContent : '';

  // Rebuild the breakdown table from scratch — no inherited inline styles
  const origTable = document.getElementById('breakdown-table');
  let tableHTML = '';
  if (origTable) {
    const rows = Array.from(origTable.querySelectorAll('tr'));
    if (rows.length) {
      const colCount = rows[0].children.length;
      const colWidths = colCount === 3
        ? ['42%', '35%', '23%']
        : colCount === 2
          ? ['60%', '40%']
          : Array(colCount).fill((100 / colCount).toFixed(1) + '%');

      let headHTML = '';
      let bodyHTML = '';

      rows.forEach((row, rowIdx) => {
        const cells = Array.from(row.children);
        const isHeader = cells.some(c => c.tagName === 'TH');
        const isLast   = !isHeader && rowIdx === rows.length - 1;

        // Check if this row is a section sub-header (e.g. "vs Recent Draw Cutoffs:")
        const isSubhead = !isHeader && cells.length >= 1 &&
          cells[0].colSpan > 1;

        if (isHeader) {
          headHTML += `<tr>${cells.map(c => `<th>${c.textContent.trim()}</th>`).join('')}</tr>`;
        } else if (isSubhead) {
          bodyHTML += `<tr><td colspan="${colCount}" class="td-subhead">${cells[0].textContent.trim()}</td></tr>`;
        } else {
          // Detect muted cells: second column typically, or cells with muted inline style
          const tds = cells.map((c, ci) => {
            const txt   = c.textContent.trim();
            const style = (c.getAttribute('style') || '').toLowerCase();
            const isMuted   = style.includes('text-muted') || style.includes('0.85rem') || (ci === 1 && colCount === 3 && rowIdx > 0 && !isLast);
            const isSuccess = style.includes('success') || style.includes('22c55') || style.includes('16a34');
            const isDanger  = style.includes('danger')  || style.includes('ef444') || style.includes('dc262');
            const isStrong  = c.querySelector('strong') !== null;

            let cls = '';
            let inlineStyle = '';
            if (isLast)       inlineStyle = '';   // handled by CSS on last row
            else if (isSuccess) inlineStyle = 'style="color:#16a34a;font-weight:700"';
            else if (isDanger)  inlineStyle = 'style="color:#dc2626;font-weight:700"';
            else if (isMuted)   cls = 'class="td-muted"';

            const cellContent = isStrong ? `<strong>${txt}</strong>` : txt;
            return `<td ${cls} ${inlineStyle}>${cellContent}</td>`;
          }).join('');
          bodyHTML += `<tr>${tds}</tr>`;
        }
      });

      const colGroup = `<colgroup>${colWidths.map(w => `<col style="width:${w}">`).join('')}</colgroup>`;
      tableHTML = `<table>${colGroup}<thead>${headHTML}</thead><tbody>${bodyHTML}</tbody></table>`;
    }
  }

  // Tips section
  const tipsEl = document.getElementById('tips-section');
  let tipsHTML = '';
  if (tipsEl && tipsEl.style.display !== 'none') {
    const tipItems = Array.from(tipsEl.querySelectorAll('.tip-item div:last-child'));
    if (tipItems.length) {
      tipsHTML = `
      <div class="section-label">Ways to Improve</div>
      <div class="tips-section">
        ${tipItems.map((t, i) => `
          <div class="tip-item">
            <div class="tip-dot">${i + 1}</div>
            <div class="tip-text">${t.textContent}</div>
          </div>`).join('')}
      </div>`;
    }
  }

  const printDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${toolTitle} — VisaCalc</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @page { size: A4 portrait; margin: 0; }

  body {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-size: 10pt;
    color: #1e293b;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Hero Header ── */
  .hero {
    background: linear-gradient(135deg, #1a2744 0%, #142255 50%, #006b62 100%);
    padding: 24px 30px 20px;
    position: relative;
    overflow: hidden;
  }
  .hero-orb-1 {
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,180,166,0.18) 0%, transparent 70%);
    top: -100px; right: -80px;
  }
  .hero-orb-2 {
    position: absolute;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    bottom: -60px; left: 20px;
  }
  .hero-inner {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .brand { font-size: 22pt; font-weight: 800; color: #fff; letter-spacing: -0.5px; line-height: 1; }
  .brand-teal { color: #00e5d4; }
  .brand-url { font-size: 7.5pt; color: rgba(255,255,255,0.45); margin-top: 4px; letter-spacing: 0.04em; }
  .hero-meta { text-align: right; font-size: 8pt; color: rgba(255,255,255,0.55); line-height: 1.8; }
  .hero-meta .hero-report { font-size: 9.5pt; font-weight: 600; color: #fff; display: block; }

  /* ── Title strip ── */
  .title-strip {
    background: #f8fafc;
    padding: 13px 30px;
    border-bottom: 3px solid #00b4a6;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tool-name { font-size: 12pt; font-weight: 700; color: #1a2744; }
  .tool-sub { font-size: 8pt; color: #94a3b8; margin-top: 2px; }
  .date-chip {
    background: #e0fdf4;
    color: #065f46;
    font-size: 7.5pt;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 100px;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  /* ── Body ── */
  .body { padding: 22px 30px 90px; }

  /* ── Score Card ── */
  .score-card {
    background: linear-gradient(120deg, #1a2744 0%, #1e3a6e 60%, #0a4d47 100%);
    border-radius: 14px;
    padding: 0;
    margin: 0 0 24px;
    display: flex;
    overflow: hidden;
    page-break-inside: avoid;
    position: relative;
  }
  .score-card-accent {
    width: 8px;
    background: linear-gradient(180deg, #00e5d4, #00b4a6);
    flex-shrink: 0;
  }
  .score-card-inner {
    padding: 20px 22px;
    display: flex;
    align-items: center;
    gap: 22px;
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .score-card-inner::after {
    content: '';
    position: absolute;
    right: -30px; top: -50px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: rgba(0,229,212,0.08);
  }
  .score-bubble {
    background: rgba(0,229,212,0.12);
    border: 1.5px solid rgba(0,229,212,0.35);
    border-radius: 12px;
    padding: 14px 18px;
    text-align: center;
    flex-shrink: 0;
    min-width: 100px;
  }
  .score-num { font-size: 22pt; font-weight: 800; color: #00e5d4; line-height: 1; letter-spacing: -1px; }
  .score-sub-label { font-size: 6.5pt; color: rgba(255,255,255,0.45); margin-top: 5px; text-transform: uppercase; letter-spacing: 0.06em; }
  .score-right { position: relative; z-index: 1; }
  .score-main-label { font-size: 11pt; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 8px; }
  .score-pill {
    display: inline-block;
    background: rgba(0,229,212,0.15);
    color: #00e5d4;
    font-size: 7pt;
    font-weight: 600;
    padding: 3px 11px;
    border-radius: 100px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* ── Section heading ── */
  .section-label {
    font-size: 6.5pt;
    font-weight: 700;
    color: #00b4a6;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-bottom: 9px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, #cbd5e1, transparent); }

  /* ── Table ── */
  .table-wrap { margin-bottom: 24px; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 8px rgba(26,39,68,0.07); page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  col.col-name { width: 42%; }
  col.col-basis { width: 35%; }
  col.col-amount { width: 23%; }
  thead th { background: #1a2744; color: #fff; padding: 9px 14px; font-size: 9pt; font-weight: 600; text-align: left; letter-spacing: 0.03em; vertical-align: middle; }
  td { padding: 9px 14px; font-size: 9pt; border-bottom: 1px solid #f1f5f9; color: #1a2744; vertical-align: middle; line-height: 1.4; }
  tbody tr:nth-child(odd) td { background: #fff; }
  tbody tr:nth-child(even) td { background: #f8fafc; }
  tbody tr:last-child td { border-bottom: none; font-weight: 700; color: #1a2744; background: #f0fdf9; border-top: 2px solid #00b4a6; }
  .td-muted { color: #64748b !important; font-size: 8.5pt !important; }
  .td-subhead { background: #f1f5f9 !important; font-weight: 700 !important; color: #1a2744 !important; font-size: 8pt !important; text-transform: uppercase; letter-spacing: 0.05em; padding-top: 10px !important; }

  /* ── Tips ── */
  .tips-section { margin-bottom: 22px; }
  .tip-item { display: flex; align-items: flex-start; gap: 11px; background: #f0fdfa; border-left: 3px solid #00b4a6; border-radius: 0 8px 8px 0; padding: 8px 13px; margin-bottom: 7px; page-break-inside: avoid; }
  .tip-dot { width: 19px; height: 19px; border-radius: 50%; background: linear-gradient(135deg, #00b4a6, #0097a7); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 7.5pt; font-weight: 700; color: #fff; margin-top: 1px; }
  .tip-text { font-size: 8.5pt; color: #1e293b; line-height: 1.55; }

  /* ── Disclaimer ── */
  .disclaimer { margin-top: 20px; padding-top: 11px; border-top: 1px solid #f1f5f9; font-size: 7pt; color: #b0bec5; line-height: 1.6; }

  /* ── Fixed Footer ── */
  .pdf-footer {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #1a2744;
    padding: 8px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-brand { font-size: 9.5pt; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .footer-teal { color: #00e5d4; }
  .footer-right { font-size: 7.5pt; color: rgba(255,255,255,0.40); }
  .footer-divider { width: 1px; height: 14px; background: rgba(255,255,255,0.15); }
</style>
</head>
<body>

<div class="hero">
  <div class="hero-orb-1"></div>
  <div class="hero-orb-2"></div>
  <div class="hero-inner">
    <div>
      <div class="brand">Visa<span class="brand-teal">Calc</span></div>
      <div class="brand-url">visapoints.eu.org</div>
    </div>
    <div class="hero-meta">
      <span class="hero-report">Immigration Results Report</span>
      Generated ${today}
    </div>
  </div>
</div>

<div class="title-strip">
  <div>
    <div class="tool-name">${toolTitle}</div>
    <div class="tool-sub">Personalised estimate based on your inputs</div>
  </div>
  <div class="date-chip">April 2026 Rules</div>
</div>

<div class="body">

  <div class="score-card">
    <div class="score-card-accent"></div>
    <div class="score-card-inner">
      <div class="score-bubble">
        <div class="score-num">${score}</div>
        <div class="score-sub-label">Your Result</div>
      </div>
      <div class="score-right">
        <div class="score-main-label">${label}</div>
        <span class="score-pill">VisaCalc · ${today}</span>
      </div>
    </div>
  </div>

  <div class="section-label">Detailed Breakdown</div>
  <div class="table-wrap">
    ${tableHTML}
  </div>

  ${tipsHTML}

  <div class="disclaimer">
    Figures are calculated based on rates current as of the date above and the inputs you provided. Individual circumstances may vary. &nbsp;·&nbsp; VisaCalc, visapoints.eu.org
  </div>

</div>

<div class="pdf-footer">
  <div class="footer-brand">Visa<span class="footer-teal">Calc</span></div>
  <div class="footer-divider"></div>
  <div class="footer-right">© 2026 VisaCalc &nbsp;·&nbsp; For personal reference only</div>
</div>

</body>
</html>`;

  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) { showToast('Pop-up blocked — please allow pop-ups for this site.'); return; }
  w.document.open();
  w.document.write(printDoc);
  w.document.close();
  w.onload = () => {
    setTimeout(() => {
      w.focus();
      w.print();
    }, 500);
  };
};

/* ─── Image Export via html2canvas ──────────────────────────── */
window.exportImage = function () {
  const resultBox = document.getElementById('result-box');
  if (!resultBox) return;

  showToast('Preparing image, please wait…');

  function doCapture() {
    const origShadow = resultBox.style.boxShadow;
    resultBox.style.boxShadow = 'none';

    window.html2canvas(resultBox, {
      backgroundColor: '#ffffff',
      scale: 2.5,
      useCORS: true,
      logging: false,
    }).then(canvas => {
      resultBox.style.boxShadow = origShadow;
      const link = document.createElement('a');
      const toolSlug = location.pathname.split('/').pop().replace('.html', '');
      link.download = `visacalc-${toolSlug}-result.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Image saved!');
    }).catch(err => {
      console.error(err);
      showToast('Could not capture image. Try the PDF option.');
    });
  }

  if (window.html2canvas) {
    doCapture();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = doCapture;
    script.onerror = () => showToast('Failed to load image library. Check your connection.');
    document.head.appendChild(script);
  }
};

/* ─── Wire up buttons globally ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-print').forEach(btn => {
    btn.onclick = null;
    btn.addEventListener('click', window.exportPDF);
  });
  document.querySelectorAll('.js-image').forEach(btn => {
    btn.addEventListener('click', window.exportImage);
  });
});
