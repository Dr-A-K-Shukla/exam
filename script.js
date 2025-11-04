// script.js
const DURATION_MINUTES = 120; // 2 hours
const pages = ['exam-1.png', 'exam-2.png', 'exam-3.png']; // images for pages
const startBtn = document.getElementById('startBtn');
const viewer = document.getElementById('viewer');
const preMessage = document.getElementById('preMessage');
const status = document.getElementById('status');
const countdownEl = document.getElementById('countdown');
const nameInput = document.getElementById('studentName');

function now() { return new Date(); }

function secondsRemaining(end) {
  return Math.max(0, Math.floor((end - now())/1000));
}

function formatHHMMSS(sec) {
  const h = Math.floor(sec/3600);
  const m = Math.floor((sec%3600)/60);
  const s = sec%60;
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function blockShortcuts() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', function(e) {
    // Block Ctrl+P, Ctrl+S, Ctrl+Shift+I, F12
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'P' || e.key === 'S')) {
      e.preventDefault();
      return false;
    }
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key==='I' || e.key==='i' || e.key==='J' || e.key==='C'))) {
      e.preventDefault();
      return false;
    }
  }, false);
  // hide print via CSS media query present in style.css
}

function startExamSession(startDate) {
  // save start in sessionStorage to survive reloads (per tab)
  sessionStorage.setItem('exam_start', startDate.toISOString());
  sessionStorage.setItem('exam_name', nameInput.value || '');
  sessionStorage.setItem('exam_running','1');
  renderViewer();
  setupTimer();
}

function endExam(reason) {
  // lock viewer
  document.body.innerHTML = '<div class="centered"><h2>' + reason + '</h2></div>';
}

function renderViewer() {
  preMessage.style.display = 'none';
  viewer.style.display = 'block';
  viewer.innerHTML = '';
  pages.forEach(p => {
    const img = document.createElement('img');
    img.src = p;
    img.className = 'page';
    img.alt = 'Exam page';
    // prevent dragging
    img.ondragstart = () => false;
    viewer.appendChild(img);
    // transparent overlay to make selection harder
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    viewer.appendChild(overlay);
  });
  blockShortcuts();
}

function setupTimer() {
  const start = new Date(sessionStorage.getItem('exam_start'));
  const end = new Date(start.getTime() + DURATION_MINUTES*60000);
  status.textContent = 'Exam in progress';
  const iv = setInterval(() => {
    const rem = secondsRemaining(end);
    countdownEl.textContent = 'Time left: ' + formatHHMMSS(rem);
    if (rem <= 0) {
      clearInterval(iv);
      sessionStorage.removeItem('exam_start');
      endExam('Exam time over. Viewer locked.');
    }
  }, 1000);
}

// initialize if already running in this tab
if (sessionStorage.getItem('exam_running')) {
  renderViewer();
  setupTimer();
  const storedName = sessionStorage.getItem('exam_name') || '';
  if (storedName) nameInput.value = storedName;
  status.textContent = 'Exam in progress';
} else {
  status.textContent = 'Not started';
}

// Start button click handler - student click to start timer
startBtn.addEventListener('click', () => {
  if (!nameInput.value.trim()) {
    if (!confirm('You did not enter your name. Continue as anonymous?')) return;
  }
  const startDate = new Date();
  startExamSession(startDate);
});
