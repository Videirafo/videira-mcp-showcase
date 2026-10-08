'use strict';
// Pure client-side showcase. Zero requests, zero credentials, zero telemetry.
// All simulated outputs are generated from constant example data.
const translations = {
  pt: {
    nav_platform:'Plataforma',nav_demo:'Demo',nav_principles:'Princípios',nav_security:'Segurança',
    hero_eyebrow:'ENGENHARIA DE IA • GOVERNANÇA POR EVIDÊNCIAS',
    hero_a:'Inteligência que executa.',hero_b:'Controle que comprova.',
    hero_lead:'Um plano de controle para conectar agentes de IA, repositórios e operações — com autenticação, limites explícitos, revisão humana e releases verificáveis.',
    hero_cta:'Explorar demo interativa',hero_secondary:'Conhecer a arquitetura',
    hero_note:'Demonstração local e simulada. Nenhuma conexão à VPS.',
    platform_title:'Da intenção ao resultado. Sem pular etapas.',
    platform_intro:'A arquitetura reúne ferramentas de engenharia, integração GitHub, dispositivos autorizados e controles de publicação em um mesmo fluxo auditável.',
    feat1:'Orquestração de engenharia',feat1_p:'Inspeção de projetos, diagnóstico, edição controlada e testes antes de qualquer promoção.',
    feat2:'Segurança por padrão',feat2_p:'Permissões declaradas, autenticação, trilhas de auditoria e limites para operações sensíveis.',
    feat3:'Releases com evidências',feat3_p:'Validação por commit exato, smoke tests e rollback governado por políticas.',
    feat4:'Acesso multicliente',feat4_p:'Integração MCP para clientes compatíveis e dispositivos explicitamente autorizados.',
    demo_title:'Veja o fluxo. Sem risco real.',
    demo_intro:'Esta experiência demonstra apenas estados ilustrativos. Nenhum comando é executado, nenhum token é utilizado e nenhum serviço externo é acessado.',
    demo_workflow:'ETAPAS DO WORKFLOW',step_discover:'Discover',step_validate:'Validate',step_review:'Review',step_release:'Release',
    sim_notice:'AMBIENTE SIMULADO — SEM BACKEND',copy:'Copiar JSON',copied:'Copiado!',
    principles_title:'Quatro referências. Uma disciplina.',
    principles_intro:'Os padrões abaixo inspiram o método de trabalho. São adaptações conceituais; nenhum plugin de terceiros é executado nesta página.',
    p1:'Especificar, testar primeiro e revisar antes de integrar.',
    p2:'Mudanças pequenas, hipóteses explícitas e menos complexidade.',
    p3:'Ações objetivas, etapas curtas e progresso legível.',
    p4:'Pareceres distintos, divergências explícitas e revisão humana.',
    security_title:'Autonomia com limites. Autoridade com provas.',
    security_copy:'O projeto aplica autenticação, escopos e verificações governadas às operações. Segurança é um processo contínuo de teste, auditoria e melhoria — não uma promessa de invulnerabilidade.',
    security_link:'Conheça os projetos da Videira',sec1:'Acesso autenticado',sec2:'Mudanças verificadas',sec3:'Publicação governada',sec4:'Demonstração sem credenciais',
    closing_title:'O futuro não é só automatizar. É poder confiar no processo.',
    closing_p:'Explore a visão do projeto e acompanhe a evolução do ecossistema Videira.',
    closing_cta:'Ver projetos no GitHub',closing_top:'Voltar ao topo',
    footer_note:'Vitrine pública independente. Núcleo operacional e credenciais não incluídos.'
  },
  en: {
    nav_platform:'Platform',nav_demo:'Demo',nav_principles:'Principles',nav_security:'Security',
    hero_eyebrow:'AI ENGINEERING • EVIDENCE-BASED GOVERNANCE',
    hero_a:'Intelligence that acts.',hero_b:'Control you can verify.',
    hero_lead:'An engineering control plane connecting AI agents, repositories and operations — with identity, explicit boundaries, human review and verifiable releases.',
    hero_cta:'Explore interactive demo',hero_secondary:'Discover the architecture',
    hero_note:'Local simulated demo. No connection to the VPS.',
    platform_title:'From intent to proof. No shortcuts.',
    platform_intro:'A unified approach to engineering tools, GitHub integration, authorized devices and release controls within an auditable workflow.',
    feat1:'Engineering orchestration',feat1_p:'Inspect repositories, diagnose, edit within approved scope and test before promotion.',
    feat2:'Security by design',feat2_p:'Declared permissions, identity controls, audit records and sensitive-operation boundaries.',
    feat3:'Evidence-driven releases',feat3_p:'Exact-commit validation, smoke tests and policy-governed rollback.',
    feat4:'Multi-client access',feat4_p:'MCP-compatible clients and explicitly authorized devices.',
    demo_title:'Explore the flow. Not real infrastructure.',
    demo_intro:'This experience uses illustrative states only. No commands execute, no tokens are used and no external services are accessed.',
    demo_workflow:'WORKFLOW STAGES',step_discover:'Discover',step_validate:'Validate',step_review:'Review',step_release:'Release',
    sim_notice:'SIMULATED ENVIRONMENT — NO BACKEND',copy:'Copy JSON',copied:'Copied!',
    principles_title:'Four references. One discipline.',
    principles_intro:'These patterns inspire the workflow. They are conceptual adaptations; no third-party plugins run on this page.',
    p1:'Specify, test first, and review before integrating.',
    p2:'Small changes, explicit assumptions and less complexity.',
    p3:'Concrete actions, short stages and readable progress.',
    p4:'Independent perspectives, explicit disagreement and human review.',
    security_title:'Autonomy with boundaries. Authority with evidence.',
    security_copy:'The project applies identity, scopes and governed verification to operations. Security requires continuous testing, auditing and improvement — not claims of invulnerability.',
    security_link:'Explore the Videira projects',sec1:'Authenticated access',sec2:'Verified changes',sec3:'Governed releases',sec4:'Credential-free demonstration',
    closing_title:'The future is not just automation. It is confidence in the process.',
    closing_p:'Explore the project vision and follow the Videira ecosystem.',
    closing_cta:'View GitHub projects',closing_top:'Back to top',
    footer_note:'Independent public showcase. No operational core or credentials included.'
  }
};
const mock = Object.freeze({
  discover: { mode:'SIMULATED', stage:'discover', repository:'sample/project', tools:['repo.inspect','repo.doctor'], access:'read-only', externalCalls:0 },
  validate: { mode:'SIMULATED', stage:'validate', candidate:'example-commit-not-a-real-sha', checks:{typecheck:'MOCK_PASS', tests:'MOCK_PASS', security:'MOCK_PASS'}, realTestsExecuted:false },
  review: { mode:'SIMULATED', stage:'review', opinions:[{source:'mock-A',verdict:'allow'},{source:'mock-B',verdict:'block'}], agreement:'DISAGREEMENT', humanReview:'REQUIRED' },
  release: { mode:'SIMULATED', stage:'release', exactSha:null, reviewApproval:false, trustedStatus:false, productionReady:false, decision:'BLOCKED_BY_DEFAULT' }
});
const buttons = [...document.querySelectorAll('[data-step]')];
const output = document.querySelector('#demoOutput');
const file = document.querySelector('#demoFile');
const languageButton = document.querySelector('#languageToggle');
const copyButton = document.querySelector('#copyDemo');
const year = document.querySelector('#year');
if(year) year.textContent = String(new Date().getFullYear());
let selected = 'discover';
let language = 'pt';
function escapeHTML(value) {
  return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function renderJSON(obj) {
  const safe=escapeHTML(JSON.stringify(obj,null,2));
  return safe
    .replace(/(&quot;[^&]+&quot;)(?=\s*:)/g,'<span class="json-key">$1</span>')
    .replace(/(:\s*)(&quot;.*?&quot;)/g,'$1<span class="json-str">$2</span>')
    .replace(/\b(true|false|null)\b/g,'<span class="json-bool">$1</span>');
}
function renderDemo() {
  if (!Object.prototype.hasOwnProperty.call(mock, selected)) return;
  if (output) output.innerHTML = renderJSON(mock[selected]);
  if (file) file.textContent = 'workflow/'+selected+'.json';
  buttons.forEach(button=>{
    const active=button.dataset.step===selected;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
}
function setLanguage(next) {
  if(!Object.prototype.hasOwnProperty.call(translations,next))return;
  language=next;document.documentElement.lang=next==='pt'?'pt-BR':'en';
  for(const node of document.querySelectorAll('[data-i18n]')){
    const key=node.getAttribute('data-i18n');
    if(key && Object.prototype.hasOwnProperty.call(translations[next],key))node.textContent=translations[next][key];
  }
  if(languageButton){
    languageButton.textContent=next==='pt'?'EN':'PT';
    languageButton.setAttribute('aria-label', next==='pt'?'Switch language to English':'Mudar idioma para português');
  }
}
buttons.forEach(button=>button.addEventListener('click',()=>{
  const step=button.dataset.step;
  if(!Object.prototype.hasOwnProperty.call(mock,step))return;
  selected=step;renderDemo();
}));
languageButton?.addEventListener('click',()=>setLanguage(language==='pt'?'en':'pt'));
copyButton?.addEventListener('click',async()=>{
  try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(JSON.stringify(mock[selected],null,2));
    const copyLabel=copyButton.querySelector('[data-i18n]');
    if(copyLabel){
      copyLabel.textContent=translations[language].copied;
      copyButton.setAttribute('aria-label',translations[language].copied);
    }
  }catch{
    copyButton.setAttribute('aria-label','Clipboard unavailable');
  }
});
renderDemo();
