/* ============================================================
   DIVA-5 web app — Adult and Young (5–17) instruments with a
   toggle, live DSM-5 scoring derived from ticked boxes, autosave,
   import/export, and per-criterion Claude-powered extraction.
   ============================================================ */

/* ---- Claude / xiaoai.plus config ---- */
const CLAUDE_API_KEY = 'sk-W3iFOmFHkaXd63EewBuKyAaDmgQDrItDzH5I2DqvrY7NK6UM';
const CLAUDE_API     = 'https://xiaoai.plus/v1/messages';   // CORS-enabled, called directly
const CLAUDE_MODEL   = 'claude-sonnet-4-6';

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ============================================================
   Instrument configuration
   ============================================================ */
const INSTR = {
  adult: {
    badgeTitle:'Diagnostic Interview for ADHD in adults',
    badgeSub:'Adult · DIVA-5 · DSM-5 criteria',
    part1:PART1, part2:PART2,
    f1:'adult', f2:'child', k1:'a', k2:'c',
    col1:'Examples — adulthood', col2:'Examples — childhood (age 5–12)',
    dot1:'Adult', dot2:'Child',
    p1title:'Part 1 · Symptoms of attention deficit (DSM-5 criterion A1)',
    p2title:'Part 2 · Symptoms of hyperactivity / impulsivity (DSM-5 criterion A2)',
    mode:'periods', th1:5, th2:6,
    note:'Symptoms in adulthood must have been present for at least 6 months; childhood symptoms relate to ages 5–12. A symptom counts toward ADHD only if it has a chronic, trait-like course (not episodic) and is present in <em>both</em> periods. The conclusion updates live as you tick boxes; under each question you can type a free-text description and let <strong>✦ AI</strong> tick the matching items anywhere in the form.',
    impair:[
      {scope:'adult', title:'Criterion C — Impairment in adulthood', doms:DOMAINS_ADULT,
       hint:'In which areas are there problems as a result of the symptoms? (Diagnosis needs impairment in ≥2 areas.)'},
      {scope:'child', title:'Criterion C — Impairment in childhood / adolescence', doms:DOMAINS_CHILD, hint:''}
    ]
  },
  young: {
    badgeTitle:'Diagnostic Interview for ADHD in young people',
    badgeSub:'Young · ages 5–17 · DSM-5 criteria',
    part1:YPART1, part2:YPART2,
    f1:'home', f2:'school', k1:'h', k2:'s',
    col1:'Examples — at home', col2:'Examples — at school / college',
    dot1:'Home', dot2:'School',
    p1title:'Part 1 · Symptoms of inattention (DSM-5 criterion A1)',
    p2title:'Part 2 · Symptoms of hyperactivity / impulsivity (DSM-5 criterion A2)',
    mode:'settings', th:6,
    note:'For children & adolescents aged 5–17. Assess <em>current</em> symptoms (present ≥6 months), ideally with a parent/carer present. DSM-5 needs ≥6 symptoms in a domain, present in <strong>two or more settings</strong> (home and school), onset before age 12, and clear impairment. Tick the home and/or school examples that apply; the conclusion updates live. Complete the official Young DIVA-5 from the DIVA Foundation for the validated example wording.',
    impair:[
      {scope:'young', title:'Criterion C — Impairment (current)', doms:YDOMAINS,
       hint:'In which areas of everyday life are there problems? (Diagnosis needs impairment in ≥2 areas.)'}
    ]
  }
};

let MODE = localStorage.getItem('diva5_mode') || 'adult';
const cfg = () => INSTR[MODE];
const stateKey = m => `diva5_state_${m||MODE}`;

/* ============================================================
   Rendering
   ============================================================ */
function optHTML(id, label){
  return `<label class="opt" data-opt="${id}"><input type="checkbox" data-id="${id}"><span>${esc(label)}</span></label>`;
}
function aiBoxHTML(code){
  return `<div class="card-ai">
    <textarea class="cai-text" data-cai="${code}"
      placeholder="Describe in your own words — ✦ AI ticks the matching items anywhere in the form…"></textarea>
    <div class="cai-row">
      <button type="button" class="btn btn-ai cai-go" data-cai="${code}">✦ Tick matching items</button>
      <span class="cai-status" data-cai="${code}"></span>
    </div></div>`;
}
function cardHTML(item){
  const c = cfg();
  const a = item[c.f1].map((l,i)=>optHTML(`${item.code}::${c.k1}::${i}`, l)).join('');
  const b = item[c.f2].map((l,i)=>optHTML(`${item.code}::${c.k2}::${i}`, l)).join('');
  return `<div class="card" id="card-${item.code}">
    <div class="card-head">
      <span class="code-chip">${item.code}</span>
      <span class="card-q">${esc(item.q)}</span>
      <span class="pchip" data-pchip="${item.code}">
        <span class="pdot" data-pdot="${item.code}::${c.k1}">${c.dot1}</span>
        <span class="pdot" data-pdot="${item.code}::${c.k2}">${c.dot2}</span>
      </span>
    </div>
    <div class="card-body">
      <div class="col"><div class="col-title">${c.col1}</div>${a}</div>
      <div class="col"><div class="col-title">${c.col2}</div>${b}</div>
    </div>
    ${aiBoxHTML(item.code)}</div>`;
}
function domainHTML(scope, dom){
  const items = dom.items.map((l,i)=>optHTML(`dom::${scope}::${dom.key}::${i}`, l)).join('');
  return `<div class="card"><div class="card-head"><span class="card-q"><strong>${esc(dom.title)}</strong></span></div>
    <div class="col" style="padding:12px 16px">${items}</div></div>`;
}

function buildUI(){
  const c = cfg();
  $('#brand-title').textContent = c.badgeTitle;
  $('#brand-sub').textContent   = c.badgeSub;
  $('#intro-note').innerHTML    = c.note;
  $$('#mode-toggle button').forEach(b=>b.classList.toggle('on', b.dataset.mode===MODE));

  $('#part1').innerHTML = `<div class="section-title">${c.p1title}</div>` + c.part1.map(cardHTML).join('');
  $('#part2').innerHTML = `<div class="section-title">${c.p2title}</div>` + c.part2.map(cardHTML).join('');

  const onsetBox = `
    <div class="crit-box"><h3>Criterion B — Age of onset</h3>
      <div class="inline">
        <span>Several symptoms present before the age of 12?</span>
        <span class="seg" data-present="onset::present::x">
          <button type="button" class="yes" data-val="yes">Yes</button>
          <button type="button" class="no" data-val="no">No</button>
        </span>
        <span>If no, starting from age</span>
        <input type="number" id="onset-age" min="0" max="80" placeholder="—">
      </div></div>`;
  const impairBoxes = c.impair.map(im=>`
    <div class="crit-box"><h3>${im.title} <span class="imp-count" id="imp-${im.scope}-count"></span></h3>
      ${im.hint?`<p class="note">${im.hint}</p>`:''}
      ${im.doms.map(d=>domainHTML(im.scope,d)).join('')}
    </div>`).join('');
  $('#part3').innerHTML = `<div class="section-title">Part 3 · Impairment (DSM-5 criteria B, C, D)</div>${onsetBox}${impairBoxes}`;

  wireSegments();
  wireCaiButtons();
}

/* ============================================================
   Segmented toggle (onset)
   ============================================================ */
function wireSegments(){
  $$('[data-present]').forEach(seg=>{
    seg.querySelectorAll('button').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const on = btn.classList.contains('on');
        seg.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
        if(!on) btn.classList.add('on');
        score(); save();
      });
    });
  });
}
function getPresent(key){ const seg=$(`[data-present="${key}"]`); const on=seg&&seg.querySelector('button.on'); return on?on.dataset.val:null; }
function setPresent(key,val){ const seg=$(`[data-present="${key}"]`); if(seg) seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.val===val)); }

/* ============================================================
   Scoring (derived from ticked boxes; mode-aware)
   ============================================================ */
function colPresent(code, key){ return $$(`input[data-id^="${code}::${key}::"]:checked`).length > 0; }
function domainsImpaired(scope, doms){
  return doms.filter(d => $$(`input[data-id^="dom::${scope}::${d.key}::"]:checked`).length > 0).length;
}
function pill(lbl,val,th){ const met=val>=th; return `<div class="pill ${met?'met':''}"><span class="val">${val}/9</span><span class="lbl">${lbl} (≥${th})</span></div>`; }
function plainPill(lbl,val,sub,met){ return `<div class="pill ${met?'met':''}"><span class="val">${val}</span><span class="lbl">${lbl}${sub?` (${sub})`:''}</span></div>`; }

function setDots(list){
  const c=cfg();
  list.forEach(it=>{
    const d1=$(`[data-pdot="${it.code}::${c.k1}"]`), d2=$(`[data-pdot="${it.code}::${c.k2}"]`);
    if(d1) d1.classList.toggle('on', colPresent(it.code,c.k1));
    if(d2) d2.classList.toggle('on', colPresent(it.code,c.k2));
  });
}

function score(){
  const c = cfg();
  setDots(c.part1); setDots(c.part2);
  const onset = getPresent('onset::present::x')==='yes';

  // impairment counts
  let impairOk = true; const impCounts={};
  c.impair.forEach(im=>{
    const n = domainsImpaired(im.scope, im.doms);
    impCounts[im.scope]=n;
    const el=$(`#imp-${im.scope}-count`);
    const ok=n>=2;
    if(el){ el.textContent=`— ${n}/${im.doms.length} area${n!==1?'s':''} ${ok?'✓':''}`; el.className='imp-count'+(ok?' met':''); }
    if(!ok) impairOk=false;
  });

  let scoresHTML='', verdict='Incomplete', presentation='—', cls='';

  if(c.mode==='periods'){
    const cnt = list => list.reduce((o,it)=>{ if(colPresent(it.code,c.k1))o.a++; if(colPresent(it.code,c.k2))o.b++; return o; }, {a:0,b:0});
    const ia=cnt(c.part1), hi=cnt(c.part2);
    const iaMet = ia.a>=c.th1 && ia.b>=c.th2;
    const hiMet = hi.a>=c.th1 && hi.b>=c.th2;
    if(iaMet||hiMet){
      presentation=(iaMet&&hiMet)?'Combined':iaMet?'Inattentive':'Hyperactive/Impulsive';
      const full=onset&&impairOk; verdict=full?'ADHD criteria met':'Symptom count met'; cls=full?'met':'partial';
    }
    scoresHTML = pill('IA '+c.dot1.toLowerCase(),ia.a,c.th1)+pill('IA '+c.dot2.toLowerCase(),ia.b,c.th2)
               + pill('HI '+c.dot1.toLowerCase(),hi.a,c.th1)+pill('HI '+c.dot2.toLowerCase(),hi.b,c.th2);
  } else {
    // settings mode (Young): symptom present if in either setting; pervasive = both settings
    const present = it => colPresent(it.code,c.k1) || colPresent(it.code,c.k2);
    const pervasive = it => colPresent(it.code,c.k1) && colPresent(it.code,c.k2);
    const ia = c.part1.filter(present).length;
    const hi = c.part2.filter(present).length;
    const perv = [...c.part1,...c.part2].filter(pervasive).length;
    const iaMet = ia>=c.th, hiMet = hi>=c.th;
    const settingsOk = perv>=2;          // several symptoms in ≥2 settings
    if(iaMet||hiMet){
      presentation=(iaMet&&hiMet)?'Combined':iaMet?'Inattentive':'Hyperactive/Impulsive';
      const full=onset&&impairOk&&settingsOk; verdict=full?'ADHD criteria met':'Symptom count met'; cls=full?'met':'partial';
    }
    scoresHTML = pill('Inattention',ia,c.th)+pill('Hyperactivity',hi,c.th)
               + plainPill('≥2 settings',perv,'pervasive',settingsOk);
  }

  $('#scores').innerHTML = scoresHTML + `
    <div class="verdict ${cls}">
      <div class="vd-main">${verdict}</div>
      <div class="vd-sub">${presentation==='—'?'presentation —':'Presentation: '+presentation}</div>
    </div>`;
}

/* ============================================================
   Persistence (per-mode)
   ============================================================ */
function collect(){
  const checks = $$('input[type=checkbox][data-id]:checked').map(c=>c.dataset.id);
  const present={};
  $$('[data-present]').forEach(seg=>{ const v=getPresent(seg.dataset.present); if(v) present[seg.dataset.present]=v; });
  return { patient:{name:$('#p-name').value,dob:$('#p-dob').value,sex:$('#p-sex').value,date:$('#p-date').value,onsetAge:$('#onset-age').value}, checks, present, mode:MODE };
}
function apply(state){
  if(!state) return;
  const p=state.patient||{};
  $('#p-name').value=p.name||''; $('#p-dob').value=p.dob||''; $('#p-sex').value=p.sex||'';
  $('#p-date').value=p.date||''; $('#onset-age').value=p.onsetAge||'';
  (state.checks||[]).forEach(id=>{ const el=$(`input[data-id="${CSS.escape(id)}"]`); if(el) el.checked=true; });
  Object.entries(state.present||{}).forEach(([k,v])=>setPresent(k,v));
  score();
}
function save(){ localStorage.setItem(stateKey(), JSON.stringify(collect())); }
function load(m){ try{ return JSON.parse(localStorage.getItem(stateKey(m))); }catch(e){ return null; } }

/* ============================================================
   Mode switching
   ============================================================ */
function switchMode(m){
  if(m===MODE) return;
  save();                         // persist current mode's answers
  MODE=m; localStorage.setItem('diva5_mode', m);
  buildUI();
  apply(load());                  // load target mode's answers
  score();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ============================================================
   AI extraction (per-card, applies across whole form)
   ============================================================ */
function buildCatalog(){
  const c=cfg(), cat=[];
  [...c.part1,...c.part2].forEach(it=>{
    it[c.f1].forEach((l,i)=>cat.push({id:`${it.code}::${c.k1}::${i}`, t:l, c:it.code, p:c.dot1.toLowerCase()}));
    it[c.f2].forEach((l,i)=>cat.push({id:`${it.code}::${c.k2}::${i}`, t:l, c:it.code, p:c.dot2.toLowerCase()}));
  });
  c.impair.forEach(im=>im.doms.forEach(d=>d.items.forEach((l,i)=>cat.push({id:`dom::${im.scope}::${d.key}::${i}`, t:l, c:'impairment', p:im.scope}))));
  return cat;
}
async function aiAnalyse(code, btn, statusEl){
  const ta=$(`textarea.cai-text[data-cai="${code}"]`);
  const text=ta?ta.value.trim():'';
  if(!text){ statusEl.textContent='Type a description first.'; return; }
  btn.disabled=true; statusEl.textContent='Analysing…';
  const c=cfg(), catalog=buildCatalog();
  const periods = c.mode==='periods'
    ? `Match adulthood statements to period "${c.dot1.toLowerCase()}" and childhood statements to period "${c.dot2.toLowerCase()}".`
    : `This is a child/adolescent (current) assessment. Match things happening at home to period "${c.dot1.toLowerCase()}" and at school/college to period "${c.dot2.toLowerCase()}"; if a behaviour clearly happens in both, select the matching item in both settings.`;
  const sys = `You help complete the ${MODE==='young'?'Young ':''}DIVA-5 (Diagnostic Interview for ADHD${MODE==='young'?' in young people aged 5–17':' in adults'}).
You receive (1) a free-text description and (2) a catalog of example items, each with "id", text "t", criterion "c" and period "p".
Select EVERY item across the WHOLE catalog whose behaviour is clearly supported by the text — not only one criterion. Do not infer beyond what is stated. ${periods}
Return STRICT JSON only (no markdown): {"items":["<id>",...],"onset":true|false|null,"notes":"one short sentence"}
onset = whether several symptoms were present before age 12 (null if unstated).`;
  const user=`FREE TEXT:\n"""${text}"""\n\nCATALOG (JSON):\n${JSON.stringify(catalog)}`;
  try{
    const r=await fetch(CLAUDE_API,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':CLAUDE_API_KEY,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:CLAUDE_MODEL,max_tokens:2000,system:sys,messages:[{role:'user',content:user}]})});
    const data=await r.json();
    if(data.error){ statusEl.textContent='API error: '+(data.error.message||'unknown'); btn.disabled=false; return; }
    const parsed=parseJSON((data.content||[]).map(b=>b.text||'').join(''));
    if(!parsed){ statusEl.textContent='Could not parse AI response.'; btn.disabled=false; return; }
    const added=applyAI(parsed);
    statusEl.textContent = added>0 ? `✦ Ticked ${added} item${added!==1?'s':''} across the form.` : 'No new items matched.';
    if(parsed.notes) statusEl.title=parsed.notes;
  }catch(e){ statusEl.textContent='Request failed: '+e.message; }
  btn.disabled=false;
}
function parseJSON(s){ try{return JSON.parse(s);}catch(e){} const m=s.match(/\{[\s\S]*\}/); if(m){try{return JSON.parse(m[0]);}catch(e){}} return null; }
function applyAI(res){
  let added=0;
  (res.items||[]).forEach(id=>{ const el=$(`input[data-id="${CSS.escape(id)}"]`); if(el&&!el.checked){ el.checked=true; added++; const lab=el.closest('.opt'); if(lab) lab.classList.add('ai-added'); } });
  if(res.onset===true && getPresent('onset::present::x')!=='yes') setPresent('onset::present::x','yes');
  score(); save(); return added;
}
function wireCaiButtons(){
  $$('.cai-go').forEach(btn=>{ btn.addEventListener('click',()=>{ const code=btn.dataset.cai; aiAnalyse(code, btn, $(`.cai-status[data-cai="${code}"]`)); }); });
}

/* ============================================================
   Toolbar
   ============================================================ */
function download(name,content,type='application/json'){ const b=new Blob([content],{type}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=name; a.click(); URL.revokeObjectURL(u); }
function wireToolbar(){
  $('#btn-print').onclick=()=>window.print();
  $('#btn-save').onclick=()=>{ const name=($('#p-name').value||'diva5').replace(/\s+/g,'_'); download(`${name}_${MODE==='young'?'YoungDIVA5':'DIVA5'}.json`, JSON.stringify(collect(),null,2)); };
  $('#btn-load').onclick=()=>$('#file-load').click();
  $('#file-load').onchange=e=>{ const f=e.target.files[0]; if(!f) return; const rd=new FileReader();
    rd.onload=()=>{ const s=parseJSON(rd.result); if(s){ if(s.mode&&s.mode!==MODE){ MODE=s.mode; localStorage.setItem('diva5_mode',MODE); buildUI(); } resetUI(); apply(s); save(); } };
    rd.readAsText(f); };
  $('#btn-reset').onclick=()=>{ if(confirm('Clear all answers for the current ('+MODE+') interview?')){ localStorage.removeItem(stateKey()); resetUI(); score(); } };
}
function resetUI(){
  $$('input[type=checkbox][data-id]').forEach(c=>c.checked=false);
  $$('.opt.ai-added').forEach(o=>o.classList.remove('ai-added'));
  $$('[data-present] button').forEach(b=>b.classList.remove('on'));
  $$('textarea.cai-text').forEach(t=>t.value='');
  $$('.cai-status').forEach(s=>s.textContent='');
  ['p-name','p-dob','p-sex','p-date','onset-age'].forEach(id=>{ const el=$('#'+id); if(el) el.value=''; });
}

/* ============================================================
   Init
   ============================================================ */
buildUI();
wireToolbar();
$$('#mode-toggle button').forEach(b=>b.addEventListener('click',()=>switchMode(b.dataset.mode)));
document.addEventListener('change',e=>{ if(e.target.matches('input[type=checkbox][data-id]')){ score(); save(); } });
document.addEventListener('input',e=>{ if(e.target.matches('#p-name,#p-dob,#p-sex,#p-date,#onset-age')) save(); });
apply(load());
score();
