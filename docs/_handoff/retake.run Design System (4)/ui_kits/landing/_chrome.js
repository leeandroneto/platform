/* retake landing — header & footer compartilhados.
   Uma fonte única injetada em todas as páginas. Inclua com:
   <script src="_chrome.js"></script> (após o lucide). */
(function () {
  var CSS = `
  .header { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--grafite-ink) 90%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border-on-dark); }
  .header .header-in { display: flex; align-items: center; justify-content: space-between; height: 68px; gap: 16px; max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .header img { height: 22px; display: block; }
  .header .nav { display: flex; gap: 4px; align-items: center; }
  .header .nav-it { display: inline-flex; align-items: center; gap: 6px; padding: 10px 12px; border: none; background: transparent; border-radius: var(--radius-8); cursor: pointer; font: 600 12px/1 var(--font-body); text-transform: uppercase; letter-spacing: 0.11em; color: var(--creme); opacity: 0.85; white-space: nowrap; transition: opacity .15s ease, color .15s ease, background .15s ease; text-decoration: none; }
  .header .nav-it:hover, .header .nav-dd:hover .nav-it, .header .nav-dd:focus-within .nav-it { opacity: 1; color: var(--terracota-300); background: rgba(241,236,226,0.07); }
  .header .nav-it svg { width: 13px; height: 13px; }
  .header .nav-dd { position: relative; }
  .header .nav-dd .dd { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); padding-top: 10px; display: none; z-index: 60; }
  .header .nav-dd:hover .dd, .header .nav-dd:focus-within .dd { display: block; }
  .header .dd-in { background: var(--grafite-800); border: 1px solid var(--border-on-dark); border-radius: var(--radius-12); box-shadow: var(--shadow-300); padding: 8px; min-width: 320px; display: flex; flex-direction: column; gap: 2px; }
  .header .dd-in a { display: flex; flex-direction: column; gap: 3px; padding: 10px 12px; border-radius: var(--radius-8); opacity: 1; text-decoration: none; }
  .header .dd-in a:hover { background: var(--grafite-700); }
  .header .dd-in b { font: 600 13.5px/1.3 var(--font-body); color: var(--creme); letter-spacing: 0; text-transform: none; }
  .header .dd-in a:hover b { color: var(--terracota-300); }
  .header .dd-in span { font: 400 12px/1.4 var(--font-body); color: var(--text-on-dark-muted); letter-spacing: 0; text-transform: none; white-space: normal; }
  .header .header-cta { display: flex; align-items: center; gap: 16px; }
  .header .login-link { display: inline-flex; align-items: center; gap: 6px; font: 600 12px/1 var(--font-body); text-transform: uppercase; letter-spacing: 0.11em; color: var(--creme); opacity: 0.85; white-space: nowrap; text-decoration: none; transition: opacity .15s ease, color .15s ease; }
  .header .login-link:hover { opacity: 1; color: var(--terracota-300); }
  .header .login-link svg { width: 14px; height: 14px; }
  .header .btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; height: 38px; padding: 0 18px; border-radius: var(--radius-pill); font: 600 12px/1 var(--font-body); text-transform: uppercase; letter-spacing: 0.06em; cursor: pointer; border: 2px solid transparent; white-space: nowrap; text-decoration: none; transition: background .2s ease, transform .12s ease; }
  .header .btn:active { transform: scale(0.98); }
  .header .btn-primary { background: var(--terracota); color: var(--creme); }
  .header .btn-primary:hover { background: var(--terracota-600); }
  .header .btn svg { width: 16px; height: 16px; }

  .footer { background: var(--creme-100); padding: 64px 0 0; }
  .footer .wrap { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
  .footer .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr 1.1fr; gap: 36px; padding-bottom: 48px; }
  .footer img.logo { height: 22px; margin-bottom: 16px; }
  .footer .footer-brand p { font: var(--body-sm); font-size: 13px; color: var(--text-muted); max-width: 230px; margin: 0; }
  .footer .fcol h4 { font: 600 11px/1 var(--font-body); text-transform: uppercase; letter-spacing: 0.14em; color: var(--text-muted); margin: 0 0 16px; }
  .footer .fcol ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .footer .fcol a { font: var(--body-sm); font-size: 13.5px; color: var(--grafite); text-decoration: none; }
  .footer .fcol a:hover { color: var(--terracota); }
  .footer .fcol li.contact { display: flex; align-items: center; gap: 8px; font: var(--body-sm); font-size: 13.5px; color: var(--grafite); }
  .footer .fcol li.contact svg { width: 15px; height: 15px; color: var(--cinza-mineral); flex: none; }
  .footer .footer-bottom { border-top: 1px solid var(--border-strong); padding: 20px 0; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; max-width: 1200px; margin: 0 auto; }
  .footer .cycle { display: flex; gap: 9px; font: 700 12px/1 var(--font-display); text-transform: uppercase; letter-spacing: 0.06em; }
  .footer .cycle .run { color: var(--terracota); } .footer .cycle .eat { color: var(--grafite); } .footer .cycle .rec { color: var(--azul-oceano); } .footer .cycle .rep { color: var(--cinza-mineral); }
  .footer small { font: var(--caption); color: var(--text-muted); }

  @media (max-width: 980px) { .header .nav { display: none; } .footer .footer-grid { grid-template-columns: 1fr 1fr; } }
  `;

  var HEADER = `
  <header class="header" data-screen-label="Header">
    <div class="header-in">
      <a href="index.html"><img src="../../assets/logo-full-cream.svg" alt="RETAKE"></a>
      <nav class="nav">
        <a class="nav-it" href="index.html#ecossistema">Sobre nós</a>
        <div class="nav-dd">
          <button class="nav-it" type="button">Para assessorias <i data-lucide="chevron-down"></i></button>
          <div class="dd"><div class="dd-in">
            <a href="assessorias.html"><b>Visão geral</b><span>tudo que a sua assessoria ganha na rede</span></a>
            <a href="../tenant-site/onboarding.html"><b>Criar site grátis</b><span>self-service · no ar em minutos</span></a>
            <a href="trafego-pago.html"><b>Tráfego pago</b><span>anúncios que enchem a sua agenda de alunos</span></a>
            <a href="plataforma.html"><b>Plataforma completa</b><span>treino, app, gestão e loja — em breve</span></a>
          </div></div>
        </div>
        <div class="nav-dd">
          <button class="nav-it" type="button">Para corredores <i data-lucide="chevron-down"></i></button>
          <div class="dd"><div class="dd-in">
            <a href="corredores.html"><b>Vitrine de assessorias</b><span>ache a assessoria certa na sua cidade</span></a>
            <a href="eventos.html"><b>Calendário de provas</b><span>corridas do Brasil inteiro num lugar só</span></a>
          </div></div>
        </div>
        <div class="nav-dd">
          <button class="nav-it" type="button">Para empresas <i data-lucide="chevron-down"></i></button>
          <div class="dd"><div class="dd-in">
            <a href="patrocinio.html"><b>Patrocínio &amp; apoio</b><span>sua marca na rede — estadual ou nacional</span></a>
            <a href="empresas.html"><b>Vitrine B2B</b><span>venda para assessorias do Brasil inteiro</span></a>
          </div></div>
        </div>
      </nav>
      <div class="header-cta">
        <a class="login-link" href="../auth/index.html"><i data-lucide="log-in"></i>Entrar</a>
        <a class="btn btn-primary btn-sm" href="../tenant-site/onboarding.html"><i data-lucide="plus"></i>Criar site grátis</a>
      </div>
    </div>
  </header>`;

  var FOOTER = `
  <footer class="footer" data-screen-label="Footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="logo" src="../../assets/logo-full.svg" alt="RETAKE">
          <p>A rede das comunidades de corrida. Infraestrutura para quem move pessoas.</p>
        </div>
        <div class="fcol">
          <h4>A rede</h4>
          <ul>
            <li><a href="index.html#ecossistema">O que é</a></li>
            <li><a href="assessorias.html">Para assessorias</a></li>
            <li><a href="trafego-pago.html">Tráfego pago</a></li>
            <li><a href="novidades.html">Novidades</a></li>
            <li><a href="plataforma.html">Plataforma · em breve</a></li>
          </ul>
        </div>
        <div class="fcol">
          <h4>Para corredores</h4>
          <ul>
            <li><a href="corredores.html">Vitrine de assessorias</a></li>
            <li><a href="corredores.html#marcas">Cupons &amp; marcas</a></li>
            <li><a href="eventos.html">Calendário de provas</a></li>
          </ul>
        </div>
        <div class="fcol">
          <h4>Para empresas</h4>
          <ul>
            <li><a href="patrocinio.html">Patrocínio &amp; apoio</a></li>
            <li><a href="empresas.html">Vitrine B2B</a></li>
          </ul>
        </div>
        <div class="fcol">
          <h4>Contato</h4>
          <ul>
            <li class="contact"><i data-lucide="message-circle"></i>WhatsApp</li>
            <li class="contact"><i data-lucide="mail"></i>contato@retake.run</li>
            <li class="contact"><i data-lucide="instagram"></i>@retake.run</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="cycle"><span class="run">Run.</span><span class="eat">Eat.</span><span class="rec">Recovery.</span><span class="rep">Repeat.</span></div>
        <small>© 2026 Retake. Todos os direitos reservados.</small>
      </div>
    </div>
  </footer>`;

  function mount() {
    var st = document.createElement('style'); st.id = 'rtk-chrome-css'; st.textContent = CSS;
    document.head.appendChild(st);
    var h = document.createElement('div'); h.innerHTML = HEADER.trim();
    document.body.insertBefore(h.firstElementChild, document.body.firstChild);
    var f = document.createElement('div'); f.innerHTML = FOOTER.trim();
    document.body.appendChild(f.firstElementChild);
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
