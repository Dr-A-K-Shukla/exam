const DURATION_MS = 2*60*60*1000; // 2 hours
const loginBtn = document.getElementById('loginBtn');
const exportBtn = document.getElementById('exportBtn');
const admEl = document.getElementById('adm');
const nameEl = document.getElementById('name');
const msgEl = document.getElementById('msg');
const preExam = document.getElementById('preExam');
const openBtn = document.getElementById('openBtn');
const examSection = document.getElementById('examSection');
const timerEl = document.getElementById('timer');
const closedSection = document.getElementById('closed');
const closedMsg = document.getElementById('closedMsg');

const RECORDS_KEY = 'exam_records_v1';
let timerInterval = null;
let endTime = null;

function nowIST(){
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset()*60000);
  const ist = new Date(utc + 5.5*3600000);
  return ist.toISOString().replace('T',' ').split('.')[0];
}
function loadRecords(){try{return JSON.parse(localStorage.getItem(RECORDS_KEY)||'[]')}catch(e){return[]}}
function saveRecords(arr){localStorage.setItem(RECORDS_KEY,JSON.stringify(arr))}
function addRecord(adm,name){const recs=loadRecords();recs.push({admission:adm,name:name,time:nowIST()});saveRecords(recs)}
function exportCSV(){
  const recs=loadRecords();
  if(!recs.length){alert('No records');return}
  let csv='Admission No,Student Name,Login Time (IST)\n';
  recs.forEach(r=>csv+=`${r.admission},${r.name},${r.time}\n`);
  const blob=new Blob([csv],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='records.csv';a.click();URL.revokeObjectURL(url);
}

function beep(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(880,ctx.currentTime);
    o.connect(ctx.destination);o.start();setTimeout(()=>{o.stop();ctx.close()},500);
  }catch(e){}
}
function closeExam(msg){beep();examSection.style.display='none';closedSection.style.display='block';closedMsg.textContent=msg;sessionStorage.clear();clearInterval(timerInterval)}
document.addEventListener('visibilitychange',()=>{if(document.hidden)closeExam('Exam closed due to refresh/minimize')});
window.addEventListener('blur',()=>closeExam('Exam closed due to refresh/minimize'));
window.addEventListener('beforeunload',()=>closeExam('Exam closed due to refresh/minimize'));

loginBtn.onclick=()=>{
  const adm=admEl.value.trim(),name=nameEl.value.trim();
  if(!adm||!name){msgEl.textContent='Please fill all fields';return}
  addRecord(adm,name);msgEl.textContent='Login successful at '+nowIST();
  document.getElementById('loginSection').style.display='none';preExam.style.display='block';
  sessionStorage.setItem('exam_user',JSON.stringify({admission:adm,name:name}));
}
openBtn.onclick=()=>{
  const user=JSON.parse(sessionStorage.getItem('exam_user')||'{}');
  if(!user.admission){alert('Please login first');return}
  preExam.style.display='none';examSection.style.display='block';
  endTime=Date.now()+DURATION_MS;sessionStorage.setItem('exam_end',endTime);
  timerInterval=setInterval(updateTimer,1000);
}
function updateTimer(){
  const left=endTime-Date.now();
  if(left<=0){clearInterval(timerInterval);closeExam('Exam time is over. Thank you.');return}
  const h=Math.floor(left/3600000),m=Math.floor((left%3600000)/60000),s=Math.floor((left%60000)/1000);
  timerEl.textContent=`Time left: ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
exportBtn.onclick=()=>exportCSV();
