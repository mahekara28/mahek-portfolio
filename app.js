import {createUniverse} from './sky.js';
const $=(selector,parent=document)=>parent.querySelector(selector);
const $$=(selector,parent=document)=>[...parent.querySelectorAll(selector)];
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let data=null,projectIndex=0,projects=[],activeScene='universe',transitionId=0,toastTimer,sky;
const isPaused=()=>reducedMotion.matches;
function updateMotion(){
  document.documentElement.classList.toggle('motion-paused',isPaused());
  sky?.render();
}
function toast(text){clearTimeout(toastTimer);$('#toast').textContent=text;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200);}
reducedMotion.addEventListener('change',updateMotion);updateMotion();sky=createUniverse(isPaused);

const sceneTitles={universe:'A universe in progress',work:'The work',about:'The human',notes:'The notes',contact:'A connection'};
function routeScene(name,immediate=false){
  if(!sceneTitles[name])name='universe';
  const id=++transitionId,previous=$(`#scene-${activeScene}`),next=$(`#scene-${name}`);
  routing=true;
  for(const dialog of $$('dialog[open]'))dialog.close();
  routing=false;
  if(name===activeScene&&next.classList.contains('is-active'))return;
  const duration=isPaused()||immediate?0:700;
  $$('.scene').forEach(scene=>{if(scene!==next&&scene!==previous){scene.hidden=true;scene.inert=true;scene.classList.remove('is-active','is-leaving');}});
  previous.inert=true;previous.classList.remove('is-active');previous.classList.add('is-leaving');
  next.hidden=false;next.inert=false;next.classList.remove('is-leaving');next.scrollTop=0;
  activeScene=name;document.body.dataset.scene=name;
  $('#location-label').textContent=sceneTitles[name];
  $$('[data-route]').forEach(link=>{if(link.dataset.route===name)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  sky.jumpTo(name);
  if(duration){document.body.classList.remove('in-transit');void document.body.offsetWidth;document.body.classList.add('in-transit');}
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(id===transitionId)next.classList.add('is-active');}));
  setTimeout(()=>{if(id!==transitionId)return;if(previous!==next){previous.hidden=true;previous.classList.remove('is-leaving');}document.body.classList.remove('in-transit');$('#scene-announcement').textContent=`${name==='universe'?'Home':name} is open.`;},duration);
}
function navigate(name){if(location.hash==='#'+name)routeScene(name);else location.hash=name;}
let pendingNote=null,routing=false;
function parseHash(){
  const raw=decodeURIComponent((location.hash||'').replace(/^#/,''));
  if(raw.startsWith('notes/'))return {scene:'notes',note:raw.slice('notes/'.length)||null};
  if(sceneTitles[raw])return {scene:raw,note:null};
  return {scene:'universe',note:null};
}
function applyHash(immediate=false){
  const {scene,note}=parseHash();
  if(location.hash)routeScene(scene,immediate);
  pendingNote=note;
  if(note&&data)openArticle(note);
}
function focusArticle(slug){
  if(location.hash==='#notes/'+slug)openArticle(slug);
  else location.hash='notes/'+slug;
}
function adoptLegacyQuery(){
  const params=new URLSearchParams(location.search);
  const note=params.get('note');
  const scene=params.get('scene');
  if(note){history.replaceState(null,'','/#notes/'+note);return;}
  if(scene&&sceneTitles[scene])history.replaceState(null,'','/#'+scene);
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');if(!link)return;
  const route=link.getAttribute('href').slice(1);if(!sceneTitles[route])return;
  event.preventDefault();navigate(route);
});
$('#reader').addEventListener('close',()=>{
  if(routing)return;
  if(location.hash.startsWith('#notes/'))history.replaceState(null,'',location.pathname+'#notes');
});
adoptLegacyQuery();
window.addEventListener('hashchange',()=>applyHash(false));
if(location.hash&&location.hash!=='#universe')applyHash(true);

let parallaxFrame=0,pointerPosition=null;
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
window.addEventListener('pointermove',event=>{
  if(isPaused()||event.pointerType==='touch'||!finePointer.matches)return;
  pointerPosition={x:event.clientX,y:event.clientY,target:event.target};
  if(parallaxFrame)return;
  parallaxFrame=requestAnimationFrame(()=>{
    const {x:px,y:py,target}=pointerPosition;
    const x=(px/innerWidth-.5)*8,y=(py/innerHeight-.5)*6;
    document.body.classList.add('pointer-present');
    $('.cursor-aura').style.transform=`translate3d(${px}px,${py}px,0)`;
    $$('.scene.is-active .depth-layer').forEach(layer=>{const depth=Number(layer.dataset.depth)||1;layer.style.setProperty('--layer-x',`${x*depth}px`);layer.style.setProperty('--layer-y',`${y*depth}px`);});
    const surface=target.closest('.essay-row');
    if(surface){const rect=surface.getBoundingClientRect();surface.style.setProperty('--spot-x',`${px-rect.left}px`);surface.style.setProperty('--spot-y',`${py-rect.top}px`);}
    parallaxFrame=0;
  });
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>document.body.classList.remove('pointer-present'));
window.addEventListener('blur',()=>document.body.classList.remove('pointer-present'));
$('#home-field').addEventListener('pointerdown',e=>{if(!e.target.closest('a,button'))sky.burst(e.clientX,e.clientY);});
$('#make-wish').addEventListener('click',()=>{sky.shoot();if(!isPaused())setTimeout(()=>sky.shoot(),330);toast('A little thought, sent across the universe.');});

const focusOrigins=new WeakMap();
function openDialog(dialog){focusOrigins.set(dialog,document.activeElement);if(dialog.id==='star-map')document.body.classList.add('map-open');dialog.showModal();dialog.scrollTop=0;}
for(const dialog of $$('dialog')){
  $('.close-dialog',dialog)?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(dialog.id==='star-map')document.body.classList.remove('map-open');const origin=focusOrigins.get(dialog);if(origin?.isConnected&&!origin.closest('[hidden]'))origin.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
}
$('#open-map').addEventListener('click',()=>openDialog($('#star-map')));
$('#project-index-button').addEventListener('click',()=>{if(data)openDialog($('#project-index'));});
$('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('mahekarabangi28@gmail.com');toast('Email copied. I’d love to hear from you.');}catch{toast('mahekarabangi28@gmail.com');}});

function svgFrame(inner,index){
  const tones=[['#b9bcfa','#e0b6d4'],['#a7c5f0','#d6b2d9'],['#e2bd9b','#c7aeef'],['#d7a8ca','#adc8ed']];
  const [a,b]=tones[index%tones.length];
  return `<svg viewBox="0 0 600 460" aria-hidden="true"><defs><linearGradient id="plate" x2="1" y2="1"><stop stop-color="${a}" stop-opacity=".12"/><stop offset="1" stop-color="${b}" stop-opacity=".025"/></linearGradient><radialGradient id="art-glow"><stop stop-color="${a}" stop-opacity=".2"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></radialGradient><filter id="star-glow"><feGaussianBlur stdDeviation="2"/></filter></defs><ellipse cx="300" cy="230" rx="270" ry="160" fill="url(#art-glow)"/><g fill="none" stroke="${a}" stroke-opacity=".18" stroke-width=".7"><ellipse cx="300" cy="230" rx="265" ry="120" transform="rotate(-20 300 230)"/><path d="M40 70h15m-7.5-7.5v15M540 360h15m-7.5-7.5v15"/></g>${inner}<g fill="${b}"><circle cx="72" cy="344" r="2"/><circle cx="520" cy="81" r="2"/><circle cx="430" cy="360" r="1.2"/></g></svg>`;
}
function projectArt(p,index){
  let inner='';
  if(p.id==='context-relay'){
    inner=`<g fill="url(#plate)" stroke="#c6b1e7" stroke-opacity=".5" stroke-width=".7"><path d="M32 140h130v158H32Z"/><path d="M224 71h151v234H224Z"/><path d="M438 149h129v158H438Z"/></g><g stroke="#b6b8ed" stroke-width=".8" fill="none"><path d="M162 218h28l34-30M375 188l33 40h30"/><path d="M45 124h130v162M237 57h151v235M451 135h129v158" stroke-opacity=".2"/></g><g font-family="Plex,monospace" font-size="8" letter-spacing="1.1" fill="#d5c8ec"><text x="48" y="165">01 / CAPTURE</text><text x="242" y="98">02 / CHECKPOINT</text><text x="454" y="175">03 / HANDOFF</text></g><g stroke="#c1b0dc" stroke-opacity=".35" stroke-width="1"><path d="M49 187h93m-93 13h67m-67 13h82m-82 13h53m-53 13h75m-75 13h40M242 126h115m-115 12h84m-84 12h99M455 200h94m-94 13h78m-78 13h88m-88 13h59"/></g><g fill="none" stroke="#d4b7dd" stroke-width=".6"><circle cx="299" cy="219" r="36"/><circle cx="299" cy="219" r="51" stroke-dasharray="2 5"/><path d="m283 219 11 11 23-24" stroke-width="1.5"/></g><g font-family="Instrument,Arial" font-size="10" fill="#cabcdc"><text x="53" y="280">selected history</text><text x="259" y="286">reviewed state</text><text x="463" y="288">a fresh session</text></g><circle cx="189" cy="218" r="3" fill="#e2c1dc"/><circle cx="408" cy="228" r="3" fill="#c0c9f9"/>`;
  }else if(p.id==='aura-linkedin'){
    inner=`<defs><linearGradient id="aura-scene" x2="1" y2="1"><stop stop-color="#8c8bad"/><stop offset=".5" stop-color="#495776"/><stop offset="1" stop-color="#c4929c"/></linearGradient></defs><g fill="url(#plate)" stroke="#c7bce4" stroke-opacity=".5" stroke-width=".8"><rect x="87" y="83" width="406" height="274" rx="6"/><path d="M87 113h406"/></g><g fill="#c7b5de"><circle cx="102" cy="98" r="2"/><circle cx="112" cy="98" r="2"/><circle cx="122" cy="98" r="2"/></g><rect x="108" y="134" width="364" height="96" rx="2" fill="url(#aura-scene)" opacity=".65"/><path d="M108 212q85-100 181-40t183 0v58H108Z" fill="#171e39" opacity=".5"/><g stroke="#d5c5e4" stroke-opacity=".4"><path d="M130 260h92m-92 13h64m58-13h190m-190 13h162m-162 13h179m-179 13h146"/></g><g fill="url(#plate)" stroke="#c9b5db" stroke-width=".8"><rect x="350" y="299" width="176" height="86" rx="4"/></g><text x="368" y="322" fill="#d7c5e3" font-family="Plex,monospace" font-size="8">YOUR APPEARANCE</text><g><circle cx="381" cy="349" r="10" fill="#b3b4d3"/><circle cx="411" cy="349" r="10" fill="#c9a9ba"/><circle cx="441" cy="349" r="10" fill="#879bbf"/><circle cx="471" cy="349" r="10" fill="#bbab8c"/></g><circle cx="381" cy="349" r="14" fill="none" stroke="#e2d7eb" stroke-width=".7"/>`;
  }else if(p.id==='build-buy-borrow'){
    inner=`<path d="M300 92v64m-180 0h360M120 156v35m180-35v35m180-35v35" stroke="#d7c0cf" stroke-width=".8" fill="none"/><circle cx="300" cy="90" r="19" fill="url(#plate)" stroke="#d7c0cf" stroke-width=".7"/><path d="M293 90h14m-7-7v14" stroke="#ecd4c8" stroke-width=".8"/>${['BUILD','BUY','BORROW'].map((label,i)=>`<g><rect x="${46+i*180}" y="191" width="148" height="170" rx="3" fill="url(#plate)" stroke="#d6bbc9" stroke-opacity=".5" stroke-width=".7"/><text x="${120+i*180}" y="223" text-anchor="middle" font-family="Plex,monospace" font-size="10" fill="#e5c7d8">${label}</text><path d="M${68+i*180} 244h104" stroke="#c7accc" stroke-opacity=".35"/><g fill="#c9b4d7" fill-opacity=".3">${[0,1,2].map((_,r)=>`<rect x="${68+i*180}" y="${264+r*24}" width="${[78,49,91][(r+i)%3]}" height="4" rx="2"/>`).join('')}</g></g>`).join('')}<text x="300" y="405" text-anchor="middle" font-family="Instrument,Arial" font-size="10" fill="#c2adc9">Three paths. One considered decision.</text>`;
  }else if(p.id==='llm-router'){
    inner=`<g fill="url(#plate)" stroke="#d4bbbf" stroke-opacity=".5" stroke-width=".7"><path d="M35 183h145v85H35Z"/><path d="M383 71h163v93H383Z"/><path d="M383 292h163v93H383Z"/></g><g fill="none" stroke="#c6b7e6" stroke-width=".8"><path d="M180 225h65q35 0 35-35v-45q0-27 27-27h76M280 225v86q0 27 27 27h76"/></g><g font-family="Plex,monospace" font-size="10" fill="#dfc7db" text-anchor="middle"><text x="107" y="231">REQUEST</text><text x="465" y="112">QWEN 1.5B</text><text x="465" y="335">LLAMA 3B</text></g><g font-family="Plex,monospace" font-size="7" fill="#ae9fbd" text-anchor="middle"><text x="465" y="137">SMALL ROUTE</text><text x="465" y="361">MEDIUM / LARGE</text><text x="280" y="268">ROUTING RULES</text></g><circle cx="280" cy="225" r="26" fill="url(#plate)" stroke="#d3bbd7" stroke-width=".6"/><path d="M280 211v28m-14-14h28" stroke="#f0cfda" stroke-width=".8"/><circle cx="340" cy="118" r="3" fill="#edc4b2"/>`;
  }else if(p.id==='mcp-impact'){
    inner=`<g stroke="#c1b7ee" stroke-opacity=".4" stroke-width=".8" fill="none"><path d="m300 220-170-100m170 100 170-100m-170 100-170 100m170-100 170 100m-170-100V55m0 165v168"/><circle cx="300" cy="220" r="104" stroke-dasharray="2 5"/><circle cx="300" cy="220" r="42"/></g><g fill="url(#plate)" stroke="#bdb6ec" stroke-opacity=".5" stroke-width=".8"><path d="M60 89h140v62H60Z"/><path d="M400 89h140v62H400Z"/><path d="M60 289h140v62H60Z"/><path d="M400 289h140v62H400Z"/></g><g font-family="Plex,monospace" font-size="9" fill="#d9c9e8" text-anchor="middle"><text x="130" y="124">PROMPTS</text><text x="470" y="124">AGENTS</text><text x="130" y="324">CONTRACTS</text><text x="470" y="324">WORKFLOWS</text></g><path d="m282 220 12 12 25-27" stroke="#dfc2df" stroke-width="1.5" fill="none"/><g fill="#cfbcf1"><circle cx="300" cy="55" r="3"/><circle cx="300" cy="388" r="2"/><circle cx="215" cy="170" r="3"/></g>`;
  }else{
    const labels=p.steps.map(s=>s.length>28?s.slice(0,26)+'…':s);
    inner=`<g stroke="#c2b4df" stroke-width=".7" stroke-opacity=".5" fill="none"><path d="m125 230 175-100 175 150-350-50"/><ellipse cx="300" cy="230" rx="190" ry="135" transform="rotate(-20 300 230)" stroke-dasharray="2 6"/></g>${[[125,230],[300,130],[475,280]].map(([x,y],i)=>`<g><rect x="${x-82}" y="${y-42}" width="164" height="84" fill="url(#plate)" stroke="#c4b0dc" stroke-opacity=".4" stroke-width=".7"/><text x="${x-64}" y="${y-20}" fill="#b9a1d1" font-family="Plex,monospace" font-size="7">0${i+1}</text><text x="${x}" y="${y+7}" text-anchor="middle" fill="#e0cce8" font-family="Instrument,Arial" font-size="10">${escape(labels[i])}</text></g>`).join('')}<circle cx="213" cy="180" r="3" fill="#e5c8df"/><circle cx="387" cy="205" r="3" fill="#c3c4f1"/>`;
  }
  return svgFrame(inner,index);
}
function renderProject(){
  if(!projects.length)return;const p=projects[projectIndex];
  $('#project-stage').innerHTML=`<div class="project-intro"><div class="project-meta"><p class="project-kicker">${escape(p.category)}</p><span class="project-status">${escape(p.status)}</span></div><h2 id="work-title">${escape(p.title)}</h2><p class="project-description">${escape(p.description)}</p><div class="project-technologies">${p.stack.map(s=>`<span>${escape(s)}</span>`).join('')}</div><div class="project-actions"><button class="project-read" aria-haspopup="dialog">Read project notes</button><a class="project-source" href="${escape(p.github)}" target="_blank" rel="noreferrer">View source</a></div></div><div class="project-space-art depth-layer" data-depth=".7"><div class="project-art-plane">${projectArt(p,projectIndex)}</div><div class="project-art-legend">${p.steps.map((step,i)=>`<span><b>0${i+1}</b>${escape(step)}</span>`).join('')}</div></div>`;
  $('#project-counter').textContent=`${String(projectIndex+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
  $('.project-read').addEventListener('click',()=>openProject(p));
}
function shiftProject(step){if(!projects.length)return;projectIndex=(projectIndex+step+projects.length)%projects.length;renderProject();$('#scene-work').scrollTop=0;sky.burst(innerWidth*.65,innerHeight*.45);$('#scene-announcement').textContent=`Project ${projectIndex+1}: ${projects[projectIndex].title}`;}
$('#previous-project').addEventListener('click',()=>shiftProject(-1));$('#next-project').addEventListener('click',()=>shiftProject(1));
document.addEventListener('keydown',e=>{if(activeScene!=='work'||$('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();shiftProject(e.key==='ArrowRight'?1:-1);}});
function showReader(label,html){$('#reader-label').textContent=label;$('#reader-content').innerHTML=html;openDialog($('#reader'));}
function openProject(p){
  showReader('Project notes, '+p.title,`<p class="reader-kicker">${escape(p.category)}, ${escape(p.status)}</p><h2 id="reader-title">${escape(p.title)}</h2><p class="reader-lede">${escape(p.question)}</p><div class="reader-steps">${p.steps.map((s,i)=>`<div><span>0${i+1}</span>${escape(s)}</div>`).join('')}</div><h3>What I built</h3><p>${escape(p.description)}</p><p>${escape(p.approach)}</p><div class="reader-boundary"><h3>Scope & current limits</h3><p>${escape(p.boundary)}</p></div><h3>Under the hood</h3><div class="reader-links">${p.evidence.map(item=>`<a href="${escape(p.github)}/blob/${encodeURIComponent(p.revision)}/${item.path.split('/').map(encodeURIComponent).join('/')}" target="_blank" rel="noreferrer">${escape(item.label)}</a>`).join('')}</div><a class="text-link" href="${escape(p.github)}" target="_blank" rel="noreferrer">Explore the repository</a>`);
}
function readingTime(note){const words=note.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.paragraphsAfterMedia||[])]).join(' ').trim().split(/\s+/).length;return Math.max(1,Math.ceil(words/220));}
function renderArticles(){
  const teasers={'agent-cloud-workload':'What survives when the process disappears?','agent-latency':'The model is only one part of the wait.','context-relay':'Keeping the thread across coding sessions.'};
  $('#notes-space').innerHTML=data.notes.map((n,i)=>`<button class="essay-row" data-note="${escape(n.slug)}" data-topic="${n.slug==='context-relay'?'context':'agents'}" aria-haspopup="dialog" aria-label="Read ${escape(n.title)}"><span class="essay-number">${String(i+1).padStart(2,'0')}</span><span class="essay-body"><span class="essay-meta"><span>${escape(n.topic)}</span><span class="essay-time">${readingTime(n)} min read</span></span><h3>${escape(n.title)}</h3><p>${escape(teasers[n.slug]||n.description)}</p></span><span class="essay-action"><span class="essay-orbit" aria-hidden="true"><i></i></span><span>Read</span></span></button>`).join('');
  $$('[data-note]').forEach(button=>button.addEventListener('click',()=>focusArticle(button.dataset.note)));
}
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  $$('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  let visible=0;
  $$('.essay-row').forEach(row=>{row.hidden=filter!=='all'&&row.dataset.topic!==filter;if(!row.hidden)visible++;});
  $('#essay-count').textContent=`${String(visible).padStart(2,'0')} ${visible===1?'essay':'essays'} / by Mahek Ara`;
}));
function articleMedia(type){
  const map={architecture:['context-relay/architecture.svg','Context Relay architecture'],demo:['context-relay/workflow.gif','Context Relay workflow demonstration'],'agent-latency':['agent-latency/architecture.gif','Illustrative agent latency workflow'],'agent-cloud-workload':['agent-cloud-workload/architecture.png','Agent infrastructure architecture']};
  if(!map[type])return '';let[src,alt]=map[type];
  if(isPaused()&&type==='agent-latency')src='agent-latency/architecture.png';
  if(isPaused()&&src.endsWith('.gif'))return `<p><a class="text-link" href="./assets/images/${src}" target="_blank" rel="noreferrer">Open the animated workflow illustration</a></p>`;
  return `<img class="article-image" src="./assets/images/${src}" alt="${alt}" loading="lazy">`;
}
function openArticle(slug){
  const n=data.notes.find(n=>n.slug===slug);if(!n)return;
  const refs=items=>`<ul class="article-references">${items.map(r=>`<li><a href="${escape(r.href)}" target="_blank" rel="noreferrer">${escape(r.title)}</a></li>`).join('')}</ul>`;
  showReader(n.topic,`<p class="reader-kicker">By Mahek Ara</p><h2 id="reader-title">${escape(n.title)}</h2><p class="reader-lede">${escape(n.description)}</p><nav class="article-contents" aria-label="Article sections">${n.sections.map(s=>`<a href="#article-${escape(s.id)}">${escape(s.label)}</a>`).join('')}</nav>${n.sections.map(s=>`<section class="article-section" id="article-${escape(s.id)}"><h3>${escape(s.title||s.label)}</h3>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}${s.example?`<div class="article-example"><strong>${escape(s.example.label)}</strong><p>${escape(s.example.text)}</p></div>`:''}${s.media?articleMedia(s.media):''}${(s.paragraphsAfterMedia||[]).map(p=>`<p>${escape(p)}</p>`).join('')}${s.references?refs(s.references):''}</section>`).join('')}${n.sources.length?`<section class="article-section"><h3>References & further reading</h3>${refs(n.sources)}</section>`:''}`);
  $$('.article-contents a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();$(a.getAttribute('href'),$('#reader'))?.scrollIntoView({behavior:isPaused()?'instant':'smooth',block:'start'});}));
}
async function loadContent(){
  try{
    const response=await fetch(new URL('./content.json',import.meta.url));if(!response.ok)throw new Error('Content unavailable');data=await response.json();
    const order=['context-relay','aura-linkedin','build-buy-borrow'];
    projects=order.map(id=>data.projects.find(p=>p.id===id)).filter(Boolean);
    renderProject();renderArticles();
    $('#project-list').innerHTML=projects.map((p,i)=>`<button class="project-list-item" data-project-index="${i}"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${escape(p.title)}</h3><p>${escape(p.category)}, ${escape(p.status)}</p></div></button>`).join('');
    $$('[data-project-index]').forEach(button=>button.addEventListener('click',()=>{projectIndex=Number(button.dataset.projectIndex);renderProject();$('#project-index').close();$('#scene-work').scrollTop=0;}));
    if(pendingNote)openArticle(pendingNote);
  }catch{
    $('#project-stage').innerHTML='<div class="error-note"><h2 id="work-title">The collection couldn’t load.</h2><p>Please refresh, or <a href="https://github.com/mahekara28">visit my GitHub</a>.</p></div>';
    $('#notes-space').innerHTML='<p class="error-note">The notes couldn’t load. Please refresh to try again.</p>';
  }
}
loadContent();
