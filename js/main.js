// Entrada da LP (type="module"). Cada fase importa aqui os seus módulos de js/modulos/.
// A classe .js no <html> é posta por um script inline no <head> (antes da primeira pintura).
// js/modulos/contador.js existe, mas está sem uso (saiu da hero por ajuste do cliente; ver o módulo).
import { iniciarNav } from './modulos/nav.js';
import { iniciarRevelar } from './modulos/revelar.js';

iniciarNav();
iniciarRevelar();
