// Entrada da LP (type="module"). Cada fase importa aqui os seus módulos de js/modulos/.
// A classe .js no <html> é posta por um script inline no <head> (antes da primeira pintura).
// js/modulos/contador.js existe, mas está sem uso (saiu da hero e não entrou na barra mobile, por decisão do cliente).
// Planos: módulos de js/modulos/home/ são PORTES do JS da home (ver o cabeçalho de cada um).
import { iniciarNav } from './modulos/nav.js';
import { iniciarRevelar } from './modulos/revelar.js';
import { iniciarRolagem } from './modulos/rolagem.js';
import { iniciarSelet4 } from './modulos/home/selet4.js';
import { iniciarPlanosAtivo } from './modulos/home/planosAtivo.js';
import { iniciarBlackPlanos } from './modulos/home/blackPlanos.js';
import { iniciarCarrosselPlanos } from './modulos/home/carrosselPlanos.js';
import { iniciarComunidade } from './modulos/comunidade.js';
import { iniciarFechamento } from './modulos/fechamento.js';
import { iniciarRodape } from './modulos/rodape.js';
import { iniciarBarraMobile } from './modulos/barra-mobile.js';
import { iniciarTracking } from './modulos/tracking.js';

iniciarTracking(); // antes dos planos: o sck entra a cada href que o blackPlanos montar
iniciarNav();
iniciarRevelar();
iniciarRolagem();
iniciarSelet4();
iniciarPlanosAtivo();
iniciarCarrosselPlanos(iniciarBlackPlanos());
iniciarComunidade();
iniciarFechamento();
iniciarRodape();
iniciarBarraMobile();

// Grão global depois do load (css/base.css): decorativo, fora do caminho da primeira dobra
const grao = () => document.documentElement.classList.add('grao-pronto');
if (document.readyState === 'complete') grao();
else window.addEventListener('load', grao, { once: true });
