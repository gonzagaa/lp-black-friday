// Entrada da LP (type="module"). Cada fase importa aqui os seus módulos de js/modulos/.
// js/modulos/contador.js existe, mas está sem uso (saiu da hero por ajuste do cliente; ver o módulo).
import { iniciarNav } from './modulos/nav.js';

// Marca que o JS rodou: estados que dependem de script (reveal, carrosséis) só se aplicam com .js.
document.documentElement.classList.add('js');

iniciarNav();
