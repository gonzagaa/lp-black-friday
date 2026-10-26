// Entrada da LP (type="module"). Cada fase importa aqui os seus módulos de js/modulos/.
// A classe .js no <html> é posta por um script inline no <head> (antes da primeira pintura).
// js/modulos/contador.js existe, mas está sem uso (saiu da hero por ajuste do cliente; ver o módulo).
// Planos: módulos de js/modulos/home/ são PORTES do JS da home (ver o cabeçalho de cada um).
import { iniciarNav } from './modulos/nav.js';
import { iniciarRevelar } from './modulos/revelar.js';
import { iniciarRolagem } from './modulos/rolagem.js';
import { iniciarSelet4 } from './modulos/home/selet4.js';
import { iniciarPlanosAtivo } from './modulos/home/planosAtivo.js';
import { iniciarBlackPlanos } from './modulos/home/blackPlanos.js';
import { iniciarCarrosselPlanos } from './modulos/home/carrosselPlanos.js';

iniciarNav();
iniciarRevelar();
iniciarRolagem();
iniciarSelet4();
iniciarPlanosAtivo();
iniciarCarrosselPlanos(iniciarBlackPlanos());
