/* ============================================================
   DIVA-5 web app — rendering, DSM-5 scoring, autosave,
   import/export, and Claude-powered symptom extraction.
   ============================================================ */

/* ---- Claude / xiaoai.plus config ---- */
const CLAUDE_API_KEY = 'sk-W3iFOmFHkaXd63EewBuKyAaDmgQDrItDzH5I2DqvrY7NK6UM';
const CLAUDE_API     = 'https://xiaoai.plus/v1/messages';   // CORS-enabled, called directly
const CLAUDE_MODEL   = 'claude-sonnet-4-6';

/* DSM-5 symptom-count thresholds (adults ≥17 → 5; childhood → 6) */
const THRESH_ADULT = 5;
const THRESH_CHILD = 6;

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- render symptom cards ---------- */
function optHTML(id, label){
  return `<label class="opt" data-opt="${id}">
    <input type="checkbox" data-id="${id}"><span>${esc(label)}</span></label>`;
}
function presentHTML(code, period){
  return `<div class="present" data-present="${code}::present::${period}">
    <span class="lab">Symptoms present in ${period==='a'?'adulthood':'childhood'}?</span>
    <span class="seg">
      <button type="button" class="yes" data-val="yes">Yes</button>
      <button type="button" class="no"  data-val="no">No</button>
    </span></div>`;
}
function cardHTML(item){
  const a = item.adult.map((l,i)=>optHTML(`${item.code}::a::${i}`, l)).join('');
  const c = item.child.map((l,i)=>optHTML(`${item.code}::c::${i}`, l)).join('');
  return `<div class="card" id="card-${item.code}">
    <div class="card-head">
      <span class="code-chip">${item.code}</span>
      <span class="card-q">${esc(item.q)}</span>
    </div>
    <div class="card-body">
      <div class="col">
        <div class="col-title">Examples — adulthood</div>${a}
        ${presentHTML(item.code,'a')}
      </div>
      <div class="col">
        <div class="col-title">Examples — childhood (age 5–12)</div>${c}
        ${presentHTML(item.code,'c')}
      </div>
    </div></div>`;
}

function domainHTML(scope, dom){
  const items = dom.items.map((l,i)=>optHTML(`dom::${scope}::${dom.key}::${i}`, l)).join('');
  return `<div class="card"><div class="card-head"><span class="card-q"><strong>${esc(dom.title)}</strong></span></div>
    <div class="col" style="padding:12px 16px">${items}</div></div>`;
}

function render(){
  $('#part1').innerHTML =
    `<div class="section-title">Part 1 · Symptoms of attention deficit (DSM-5 criterion A1)</div>` +
    PART1.map(cardHTML).join('');
  $('#part2').innerHTML =
    `<div class="section-title">Part 2 · Symptoms of hyperactivity / impulsivity (DSM-5 criterion A2)</div>` +
    PART2.map(cardHTML).join('');

  $('#part3').innerHTML = `
    <div class="section-title">Part 3 · Impairment (DSM-5 criteria B, C, D)</div>
    <div class="crit-box">
      <h3>Criterion B — Age of onset</h3>
      <div class="inline">
        <span>Several symptoms present before the age of 12?</span>
        <span class="seg" data-present="onset::present::x">
          <button type="button" class="yes" data-val="yes">Yes</button>
          <button type="button" class="no" data-val="no">No</button>
        </span>
        <span>If no, starting from age</span>
        <input type="number" id="onset-age" min="0" max="80" placeholder="—">
      </div>
    </div>
    <div class="crit-box"><h3>Criterion C — Impairment in adulthood</h3>
      <p class="note">In which areas are there problems as a result of the symptoms? (Diagnosis needs impairment in ≥2 areas.)</p>
      ${DOMAINS_ADULT.map(d=>domainHTML('adult',d)).join('')}
      <div class="present" data-present="impair::present::a"><span class="lab">Evidence of impairment in two or more areas (adulthood)?</span>
        <span class="seg"><button type="button" class="yes" data-val="yes">Yes</button><button type="button" class="no" data-val="no">No</button></span></div>
    </div>
    <div class="crit-box"><h3>Criterion C — Impairment in childhood / adolescence</h3>
      ${DOMAINS_CHILD.map(d=>domainHTML('child',d)).join('')}
      <div class="present" data-present="impair::present::c"><span class="lab">Evidence of impairment in two or more areas (childhood)?</span>
        <span class="seg"><button type="button" class="yes" data-val="yes">Yes</button><button type="button" class="no" data-val="no">No</button></span></div>
    </div>`;
}

/* ---------- present-toggle (segmented) behaviour ---------- */
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
function getPresent(key){
  const seg = $(`[data-present="${key}"]`);
  const on = seg && seg.querySelector('button.on');
  return on ? on.dataset.val : null;
}
function setPresent(key,val){
  const seg = $(`[data-present="${key}"]`);
  if(!seg) return;
  seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.val===val));
}

/* ---------- scoring ---------- */
function countMet(list){          // counts criteria present in BOTH periods
  let bothA=0, bothC=0, adult=0, child=0;
  list.forEach(it=>{
    const a = getPresent(`${it.code}::present::a`)==='yes';
    const c = getPresent(`${it.code}::present::c`)==='yes';
    if(a) adult++; if(c) child++;
    if(a) bothA++; if(c) bothC++;
  });
  return {adult, child};
}
function score(){
  const ia = countMet(PART1);
  const hi = countMet(PART2);
  const iaMet = ia.adult>=THRESH_ADULT && ia.child>=THRESH_CHILD;
  const hiMet = hi.adult>=THRESH_ADULT && hi.child>=THRESH_CHILD;
  const onset  = getPresent('onset::present::x')==='yes';
  const impA   = getPresent('impair::present::a')==='yes';
  const impC   = getPresent('impair::present::c')==='yes';

  let presentation='—', verdict='Incomplete', cls='';
  if(iaMet||hiMet){
    presentation = (iaMet&&hiMet) ? 'Combined' : iaMet ? 'Inattentive' : 'Hyperactive/Impulsive';
    const full = onset && impA && impC;
    verdict = full ? 'ADHD criteria met' : 'Symptom count met';
    cls = full ? 'met' : 'partial';
  }

  $('#scores').innerHTML = `
    ${pill('IA adult', ia.adult, THRESH_ADULT)}
    ${pill('IA child', ia.child, THRESH_CHILD)}
    ${pill('HI adult', hi.adult, THRESH_ADULT)}
    ${pill('HI child', hi.child, THRESH_CHILD)}
    <div class="verdict ${cls}">
      <div class="vd-main">${verdict}</div>
      <div class="vd-sub">${presentation==='—'?'presentation —':'Presentation: '+presentation}</div>
    </div>`;
}
function pill(lbl,val,th){
  const met = val>=th;
  return `<div class="pill ${met?'met':''}"><span class="val">${val}/9</span><span class="lbl">${lbl} (≥${th})</span></div>`;
}

/* ---------- persistence ---------- */
const LS_KEY='diva5_state_v1';
function collect(){
  const checks = $$('input[type=checkbox][data-id]:checked').map(c=>c.dataset.id);
  const present={};
  $$('[data-present]').forEach(seg=>{ const v=getPresent(seg.dataset.present); if(v) present[seg.dataset.present]=v; });
  return {
    patient:{name:$('#p-name').value,dob:$('#p-dob').value,sex:$('#p-sex').value,date:$('#p-date').value,onsetAge:$('#onset-age').value},
    checks, present
  };
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
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(collect())); }
function load(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)); }catch(e){ return null; } }

/* ---------- AI extraction ---------- */
function buildCatalog(){
  const cat=[];
  const push=(arr,scope)=>arr.forEach(it=>{
    it.adult.forEach((l,i)=>cat.push({id:`${it.code}::a::${i}`, t:l, c:it.code, p:'adult'}));
    it.child.forEach((l,i)=>cat.push({id:`${it.code}::c::${i}`, t:l, c:it.code, p:'child'}));
  });
  push(PART1); push(PART2);
  DOMAINS_ADULT.forEach(d=>d.items.forEach((l,i)=>cat.push({id:`dom::adult::${d.key}::${i}`, t:l, c:'impairment', p:'adult'})));
  DOMAINS_CHILD.forEach(d=>d.items.forEach((l,i)=>cat.push({id:`dom::child::${d.key}::${i}`, t:l, c:'impairment', p:'child'})));
  return cat;
}

async function aiAnalyse(){
  const text = $('#ai-text').value.trim();
  if(!text){ setStatus('Enter some text first.'); return; }
  const btn=$('#ai-go'); btn.disabled=true; setStatus('Analysing with Claude…');

  const catalog = buildCatalog();
  const sys = `You are a clinical assistant helping complete the DIVA-5 (Diagnostic Interview for ADHD in adults).
You are given (1) the patient's free-text history and (2) a catalog of DIVA-5 example items, each with an "id", text "t", criterion "c" and period "p" (adult or child).
Select ONLY the items whose described behaviour is clearly supported by the free text. Do not infer beyond what is stated. Match adulthood statements to period "adult" and childhood statements to period "child".
Also decide, for each ADHD criterion code (A1-A9, H1-H9), whether the text gives enough evidence to mark "symptoms present" for adulthood and/or childhood, and whether there is impairment in ≥2 life areas in adulthood/childhood.
Return STRICT JSON only (no markdown, no prose), shape:
{"items":["<id>",...],
 "present":[{"code":"A1","period":"a"},{"code":"H3","period":"c"}],
 "impair":{"a":true,"c":false},
 "onset":true|false|null,
 "notes":"one short sentence on what you based selections on"}
Use period "a" for adulthood and "c" for childhood in the "present" array. onset = were several symptoms present before age 12 per the text (null if unstated).`;

  const user = `FREE TEXT:\n"""${text}"""\n\nCATALOG (JSON):\n${JSON.stringify(catalog)}`;

  try{
    const r = await fetch(CLAUDE_API,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':CLAUDE_API_KEY,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:CLAUDE_MODEL, max_tokens:2000, system:sys, messages:[{role:'user',content:user}]})
    });
    const data = await r.json();
    if(data.error){ setStatus('API error: '+(data.error.message||'unknown')); btn.disabled=false; return; }
    const raw = (data.content||[]).map(b=>b.text||'').join('');
    const parsed = parseJSON(raw);
    if(!parsed){ setStatus('Could not parse AI response.'); btn.disabled=false; return; }
    applyAI(parsed);
  }catch(e){
    setStatus('Request failed: '+e.message);
  }
  btn.disabled=false;
}

function parseJSON(s){
  try{ return JSON.parse(s); }catch(e){}
  const m = s.match(/\{[\s\S]*\}/);
  if(m){ try{ return JSON.parse(m[0]); }catch(e){} }
  return null;
}

function applyAI(res){
  let added=0; const addedLabels=[];
  (res.items||[]).forEach(id=>{
    const el=$(`input[data-id="${CSS.escape(id)}"]`);
    if(el && !el.checked){
      el.checked=true; added++;
      const lab=el.closest('.opt'); if(lab){ lab.classList.add('ai-added'); addedLabels.push(lab.textContent.trim()); }
    }
  });
  let presSet=0;
  (res.present||[]).forEach(p=>{
    const period = p.period==='c'||p.period==='child' ? 'c' : 'a';
    const key=`${p.code}::present::${period}`;
    if($(`[data-present="${key}"]`) && getPresent(key)!=='yes'){ setPresent(key,'yes'); presSet++; }
  });
  if(res.impair){
    if(res.impair.a===true && getPresent('impair::present::a')!=='yes') setPresent('impair::present::a','yes');
    if(res.impair.c===true && getPresent('impair::present::c')!=='yes') setPresent('impair::present::c','yes');
  }
  if(res.onset===true && getPresent('onset::present::x')!=='yes') setPresent('onset::present::x','yes');

  score(); save();
  const box=$('#ai-result'); box.classList.add('show');
  box.innerHTML = `<div class="summary"><strong>✦ Added ${added} item${added!==1?'s':''}${presSet?` and set ${presSet} “present” flag${presSet!==1?'s':''}`:''}.</strong>
    ${res.notes?`<br><em>${esc(res.notes)}</em>`:''}
    ${addedLabels.length?`<ul>${addedLabels.slice(0,40).map(l=>`<li>${esc(l)}</li>`).join('')}</ul>`:'<br>No new items matched the text.'}
    <br><small>Review every selection — AI assistance is not a diagnosis.</small></div>`;
  setStatus('Done.');
  if(addedLabels.length) $('#card-'+(res.present?.[0]?.code||'A1'))?.scrollIntoView({behavior:'smooth',block:'center'});
}
function setStatus(m){ $('#ai-status').textContent=m; }

/* ---------- toolbar ---------- */
function download(name, content, type='application/json'){
  const b=new Blob([content],{type}); const u=URL.createObjectURL(b);
  const a=document.createElement('a'); a.href=u; a.download=name; a.click(); URL.revokeObjectURL(u);
}
function wireToolbar(){
  $('#btn-print').onclick=()=>window.print();
  $('#btn-save').onclick=()=>{
    const name=($('#p-name').value||'diva5').replace(/\s+/g,'_');
    download(`${name}_DIVA5.json`, JSON.stringify(collect(),null,2));
  };
  $('#btn-load').onclick=()=>$('#file-load').click();
  $('#file-load').onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const rd=new FileReader();
    rd.onload=()=>{ const s=parseJSON(rd.result); if(s){ resetUI(); apply(s); save(); } };
    rd.readAsText(f);
  };
  $('#btn-reset').onclick=()=>{ if(confirm('Clear all answers?')){ localStorage.removeItem(LS_KEY); resetUI(); score(); } };
}
function resetUI(){
  $$('input[type=checkbox][data-id]').forEach(c=>c.checked=false);
  $$('.opt.ai-added').forEach(o=>o.classList.remove('ai-added'));
  $$('[data-present] button').forEach(b=>b.classList.remove('on'));
  ['p-name','p-dob','p-sex','p-date','onset-age'].forEach(id=>$('#'+id).value='');
}

/* ---------- init ---------- */
render();
wireSegments();
wireToolbar();
$('#ai-go').onclick=aiAnalyse;
document.addEventListener('change',e=>{ if(e.target.matches('input[type=checkbox][data-id]')) save(); });
['p-name','p-dob','p-sex','p-date','onset-age'].forEach(id=>$('#'+id).addEventListener('input',save));
apply(load());
score();
