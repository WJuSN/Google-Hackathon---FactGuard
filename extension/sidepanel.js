const BACKEND_URL = 'http://localhost:8080'; // Update after deploy to Cloud Run

const checkBtn    = document.getElementById('check-btn');
const statusEl    = document.getElementById('status');
const claimsList  = document.getElementById('claims-list');
const summaryBox  = document.getElementById('summary-box');
const summaryText = document.getElementById('summary-text');
const shareVerdict = document.getElementById('share-verdict');
const scoreBar    = document.getElementById('trust-score-bar');
const scoreLabel  = document.getElementById('score-label');
const barFill     = document.getElementById('trust-bar-fill');

checkBtn.addEventListener('click', async () => {
  checkBtn.disabled = true;
  claimsList.innerHTML = '';
  summaryBox.style.display = 'none';
  scoreBar.style.display = 'none';
  statusEl.textContent = 'Extracting page content…';

  // Ask background to pull content from tab
  chrome.runtime.sendMessage({ action: 'startFactCheck' }, async () => {
    // Wait briefly for storage write, then fetch payload
    await new Promise(r => setTimeout(r, 200));
    const { checkPayload } = await chrome.storage.session.get('checkPayload');

    if (!checkPayload?.text) {
      statusEl.textContent = '⚠️ Could not extract content from this page.';
      checkBtn.disabled = false;
      return;
    }

    statusEl.textContent = `Analysing "${checkPayload.title}"…`;

    // Open SSE stream to backend
    const url = new URL(`${BACKEND_URL}/check`);
    url.searchParams.set('text', checkPayload.text.slice(0, 6000));
    url.searchParams.set('source_url', checkPayload.url);

    const evtSource = new EventSource(url.toString());

    evtSource.addEventListener('claim_result', (e) => {
      const claim = JSON.parse(e.data);
      renderClaimCard(claim);
      statusEl.textContent = `Checking claim ${claim.id}…`;
    });

    evtSource.addEventListener('final_report', (e) => {
      const report = JSON.parse(e.data);
      renderFinalReport(report);
      evtSource.close();
      checkBtn.disabled = false;
      statusEl.textContent = 'Done ✓';
    });

    evtSource.addEventListener('error', () => {
      statusEl.textContent = '⚠️ Connection error. Check backend.';
      evtSource.close();
      checkBtn.disabled = false;
    });
  });
});

function renderClaimCard(claim) {
  const card = document.createElement('div');
  card.className = `claim-card ${claim.verdict}`;

  const verdictEmoji = { SUPPORTED: '🟢', CONTRADICTED: '🔴', UNVERIFIABLE: '🟡' };
  const sourcesHTML = (claim.sources || []).slice(0, 2).map(s =>
    `<a class="source-item" href="${s.url}" target="_blank">↗ ${s.title}</a>`
  ).join('');

  card.innerHTML = `
    <div class="claim-header">
      <span style="font-size:11px;color:#888">Claim ${claim.id}</span>
      <span class="claim-verdict">${verdictEmoji[claim.verdict] || ''} ${claim.verdict}</span>
    </div>
    <p class="claim-text">${claim.text}</p>
    <p class="claim-confidence">Confidence: ${Math.round(claim.confidence * 100)}%</p>
    <div class="sources">${sourcesHTML}</div>
  `;
  claimsList.appendChild(card);
}

function renderFinalReport(report) {
  const score = report.overall_trust_score;
  scoreBar.style.display = 'block';
  barFill.style.width = `${Math.round(score * 100)}%`;
  scoreLabel.textContent = `${Math.round(score * 100)}%`;

  let verdictClass = 'caution', verdictText = '⚠️ Share with caution';
  if (score >= 0.75) { verdictClass = 'safe'; verdictText = '✅ Safe to share'; }
  if (score < 0.4)   { verdictClass = 'danger'; verdictText = '🚫 Do not share'; }

  summaryText.textContent = report.summary;
  shareVerdict.textContent = verdictText;
  shareVerdict.className = verdictClass;
  summaryBox.style.display = 'block';
}