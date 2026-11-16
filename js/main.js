// Entrada da LP (type="module"). Cada fase importa aqui os seus módulos de js/modulos/.
// A classe .js no <html> é posta por um script inline no <head> (antes da primeira pintura).
// js/modulos/contador.js existe, mas está sem uso (saiu da hero e não entrou na barra mobile, por decisão do cliente).
// Planos: módulos de js/modulos/home/ são PORTES do JS da home (ver o cabeçalho de cada um).
import { iniciarNav } from './modulos/nav.js?v=202611161542';
import { iniciarSimboloHero } from './modulos/simbolo-hero.js?v=202611161542';
import { iniciarRevelar } from './modulos/revelar.js?v=202611161542';
import { iniciarRolagem } from './modulos/rolagem.js?v=202611161542';
import { iniciarSelet4 } from './modulos/home/selet4.js?v=202611161542';
import { iniciarPlanosAtivo } from './modulos/home/planosAtivo.js?v=202611161542';
import { iniciarBlackPlanos } from './modulos/home/blackPlanos.js?v=202611161542';
import { iniciarCarrosselPlanos } from './modulos/home/carrosselPlanos.js?v=202611161542';
import { iniciarComunidade } from './modulos/comunidade.js?v=202611161542';
import { iniciarFechamento } from './modulos/fechamento.js?v=202611161542';
import { iniciarLimiteAlta } from './modulos/limite-alta.js?v=202611161542';
import { iniciarRodape } from './modulos/rodape.js?v=202611161542';
import { iniciarBarraMobile } from './modulos/barra-mobile.js?v=202611161542';
import { iniciarTracking } from './modulos/tracking.js?v=202611161542';
import { iniciarEscassez } from './modulos/escassez.js?v=202611161542';
import { iniciarSuporte } from './modulos/suporte.js?v=202611161542';

iniciarTracking(); // antes dos planos: o sck entra a cada href que o blackPlanos montar
iniciarEscassez();
iniciarNav();
iniciarSimboloHero();
iniciarRevelar();
iniciarRolagem();
iniciarSelet4();
iniciarPlanosAtivo();
iniciarCarrosselPlanos(iniciarBlackPlanos());
iniciarComunidade();
iniciarFechamento();
iniciarLimiteAlta();
iniciarRodape();
iniciarBarraMobile();
iniciarSuporte(); // botão do Zendesk, igual ao da home: o snippet só entra quando a hero sai da tela

// VSL (#vsl, longe da primeira dobra): o módulo só entra depois do load, fora do caminho do LCP
const vsl = () => import('./modulos/vsl.js?v=202611161542').then((m) => m.iniciarVsl()).catch(console.error);
if (document.readyState === 'complete') vsl();
else window.addEventListener('load', vsl, { once: true });

// Grão global depois do load (css/base.css): decorativo, fora do caminho da primeira dobra
const grao = () => document.documentElement.classList.add('grao-pronto');
if (document.readyState === 'complete') grao();
else window.addEventListener('load', grao, { once: true });
