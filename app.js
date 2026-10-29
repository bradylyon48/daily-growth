"use strict";
const BOOKS={AH:"Atomic Habits",LT:"Let Them",CD:"Courage to Be Disliked",PM:"Psychology of Money",DB:"Don't Believe Everything You Think",ME:"My habit"};
const DEFAULTS=[
{id:"h1",book:"AH",text:"Do the 2-minute version of my keystone habit",how:"Pick one keystone habit (e.g. 10 pushups, 1 page of reading, a 2-minute walk). Start it right after an existing routine like morning coffee and do at least 2 minutes; continuing is a bonus.",why:"Atomic Habits: the 2-minute rule makes starting easy, and every rep is a vote for who you're becoming.",mini:"Set a 2-minute timer and do just the first step (shoes on, book open, mat out)",up:"Raise it to 10 minutes or add a second set"},
{id:"h2",book:"AH",text:"Phone in another room for one 25-minute focus block",how:"Put your phone in a different room, set a 25-minute timer on a non-phone clock, and work on one important task until it rings.",why:"Atomic Habits: make bad habits invisible and hard. Environment beats willpower.",mini:"Put the phone face-down out of reach for 10 minutes",up:"Do two 25-minute blocks with a 5-minute break"},
{id:"h3",book:"PM",text:"Log today's spending and move a small amount to savings",how:"Write down every purchase today (notes app or paper, 3 minutes). Circle one you could have cut, then transfer that amount, even $2-5, to savings.",why:"Psychology of Money: wealth is the money you don't spend, and small amounts compound into room for error and freedom.",extra:"Do your daily spending check-in with Finance Bot.",mini:"Write down your single biggest purchase today and move $1 to savings",up:"Set up an automatic weekly transfer to savings"},
{id:"h4",book:"LT",text:"Write one 'Let Them / Let Me' sentence",how:"Think of one person or situation that bothered you today. Write a single sentence: 'Let them ___. Let me ___.' (about 2 minutes).",why:"Let Them Theory: release what others do and put your energy into your own next move.",mini:"Say 'let them' out loud once when something annoys you",up:"Hold one boundary today without over-explaining or apologizing"},
{id:"h5",book:"CD",text:"Write one way today beat yesterday",how:"At day's end write one line: 'Yesterday I ___, today I ___.' Compare only to your own yesterday, not anyone else.",why:"Courage to Be Disliked: healthy striving is comparing to your past self, not others.",mini:"Name it in your head before bed",up:"Keep a running 'yesterday vs today' log for the week"},
{id:"h6",book:"CD",text:"Do one named act of contribution",how:"Pick a specific person and do one helpful thing for them (a thank-you text, a ride, help with a task). Write down who and what.",why:"Courage to Be Disliked: a sense of contribution, not praise, is where worth comes from.",mini:"Send one specific thank-you text right now",up:"Help someone where you'll get no credit at all"},
{id:"h7",book:"DB",text:"Write one thought and answer 'What do I know vs assume?'",how:"When a stressful thought shows up, write it down. Under it, write two columns: what you actually know, and what you're assuming (3 minutes).",why:"Don't Believe Everything You Think: thoughts and feelings are not facts.",mini:"Ask yourself once: is this a fact or just a thought?",up:"Do it for three thoughts today"},
{id:"h8",book:"DB",text:"Turn one worry into one next action and do it",how:"Pick a current worry. Write the smallest useful action you can take (an email, a call, a 5-minute task) and do it today. If you're upset, wait 10 minutes before deciding anything big.",why:"Don't Believe Everything You Think: worry isn't problem-solving; the next useful action is.",mini:"Take 10 slow breaths, then write the one next step",up:"Clear three small worry-actions today"},
{id:"h9",book:"AH",text:"Write tomorrow's top 3 and lay out what you need tonight",how:"Before bed, write the 3 most important things for tomorrow, then set out what you need for #1 (clothes, gym bag, laptop open to the doc). About 5 minutes.",why:"Atomic Habits: make it obvious. Design tomorrow's environment so the right choice is the easy one.",mini:"Write just tomorrow's #1 task on a sticky note",up:"Also block time on your calendar for the top 3"},
{id:"h10",book:"ME",text:"Answer today's reflection prompt in the check-in",how:"Read the prompt in the Evening check-in and write one honest sentence in the note field.",why:"Reflection is how the tracker learns from you and how you see your own patterns.",mini:"One sentence is enough",up:"Write three honest sentences"}];
const LESSONS=[["AH","Get 1% better each day. Small gains compound into remarkable results."],["AH","You do not rise to your goals; you fall to your systems."],["AH","Every action is a vote for the type of person you want to become."],["AH","Never miss twice. Missing once is an accident; twice is a new habit."],["AH","Make it obvious, easy and satisfying. Make bad habits invisible and hard."],["AH","Consistency beats intensity. Show up even on the small days."],["LT","Let them. Let people be who they are, and spend your energy on what you control."],["LT","Let them, then let me: after you release others, choose your own next move."],["LT","Stop comparing timelines. Their pace is not your path."],["LT","Invest in people who reciprocate. Boundaries need no guilt."],["CD","You do not need anyone's approval to live your life."],["CD","Your past does not decide your future. What you do now does."],["CD","Separate tasks: how others judge you is their task, not yours."],["CD","Contribution, not recognition, is the source of a meaningful life."],["PM","Wealth is what you don't see: the money you didn't spend."],["PM","Define 'enough'. The goalpost that keeps moving is the most dangerous one."],["PM","Saving buys freedom and room for error. Automate it."],["PM","Compounding rewards patience more than brilliance."],["DB","Thoughts are not facts. Feelings are not facts either."],["DB","Worry feels like problem-solving but isn't. Find the next useful action."],["DB","Don't decide while the storm is loud. Let the feeling settle first."]];
const PROMPTS=["Can I control this, or only what I do next?","Would I still choose this if nobody could praise or criticize me?","What do I actually know, what am I assuming, and what action can I take now?","What vote did I cast today for the person I'm becoming?","Where did I chase approval today, and what would 'let them' have looked like?","How am I better than yesterday's me, even by 1%?","What is 'enough' for me this month?","What friction can I remove so tomorrow's good habit is easier?","Whose task was this really: mine or theirs?","Which thought today felt true but wasn't a fact?"];
const PHASES=["Week 1 · Foundation: start small with 2-minute versions","Week 2 · Environment: design your space and cues","Week 3 · Identity: act as the person you want to be","Week 4 · Freedom: money, boundaries, calm mind","Days 29–30 · Review and set your next 30"];
const MOODS=["😣","😕","😐","🙂","😄"];
const KEY="daily-growth-v1";
const pad=n=>String(n).padStart(2,"0");
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=k=>{const[y,m,d]=k.split("-").map(Number);return new Date(y,m-1,d)};
const addDays=(k,n)=>{const d=parse(k);d.setDate(d.getDate()+n);return dkey(d)};
const diff=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let today=dkey(new Date());
const fresh=()=>({v:2,habits:JSON.parse(JSON.stringify(DEFAULTS)),log:{},checkins:{},start:today,updated:0});
let S=fresh();
// ---- storage: localStorage + IndexedDB ----
let db=null;
function idb(){return new Promise(r=>{try{const q=indexedDB.open("daily-growth",1);q.onupgradeneeded=()=>q.result.createObjectStore("kv");q.onsuccess=()=>{db=q.result;r(db)};q.onerror=()=>r(null)}catch(e){r(null)}})}
function idbGet(){return new Promise(r=>{if(!db)return r(null);try{const g=db.transaction("kv").objectStore("kv").get(KEY);g.onsuccess=()=>r(g.result||null);g.onerror=()=>r(null)}catch(e){r(null)}})}
function idbPut(v){if(!db)return;try{db.transaction("kv","readwrite").objectStore("kv").put(v,KEY)}catch(e){}}
function valid(s){return s&&Array.isArray(s.habits)&&s.log&&s.checkins&&s.start}
function save(){S.updated=Date.now();const j=JSON.stringify(S);try{localStorage.setItem(KEY,j)}catch(e){}idbPut(j)}
async function load(){await idb();let a=null,b=null;try{a=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){}try{b=JSON.parse(await idbGet()||"null")}catch(e){}
 const c=[a,b].filter(valid).sort((x,y)=>(y.updated||0)-(x.updated||0));if(c[0])S=c[0];save();
 if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().then(p=>{S._persist=p}).catch(()=>{});}
// ---- logic ----
const valid_ids=()=>new Set(S.habits.map(h=>h.id));
const pctOf=k=>{const v=valid_ids();const l=(S.log[k]||[]).filter(i=>v.has(i));return l.length/(S.habits.length||1)};
const counted=k=>pctOf(k)>=.5;
function stats(){let streak=0,k=counted(today)?today:addDays(today,-1);while(diff(S.start,k)>=0&&counted(k)){streak++;k=addDays(k,-1)}
 let best=0,run=0;for(let i=0;i<=diff(S.start,today);i++){if(counted(addDays(S.start,i))){run++;best=Math.max(best,run)}else run=0}
 const y=addDays(today,-1),missedY=diff(S.start,y)>=0&&!counted(y);const past=[];for(let i=1;i<=14;i++){const d=addDays(today,-i);if(diff(S.start,d)>=0)past.push(d)}
 const per=S.habits.map(h=>{const rate=past.length?past.filter(d=>(S.log[d]||[]).includes(h.id)).length/past.length:0;let r=0,d=(S.log[today]||[]).includes(h.id)?today:y;while(diff(S.start,d)>=0&&(S.log[d]||[]).includes(h.id)){r++;d=addDays(d,-1)}return{h,rate,run:r}});
 const focus=past.length>=3?per.filter(p=>p.rate<.5).sort((a,b)=>a.rate-b.rate).slice(0,2).map(p=>p.h.id):[];
 const levelUp=per.filter(p=>p.run>=7).map(p=>p.h.id);return{streak,best,missedY,per,focus,levelUp,past}}
function insights(st){const out=[],ci=Object.keys(S.checkins);
 if(!st.past.length&&!ci.length)out.push(["🌱","Day one. Check off whatever you can today, then do the evening check-in. Insights grow with your history."]);
 if(st.missedY&&!counted(today))out.push(["⚡","Yesterday was a miss. Never miss twice: even the 2-minute versions count today."]);
 if(st.streak>=3)out.push(["🔥",`You're on a ${st.streak}-day streak. Every day is a vote for the person you're becoming.`]);
 st.focus.forEach(id=>{const h=S.habits.find(x=>x.id===id);if(h)out.push(["🎯",`"${h.text}" is your most-skipped item lately. Try the 2-minute version: ${h.mini}.`])});
 st.levelUp.forEach(id=>{const h=S.habits.find(x=>x.id===id);if(h)out.push(["🚀",`7+ days in a row on "${h.text}". Ready to level up: ${h.up}.`])});
 if(ci.length>=4){const avg=a=>a.reduce((x,y)=>x+y,0)/a.length,hi=ci.filter(k=>pctOf(k)>=.7).map(k=>S.checkins[k].mood),lo=ci.filter(k=>pctOf(k)<.7).map(k=>S.checkins[k].mood);
  if(hi.length>=2&&lo.length>=2&&Math.abs(avg(hi)-avg(lo))>=.5)out.push(["💡",`Your mood averages ${avg(hi).toFixed(1)} on strong days vs ${avg(lo).toFixed(1)} on lighter days.`]);
  const cnt={};ci.forEach(k=>{const h=S.checkins[k].hardest;if(h)cnt[h]=(cnt[h]||0)+1});const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0],th=S.habits.find(x=>x.id===top);
  if(th&&cnt[top]>=2)out.push(["🧩",`You've marked "${th.text}" hardest ${cnt[top]} times. Make it easier: change the cue or the time of day.`])}
 if(!out.length)out.push(["✨","Steady and consistent. Keep stacking days."]);return out}
const dayIdx=()=>diff("2026-01-01",today),mod=(a,n)=>((a%n)+n)%n;
// ---- UI ----
let tab="today",open="",range=7,editing="";
const $=s=>document.querySelector(s);
function haptic(){try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),1800)}
function confetti(x,y){const cs=["#5e72eb","#38bdb2","#f5b84a","#ef7aa1"];for(let i=0;i<18;i++){const c=document.createElement("div");c.className="confetti";c.style.left=x+"px";c.style.top=y+"px";c.style.background=cs[i%4];const a=Math.random()*Math.PI*2,r=60+Math.random()*90;c.style.setProperty("--x",Math.cos(a)*r+"px");c.style.setProperty("--y",Math.sin(a)*r+60+"px");document.body.appendChild(c);setTimeout(()=>c.remove(),1200)}}
function header(title){const d=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});$("#hdr").innerHTML=`<div class="date">${esc(d)}</div><h1>${esc(title)}</h1>`}
function ring(p){const r=40,c=2*Math.PI*r;return`<div class="ring"><svg width="96" height="96" viewBox="0 0 96 96"><circle class="bgc" cx="48" cy="48" r="${r}"/><circle class="fg" cx="48" cy="48" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/></svg><div class="pct">${Math.round(p*100)}%</div></div>`}
function vToday(){const st=stats(),done=S.log[today]||[],p=pctOf(today),dayNum=diff(S.start,today)+1,L=LESSONS[mod(dayIdx(),LESSONS.length)];
 const mt=st.missedY&&!counted(today);const left=S.habits.length-done.filter(i=>valid_ids().has(i)).length;
 const msg=p>=1?"Perfect day. Every box checked.":p>=.5?"Today counts. Keep going.":done.length?`${left} to go. Half the list makes it count.`:"Start with the easiest one.";
 let h=`<div class="card hero">${ring(p)}<div><div class="lbl">Today</div><div class="big">${msg}</div><div class="sub">Day ${Math.min(dayNum,30)} of 30 · ${st.streak}-day streak</div></div></div>
 <div class="chips"><div class="chip"><b>${st.streak}</b><span>Streak · best ${st.best}</span></div><div class="chip ${mt?"warn":"ok"}"><b>${mt?"Today!":"On track"}</b><span>Never miss twice</span></div><div class="chip"><b>${Math.min(dayNum,30)}/30</b><span>30-day plan</span></div></div>
 <div class="card lesson"><span class="tag">Lesson of the day · ${esc(BOOKS[L[0]])}</span><div class="q">${esc(L[1])}</div></div><div class="sec">Checklist</div>`;
 S.habits.forEach(x=>{const on=done.includes(x.id),f=st.focus.includes(x.id),u=st.levelUp.includes(x.id),o=open===x.id;
  h+=`<div class="item ${on?"done":""} ${f?"focus":""}" data-id="${x.id}"><div class="cb" data-act="tog"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><div class="body"><div class="title" data-act="tog">${esc(x.text)}</div><div class="meta"><span class="tag">${esc(BOOKS[x.book]||"My habit")}</span>${f?`<span class="note w">🎯 Focus today</span>`:""}${u?`<span class="note o">🚀 Ready to level up</span>`:""}<button class="more" data-act="det">${o?"Hide ▴":"How & why ▾"}</button></div>
  <div class="det ${o?"open":""}"><div>${x.how?`<p><b>How:</b> ${esc(x.how)}</p>`:""}${x.why?`<p><b>Why:</b> ${esc(x.why)}</p>`:""}${x.extra?`<p><b>Setup idea:</b> ${esc(x.extra)}</p>`:""}<p><b>2-minute version:</b> ${esc(x.mini)}</p>${u?`<p><b>Level up:</b> ${esc(x.up)}</p>`:""}</div></div></div></div>`});
 h+=`<div class="muted" style="padding:4px 6px">Tap to check off. A day counts at 50%. Resets at local midnight.</div>`+checkin();return h}
function checkin(){const c=S.checkins[today]||{mood:0,note:"",hardest:""};
 return`<div class="sec">Evening check-in</div><div class="card"><span class="tag">Reflect</span><div class="q" style="font-weight:600;margin:8px 0 4px">${esc(PROMPTS[mod(dayIdx(),PROMPTS.length)])}</div>
 <label class="f">Mood</label><div class="moods">${MOODS.map((m,i)=>`<button data-mood="${i+1}" class="${c.mood===i+1?"on":""}" aria-label="Mood ${i+1}">${m}</button>`).join("")}</div>
 <label class="f">Hardest item today</label><select id="hard"><option value="">Pick one</option>${S.habits.map(h=>`<option value="${h.id}" ${c.hardest===h.id?"selected":""}>${esc(h.text)}</option>`).join("")}</select>
 <label class="f">Short note</label><textarea id="note" placeholder="One honest sentence">${esc(c.note)}</textarea>
 <div class="row" style="margin-top:12px"><button class="btn p" id="saveci" ${c.mood?"":"disabled"}>${S.checkins[today]?"Update check-in":"Save check-in"}</button></div></div>`}
function vProgress(){const st=stats();let h=`<div class="chips"><div class="chip"><b>${st.streak}</b><span>Current streak</span></div><div class="chip"><b>${st.best}</b><span>Best streak</span></div><div class="chip"><b>${Object.keys(S.checkins).length}</b><span>Check-ins</span></div></div>`;
 const dn=diff(S.start,today)+1,ph=dn<=7?0:dn<=14?1:dn<=21?2:dn<=28?3:4;
 h+=`<div class="sec">30-day plan</div><div class="card"><div style="font-weight:600;margin-bottom:12px">${dn<=30?`Day ${dn} · ${PHASES[ph]}`:"You finished the 30 days. Start a fresh cycle in Settings."}</div><div class="plan">`;
 for(let i=0;i<30;i++){const d=addDays(S.start,i),p=pctOf(d),fu=diff(today,d)>0;h+=`<div class="${fu?"fu":p>=.5?"f":p>0?"p":""} ${d===today?"t":""}">${i+1}</div>`}
 h+=`</div></div><div class="sec">Last 12 weeks</div><div class="card"><div class="heat">`;
let s0=addDays(today,-83);s0=addDays(s0,-parse(s0).getDay());
 for(let d=s0;diff(d,today)>=0||parse(d).getDay()!==0;d=addDays(d,1)){if(diff(today,d)>0){h+=`<div style="background:transparent"></div>`;continue}const p=pctOf(d);h+=`<div title="${d} · ${Math.round(p*100)}%" style="${p>0?`background:rgba(94,114,235,${.18+p*.82})`:""}${d===today?";outline:2px solid var(--a2)":""}"></div>`}
 h+=`</div><div class="muted" style="margin-top:10px">Darker = more of the list done.</div></div><div class="sec">By book</div><div class="card"><div class="seg">${[7,30].map(r=>`<button data-range="${r}" class="${range===r?"on":""}">${r} days</button>`).join("")}</div>`;
 Object.keys(BOOKS).forEach(b=>{const hs=S.habits.filter(x=>x.book===b);if(!hs.length)return;let t=0,g=0;for(let i=0;i<range;i++){const d=addDays(today,-i);if(diff(S.start,d)<0)continue;t+=hs.length;g+=hs.filter(x=>(S.log[d]||[]).includes(x.id)).length}const v=t?Math.round(g/t*100):0;h+=`<div class="bar"><div class="l"><span>${esc(BOOKS[b])}</span><b>${v}%</b></div><div class="tr"><div class="fl" style="width:${v}%"></div></div></div>`});
 return h+`</div>`}
function vInsights(){const st=stats();let h=`<div class="card">${insights(st).map(([i,t])=>`<div class="ins"><i>${i}</i><div>${esc(t)}</div></div>`).join("")}</div>`;
 const ci=Object.keys(S.checkins).sort().reverse().slice(0,7);if(ci.length){h+=`<div class="sec">Recent check-ins</div><div class="card">`+ci.map(k=>{const c=S.checkins[k];return`<div class="ins"><i>${MOODS[c.mood-1]||""}</i><div><b>${esc(parse(k).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"}))}</b> · ${Math.round(pctOf(k)*100)}%${c.note?`<div class="muted">${esc(c.note)}</div>`:""}</div></div>`}).join("")+`</div>`}
 const sk=st.per.filter(p=>st.past.length).sort((a,b)=>a.rate-b.rate);if(st.past.length>=3){h+=`<div class="sec">Completion, last ${st.past.length} days</div><div class="card">`+sk.map(p=>`<div class="bar"><div class="l"><span>${esc(p.h.text)}</span><b>${Math.round(p.rate*100)}%</b></div><div class="tr"><div class="fl" style="width:${p.rate*100}%"></div></div></div>`).join("")+`</div>`}
 return h}
function vSettings(){let h=`<div class="sec">My habits</div><div class="card">`;
 S.habits.forEach(x=>{h+=editing===x.id?`<div style="padding:10px 0;border-bottom:1px solid var(--bd)"><label class="f">Title</label><input id="e_t" value="${esc(x.text)}"><label class="f">How</label><textarea id="e_h">${esc(x.how||"")}</textarea><label class="f">Why</label><textarea id="e_w">${esc(x.why||"")}</textarea><label class="f">2-minute version</label><input id="e_m" value="${esc(x.mini)}"><div class="row" style="margin-top:10px"><button class="btn p" data-save="${x.id}">Save</button><button class="btn" data-cancel="1">Cancel</button></div></div>`
  :`<div class="hl"><span>${esc(x.text)}</span><button class="btn" data-edit="${x.id}">Edit</button><button class="btn d" data-rm="${x.id}">Remove</button></div>`});
 h+=`</div><div class="sec">Add a habit</div><div class="card"><label class="f">Title</label><input id="n_t" placeholder="e.g. 10 pushups after coffee"><label class="f">Book / theme</label><select id="n_b">${Object.keys(BOOKS).map(b=>`<option value="${b}" ${b==="ME"?"selected":""}>${esc(BOOKS[b])}</option>`).join("")}</select><label class="f">How (optional)</label><textarea id="n_h" placeholder="Exact steps and time needed"></textarea><label class="f">Why (optional)</label><textarea id="n_w" placeholder="The lesson behind it"></textarea><div class="row" style="margin-top:12px"><button class="btn p" id="add">Add habit</button></div></div>
 <div class="sec">Backup</div><div class="card"><div class="muted" style="margin-bottom:12px">Your data lives only on this device. Export a backup file now and then (save it to Files or iCloud Drive).</div><div class="row"><button class="btn p" id="exp">Export backup</button><button class="btn" id="imp">Import backup</button><input type="file" id="file" accept="application/json,.json" style="display:none"></div></div>
 <div class="sec">Plan</div><div class="card"><div class="row"><button class="btn" id="cycle">Start new 30-day cycle today</button><button class="btn" id="restore">Restore default list</button></div><div class="muted" style="margin-top:12px">Storage: ${S._persist?"persistent (protected from cleanup)":"saved on this device"}. Started ${esc(S.start)}.</div></div>`;return h}
function render(){today=dkey(new Date());const T={today:"Today",progress:"Progress",insights:"Insights",settings:"Settings"};header(T[tab]);const v=$("#view");v.innerHTML={today:vToday,progress:vProgress,insights:vInsights,settings:vSettings}[tab]();v.style.animation="none";v.offsetHeight;v.style.animation="";document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.t===tab))}
function softUpdateToday(){// update without full re-render so animations stay smooth
 const p=pctOf(today);const fg=document.querySelector(".ring .fg");if(fg){const c=2*Math.PI*40;fg.setAttribute("stroke-dashoffset",c*(1-p));document.querySelector(".ring .pct").textContent=Math.round(p*100)+"%"}}
document.addEventListener("click",e=>{const t=e.target.closest("[data-act],[data-t],[data-mood],[data-range],[data-edit],[data-rm],[data-save],[data-cancel],#saveci,#add,#exp,#imp,#cycle,#restore");if(!t)return;
 if(t.dataset.t){tab=t.dataset.t;haptic();render();scrollTo(0,0);return}
 if(t.dataset.act){const it=t.closest(".item"),id=it.dataset.id;if(t.dataset.act==="det"){open=open===id?"":id;render();return}
  const l=S.log[today]||[],on=l.includes(id),before=pctOf(today);S.log[today]=on?l.filter(x=>x!==id):[...l,id];save();haptic();it.classList.toggle("done",!on);const cb=it.querySelector(".cb");cb.classList.remove("pop");void cb.offsetWidth;cb.classList.add("pop");
  if(!on){const r=cb.getBoundingClientRect();confetti(r.left+r.width/2,r.top+r.height/2)}const after=pctOf(today);
  if(before<.5&&after>=.5)toast("Today counts! 🔥");if(after>=1&&before<1)toast("Perfect day ✨");setTimeout(render,450);softUpdateToday();return}
 if(t.dataset.mood){const c=S.checkins[today]||{mood:0,note:"",hardest:""};const draft={mood:+t.dataset.mood,note:$("#note").value,hardest:$("#hard").value};document.querySelectorAll(".moods button").forEach(b=>b.classList.toggle("on",b===t));$("#saveci").disabled=false;$("#saveci")._d=draft;haptic();return}
 if(t.id==="saveci"){const on=document.querySelector(".moods .on");if(!on)return;S.checkins[today]={mood:+on.dataset.mood,note:$("#note").value.trim(),hardest:$("#hard").value};save();haptic();toast("Check-in saved");render();return}
 if(t.dataset.range){range=+t.dataset.range;render();return}
 if(t.dataset.edit){editing=t.dataset.edit;render();return}if(t.dataset.cancel){editing="";render();return}
 if(t.dataset.save){const h=S.habits.find(x=>x.id===t.dataset.save);const tt=$("#e_t").value.trim();if(tt)h.text=tt;h.how=$("#e_h").value.trim();h.why=$("#e_w").value.trim();h.mini=$("#e_m").value.trim()||h.mini;editing="";save();toast("Saved");render();return}
 if(t.dataset.rm){const h=S.habits.find(x=>x.id===t.dataset.rm);if(confirm(`Remove "${h.text}"?`)){S.habits=S.habits.filter(x=>x.id!==h.id);save();render()}return}
 if(t.id==="add"){const tt=$("#n_t").value.trim();if(!tt)return toast("Add a title first");S.habits.push({id:"u"+Date.now(),book:$("#n_b").value,text:tt,how:$("#n_h").value.trim(),why:$("#n_w").value.trim(),mini:"Set a 2-minute timer and do only the first step",up:"Add a little more time or difficulty"});save();toast("Habit added");render();return}
 if(t.id==="exp"){const{_persist,...o}=S;const b=new Blob([JSON.stringify(o,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`daily-growth-backup-${today}.json`;document.body.appendChild(a);a.click();a.remove();toast("Backup exported");return}
 if(t.id==="imp"){$("#file").click();return}
 if(t.id==="cycle"){if(confirm("Start a new 30-day cycle today? History is kept.")){S.start=today;save();render()}return}
 if(t.id==="restore"){if(confirm("Replace your list with the default 10 items? History is kept.")){S.habits=JSON.parse(JSON.stringify(DEFAULTS));save();render()}return}
});
document.addEventListener("change",e=>{if(e.target.id==="file"){const f=e.target.files[0];if(!f)return;f.text().then(t=>{const o=JSON.parse(t);if(!valid(o))throw 0;if(confirm("Replace current data with this backup?")){S=o;save();toast("Backup restored");render()}}).catch(()=>toast("That file isn't a valid backup"))}});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&dkey(new Date())!==today)render()});
setInterval(()=>{if(dkey(new Date())!==today)render()},60000);
load().then(render);
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");
