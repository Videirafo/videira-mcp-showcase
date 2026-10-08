import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('docs/index.html');
const css=read('docs/styles.css');
const js=read('docs/app.js');

test('marketing page and README share the core Videira brand',()=>{
  assert.match(html,/<title>Videira MCP — Control with Proof<\/title>/);
  assert.match(read('README.md'),/Videira MCP · Control with Proof/);
  for(const page of ['docs/logo.svg','docs/og-card.svg','docs/app.js','docs/styles.css','docs/404.html','docs/.nojekyll'])assert.ok(existsSync(new URL('../'+page,import.meta.url)),page);
});

test('site loads only own script/style/image assets, with restrictive CSP',()=>{
  assert.match(html,/Content-Security-Policy/);
  assert.match(html,/connect-src &#39;none&#39;/);
  assert.equal((html.match(/<script\b/gi)||[]).length,1);
  assert.match(html,/<script src="\.\/app\.js" defer><\/script>/);
  assert.match(html,/<link rel="stylesheet" href="\.\/styles\.css">/);
  assert.doesNotMatch(html,/<iframe\b|<form\b|\bonclick\s*=|<script[^>]+https?:\/\//i);
  assert.doesNotMatch(css,/@import|url\s*\(\s*['"]?https?:/i);
  assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|document\.cookie/);
});

test('presented demo is explicitly simulated and not a production claim',()=>{
  for(const label of ['SIMULATED','MOCK_PASS','BLOCKED_BY_DEFAULT','productionReady:false'])assert.ok(js.includes(label),label);
  assert.match(html,/SEM BACKEND/);
  assert.match(read('README.md'),/O núcleo operacional, sua configuração privada/);
});

test('all four source links are present and use safe external link relations',()=>{
  for(const p of ['obra/superpowers','multica-ai/andrej-karpathy-skills','ayghri/i-have-adhd','nyldn/claude-octopus']){
    assert.ok(html.includes('https://github.com/'+p),p);
    assert.ok(read('README.md').includes('https://github.com/'+p),p);
  }
  assert.equal((html.match(/target="_blank"/g)||[]).length,(html.match(/rel="noopener noreferrer"/g)||[]).length);
});

test('all translated strings have valid markup keys',()=>{
  const required=[...html.matchAll(/data-i18n="([^"]+)"/g)].map(m=>m[1]);
  const m=js.match(/const translations = ([\s\S]*?);\nconst mock =/);
  assert.ok(m);
  const dictionary=runInNewContext('('+m[1]+')',{});
  for(const lang of ['pt','en'])for(const key of required){
    assert.equal(typeof dictionary[lang][key],'string',lang+':'+key);
    assert.ok(dictionary[lang][key].trim().length>0,lang+':'+key);
  }
});

test('interaction changes mock stage and EN/PT language without external requests',()=>{
  const clicks={};
  const buttons=['discover','validate','review','release'].map(step=>({
    dataset:{step},classList:{toggle(k,on){this.active=on}},setAttribute(k,v){this[k]=v},
    addEventListener(k,fn){clicks[step]=fn},
  }));
  const nodes=new Map();
  for(const key of ['#demoOutput','#demoFile','#languageToggle','#copyDemo','#year']){
    nodes.set(key,{textContent:'',innerHTML:'',setAttribute(k,v){this[k]=v},addEventListener(k,fn){clicks[key]=fn},querySelector(){return {textContent:''}}});
  }
  const i18n=[...html.matchAll(/data-i18n="([^"]+)"/g)].map(m=>({
    key:m[1],textContent:'',getAttribute(){return this.key},
  }));
  const mockDocument={
    documentElement:{lang:''},
    querySelectorAll(s){if(s==='[data-step]')return buttons;if(s==='[data-i18n]')return i18n;throw Error('unknown selector')},
    querySelector(s){return nodes.get(s)},
  };
  const copied=[];
  runInNewContext(js,{document:mockDocument,navigator:{clipboard:{writeText:async v=>copied.push(v)}},Date,console});
  assert.match(nodes.get('#demoOutput').innerHTML,/discover/);
  clicks.review();
  assert.match(nodes.get('#demoOutput').innerHTML,/DISAGREEMENT/);
  assert.equal(buttons[2]['aria-pressed'],'true');
  clicks.release();
  assert.match(nodes.get('#demoOutput').innerHTML,/BLOCKED_BY_DEFAULT/);
  clicks['#languageToggle']();
  assert.equal(mockDocument.documentElement.lang,'en');
  assert.equal(i18n.find(x=>x.key==='nav_demo').textContent,'Demo');
  clicks['#languageToggle']();
  assert.equal(mockDocument.documentElement.lang,'pt-BR');
});

test('no credential-like secret literals embedded in public artifacts',()=>{
  const all=['README.md','SECURITY.md','docs/index.html','docs/styles.css','docs/app.js','docs/logo.svg','docs/og-card.svg'].map(read).join('\n');
  for(const pattern of [
    /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
    /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{55,})\b/,
    /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
    /https?:\/\/[^/]*:[^/@]*@/,
  ])assert.doesNotMatch(all,pattern);
});
