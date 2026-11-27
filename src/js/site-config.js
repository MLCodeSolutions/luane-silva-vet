/* ==========================================================================
   site-config.js — dados do site da Luane Silva
   Alterou aqui? Rode o build para refletir no dist/.
   ========================================================================== */

window.SITE = {
  brand: 'Luane Silva',
  whatsapp: '5582996795571',
  phoneDisplay: '(82) 99679-5571',
  email: '',
  instagram: 'https://www.instagram.com/luanesilva.vet',
  facebook: '',
  coupon: '',
  crmv: '',
  domain: ''
};

/* Modo leve: celular pequeno, economia de dados ou 2G. */
(function () {
  try {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    var lite = conn.saveData === true ||
      /(^|-)2g$/.test(conn.effectiveType || '') ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-data: reduce)').matches) ||
      window.innerWidth < 600;

    if (lite) document.documentElement.classList.add('is-lite');
  } catch (error) {
    /* sem suporte: segue no modo normal */
  }
}());
