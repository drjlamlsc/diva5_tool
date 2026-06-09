/* ============================================================
   DIVA-5 web app — rendering, DSM-5 scoring, autosave,
   import/export, and Claude-powered symptom extraction.

   Scoring is derived LIVE from the ticked example boxes:
   a criterion counts as "present" for a period when at least
   one of its example boxes in that column is ticked.
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
  const a = item.adult.map((l,i)=>optHTML(`${item.code}::a::${i}`, l)).join('');
  const c = item.child.map((l,i)=>optHTML(`${item.code}::c::${i}`, l)).join('');
  return `<div class="card" id="card-${item.code}">
    <div class="card-head">
      <span class="code-chip">${item.code}</span>
      <span class="card-q">${esc(item.q)}</span>
      <span class="pchip" data-pchip="${item.code}">
        <span class="pdot" data-pdot="${item.code}::a">Adult</span>
        <span class="pdot" data-pdot="${item.code}::c">Child</span>
      </span>
    </div>
    <div class="card-body">
      <div class="col"><div class="col-title">Examples — adulthood</div>${a}</div>
      <div class="col"><div class="col-title">Examples — childhood (age 5–12)</div>${c}</div>
    </div>
    ${aiBoxHTML(item.code)}</div>`;
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
    <div class="crit-box"><h3>Criterion C — Impairment in adulthood
        <span class="imp-count" id="impA-count"></span></h3>
      <p class="note">In which areas are there problems as a result of the symptoms? (Diagnosis needs impairment in ≥2 areas — derived live from the ticks below.)</p>
      ${DOMAINS_ADULT.map(d=>domainHTML('adult',d)).join('')}
    </div>
    <div class="crit-box"><h3>Criterion C — Impairment in childhood / adolescence
        <span class="imp-count" id="impC-count"></span></h3>
      ${DOMAINS_CHILD.map(d=>domainHTML('child',d)).join('')}
    </div>`;
}

/* ---------- onset segmented toggle ---------- */
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

/* ---------- scoring (derived from ticked boxes) ---------- */
function periodPresent(code, period){            // ≥1 example box ticked in that column
  return $$(`input[data-id^="${code}::${period}::"]:checked`).length > 0;
}
function domainsImpaired(scope){                  // # of life areas with ≥1 ticked box
  const doms = scope==='adult' ? DOMAINS_ADULT : DOMAINS_CHILD;
  return doms.filter(d => $$(`input[data-id^="dom::${scope}::${d.key}::"]:checked`).length > 0).length;
}
function countMet(list){
  let adult=0, child=0;
  list.forEach(it=>{
    const a = periodPresent(it.code,'a'), c = periodPresent(it.code,'c');
    if(a) adult++; if(c) child++;
    const da=$(`[data-pdot="${it.code}::a"]`), dc=$(`[data-pdot="${it.code}::c"]`);
    if(da) da.classList.toggle('on', a);
    if(dc) dc.classList.toggle('on', c);
  });
  return {adult, child};
}
function score(){
  const ia = countMet(PART1);
  const hi = countMet(PART2);
  const iaMet = ia.adult>=THRESH_ADULT && ia.child>=THRESH_CHILD;
  const hiMet = hi.adult>=THRESH_ADULT && hi.child>=THRESH_CHILD;

  const onset = getPresent('onset::present::x')==='yes';
  const nA = domainsImpaired('adult'), nC = domainsImpaired('child');
  const impA = nA>=2, impC = nC>=2;

  const ac=$('#impA-count'), cc=$('#impC-count');
  if(ac){ ac.textContent = `— ${nA}/5 area${nA!==1?'s':''} ${impA?'✓':''}`; ac.className='imp-count'+(impA?' met':''); }
  if(cc){ cc.textContent = `— ${nC}/5 area${nC!==1?'s':''} ${impC?'✓':''}`; cc.className='imp-count'+(impC?' met':''); }

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

/* ---------- AI extraction (per-card, applies across whole form) ---------- */
function buildCatalog(){
  const cat=[];
  [...PART1,...PART2].forEach(it=>{
    it.adult.forEach((l,i)=>cat.push({id:`${it.code}::a::${i}`, t:l, c:it.code, p:'adult'}));
    it.child.forEach((l,i)=>cat.push({id:`${it.code}::c::${i}`, t:l, c:it.code, p:'child'}));
  });
  DOMAINS_ADULT.forEach(d=>d.items.forEach((l,i)=>cat.push({id:`dom::adult::${d.key}::${i}`, t:l, c:'impairment', p:'adult'})));
  DOMAINS_CHILD.forEach(d=>d.items.forEach((l,i)=>cat.push({id:`dom::child::${d.key}::${i}`, t:l, c:'impairment', p:'child'})));
  return cat;
}

async function aiAnalyse(code, btn, statusEl){
  const ta = $(`textarea.cai-text[data-cai="${code}"]`);
  const text = ta ? ta.value.trim() : '';
  if(!text){ statusEl.textContent='Type a description first.'; return; }
  btn.disabled=true; statusEl.textContent='Analysing…';

  const catalog = buildCatalog();
  const sys = `You help complete the DIVA-5 (Diagnostic Interview for ADHD in adults).
You receive (1) a free-text description and (2) a catalog of DIVA-5 example items, each with "id", text "t", criterion "c" and period "p" (adult or child).
Select EVERY item across the WHOLE catalog whose behaviour is clearly supported by the text — not only one criterion. Do not infer beyond what is stated. Match adulthood statements to period "adult" and childhood statements to period "child"; if the text doesn't specify a period, choose the period that best fits the described age.
Return STRICT JSON only (no markdown, no prose):
{"items":["<id>",...],
 "onset":true|false|null,
 "notes":"one short sentence on what you based the selection on"}
onset = whether the text indicates several symptoms were present before age 12 (null if unstated).`;
  const user = `FREE TEXT:\n"""${text}"""\n\nCATALOG (JSON):\n${JSON.stringify(catalog)}`;

  try{
    const r = await fetch(CLAUDE_API,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':CLAUDE_API_KEY,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:CLAUDE_MODEL, max_tokens:2000, system:sys, messages:[{role:'user',content:user}]})
    });
    const data = await r.json();
    if(data.error){ statusEl.textContent='API error: '+(data.error.message||'unknown'); btn.disabled=false; return; }
    const raw = (data.content||[]).map(b=>b.text||'').join('');
    const parsed = parseJSON(raw);
    if(!parsed){ statusEl.textContent='Could not parse AI response.'; btn.disabled=false; return; }
    const added = applyAI(parsed);
    statusEl.textContent = added>0
      ? `✦ Ticked ${added} item${added!==1?'s':''} across the form.`
      : 'No new items matched.';
    if(parsed.notes) statusEl.title = parsed.notes;
  }catch(e){
    statusEl.textContent='Request failed: '+e.message;
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
  let added=0;
  (res.items||[]).forEach(id=>{
    const el=$(`input[data-id="${CSS.escape(id)}"]`);
    if(el && !el.checked){
      el.checked=true; added++;
      const lab=el.closest('.opt'); if(lab) lab.classList.add('ai-added');
    }
  });
  if(res.onset===true && getPresent('onset::present::x')!=='yes') setPresent('onset::present::x','yes');
  score(); save();
  return added;
}

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
  $$('textarea.cai-text').forEach(t=>t.value='');
  $$('.cai-status').forEach(s=>s.textContent='');
  ['p-name','p-dob','p-sex','p-date','onset-age'].forEach(id=>$('#'+id).value='');
}

/* ---------- init ---------- */
render();
wireSegments();
wireToolbar();
$$('.cai-go').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const code=btn.dataset.cai;
    aiAnalyse(code, btn, $(`.cai-status[data-cai="${code}"]`));
  });
});
document.addEventListener('change',e=>{ if(e.target.matches('input[type=checkbox][data-id]')){ score(); save(); } });
['p-name','p-dob','p-sex','p-date','onset-age'].forEach(id=>$('#'+id).addEventListener('input',save));
apply(load());
score();
