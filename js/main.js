// Entrada da LP (type="module"). Cada fase importa aqui os seus módulos de js/modulos/.
// A classe .js no <html> é posta por um script inline no <head> (antes da primeira pintura).
// js/modulos/contador.js existe, mas está sem uso (saiu da hero e não entrou na barra mobile, por decisão do cliente).
// Planos: módulos de js/modulos/home/ são PORTES do JS da home (ver o cabeçalho de cada um).
import { iniciarNav } from './modulos/nav.js?v=202611041047';
import { iniciarSimboloHero } from './modulos/simbolo-hero.js?v=202611041047';
import { iniciarRevelar } from './modulos/revelar.js?v=202611041047';
import { iniciarRolagem } from './modulos/rolagem.js?v=202611041047';
import { iniciarSelet4 } from './modulos/home/selet4.js?v=202611041047';
import { iniciarPlanosAtivo } from './modulos/home/planosAtivo.js?v=202611041047';
import { iniciarBlackPlanos } from './modulos/home/blackPlanos.js?v=202611041047';
import { iniciarCarrosselPlanos } from './modulos/home/carrosselPlanos.js?v=202611041047';
import { iniciarComunidade } from './modulos/comunidade.js?v=202611041047';
import { iniciarFechamento } from './modulos/fechamento.js?v=202611041047';
import { iniciarLimiteAlta } from './modulos/limite-alta.js?v=202611041047';
import { iniciarRodape } from './modulos/rodape.js?v=202611041047';
import { iniciarBarraMobile } from './modulos/barra-mobile.js?v=202611041047';
import { iniciarTracking } from './modulos/tracking.js?v=202611041047';
import { iniciarTarja } from './modulos/tarja.js?v=202611041047';

iniciarTracking(); // antes dos planos: o sck entra a cada href que o blackPlanos montar
iniciarTarja();
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

// Grão global depois do load (css/base.css): decorativo, fora do caminho da primeira dobra
const grao = () => document.documentElement.classList.add('grao-pronto');
if (document.readyState === 'complete') grao();
else window.addEventListener('load', grao, { once: true });
