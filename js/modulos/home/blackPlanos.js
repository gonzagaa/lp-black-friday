/* PORTE de ../Zero7/script/blackPlanos.js (V4, três modos: 30dias | 60dias | reinicio).
   Mudanças em relação à home, e só estas:
   - módulo ES: a IIFE virou iniciarBlackPlanos(), que devolve uma promessa resolvida quando os cards estão
     preenchidos (o carrossel só arma depois disso);
   - DATA_URL -> PLANOS_URL (js/config.js), com fallback no snapshot embutido se o fetch falhar (Fase 4). A leitura
     fica em js/modulos/dados-planos.js, dividida com o comparativo dos benefícios e o limite de perda;
   - card sem preço ou sem checkout válido sai do carrossel (Fase 4: nunca mostrar card sem preço);
   - card preenchido ganha .is-pronto (até lá a pele o deixa invisível, ocupando o lugar);
   - os cards ficam na ordem do planos.json (ordenarComoNoJson).
   O resto (modos, botões, textos, flash, footnote, withCurrentQueryParams) é o da home. */
import { carregarPlanos } from '../dados-planos.js';
import { separarParcela, separarAvista, checkoutValido } from '../precos.js';

export function iniciarBlackPlanos() {
  let currentMode = null;
  let cache = null;
  let activeModeIds = [];
  let allButtons = [];
  let modesConfig = [];

  const sections = Array.from(document.querySelectorAll("section.planos"));
  if (!sections.length) return Promise.resolve();

  const buttonContainers = [];
  const modeUiElements = [];
  const allCards = [];
  sections.forEach(sec => {
    const containers = Array.from(sec.querySelectorAll(".botoes"));
    const headings = Array.from(sec.querySelectorAll(".js-plan-mode-heading"));
    const descriptions = Array.from(sec.querySelectorAll(".js-plan-mode-description"));
    const cards = Array.from(sec.querySelectorAll(".card[data-plan]"));
    buttonContainers.push(...containers);
    modeUiElements.push(...containers, ...headings, ...descriptions);
    allCards.push(...cards);
  });

  async function init() {
    const db = await loadData();
    const config = db?.config || {};
    modesConfig = Array.isArray(config.modes) ? config.modes : [];
    const activeModes = getActiveModes(config);

    if (!activeModes.length) {
      throw new Error("Nenhum modo ativo encontrado em config.modes no planos.json");
    }

    activeModeIds = activeModes.map(mode => mode.id);
    renderModeButtons(activeModes, config.hideButtonsWhenSingleMode === true);

    const defaultMode = activeModeIds.includes(config.defaultMode)
      ? config.defaultMode
      : activeModes[0].id;

    await setMode(defaultMode);
    ordenarComoNoJson(db[defaultMode]);
  }

  // LP: os cards de cada carrossel ficam na ordem das chaves do planos.json (na home, o HTML traz o BIT 16
  // antes do BIT 8). Roda uma vez, antes de o carrossel armar; a troca de modo não reordena.
  function ordenarComoNoJson(table) {
    if (!table) return;
    const ordem = Object.keys(table);
    sections.forEach(sec => {
      sec.querySelectorAll(".swiper-wrapper").forEach(wrapper => {
        Array.from(wrapper.querySelectorAll(":scope > .card[data-plan]"))
          .sort((a, b) => ordem.indexOf(a.dataset.plan) - ordem.indexOf(b.dataset.plan))
          .forEach(card => wrapper.appendChild(card));
      });
    });
  }

  function getActiveModes(config) {
    if (!Array.isArray(config.modes)) return [];

    return config.modes
      .filter(mode => mode && mode.active === true && mode.id)
      .map(mode => ({
        id: String(mode.id),
        label: mode.label ? String(mode.label) : String(mode.id)
      }));
  }

  function renderModeButtons(activeModes, hideButtonsWhenSingleMode) {
    allButtons = [];
    const shouldHideModeUi = activeModes.length === 1 && hideButtonsWhenSingleMode;

    modeUiElements.forEach(el => setElementVisible(el, !shouldHideModeUi));

    buttonContainers.forEach(container => {
      container.innerHTML = "";

      if (shouldHideModeUi) return;

      activeModes.forEach(mode => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.mode = mode.id;
        btn.textContent = mode.label;
        btn.setAttribute("aria-pressed", "false");
        btn.addEventListener("click", () => {
          if (!activeModeIds.includes(mode.id)) return;
          setMode(mode.id).catch(console.error);
        });

        container.appendChild(btn);
        allButtons.push(btn);
      });
    });
  }

  function setElementVisible(el, isVisible) {
    el.hidden = !isVisible;
    el.style.display = isVisible ? "" : "none";
  }

  async function setMode(mode) {
    if (!activeModeIds.includes(mode)) return;

    currentMode = mode;
    setButtonsVisual(mode);
    updateModeTexts(mode);
    await applyModeToCards(mode);
    applyFootnote(mode);

    try {
      if (typeof fbq === "function") fbq("trackCustom", "SelectPlanMode", { mode });
      if (typeof gtag === "function") gtag("event", "select_plan_mode", { mode });
      window.dispatchEvent(new CustomEvent("zero7:planModeChanged", { detail: { mode } }));
    } catch (_) {}
  }

  function setButtonsVisual(mode) {
    allButtons.forEach(b => {
      b.classList.toggle("selecionado", b.dataset.mode === mode);
      b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false");
    });
  }

  // A dobra é única agora; o .bit entra/sai da section conforme o ativo
  // selecionado, então o seletor não pode depender dessa classe.
  function updateModeTexts(mode) {
    const containers = document.querySelectorAll("section.planos .textBotoes");
    containers.forEach(ct => {
      const ps = Array.from(ct.querySelectorAll("p"));
      ps.forEach(p => {
        const show = p.classList.contains("mode-" + mode);
        p.classList.toggle("is-active", show);
        p.style.display = show ? "" : "none";
      });
    });
  }

  // LP: se o fetch falhar (ou vier sem modo ativo), usa o snapshot embutido
  async function loadData() {
    if (cache) return cache;
    cache = await carregarPlanos();
    return cache;
  }

  // efeito antigo -> só no "Máximo de dias"
  function flashMaxDias(el) {
    if (!el) return;
    el.classList.remove("flash-change");
    el.offsetHeight; // reflow
    el.classList.add("flash-change");
    setTimeout(() => el.classList.remove("flash-change"), 700);
  }

  // efeito suave -> preços
  function flashPreco(el) {
    if (!el) return;
    el.classList.add("flash-base");
    el.classList.remove("flash-active");
    el.offsetHeight; // reflow
    el.classList.add("flash-active");
    setTimeout(() => el.classList.remove("flash-active"), 400);
  }

  // LP: o card só entra com os três textos de preço no formato da home e um checkout http(s)
  function cardValido(cfg) {
    return !!cfg && typeof cfg.oldPrice === "string" && cfg.oldPrice.trim() !== ""
      && !!separarParcela(cfg.parcel) && !!separarAvista(cfg.avista) && checkoutValido(cfg.checkout);
  }

  async function applyModeToCards(mode) {
    const db = await loadData();
    const table = db[mode];
    if (!table) {
      console.warn(`[blackPlanos] Modo ativo sem dados em planos.json: ${mode}`);
    }

    allCards.forEach(card => {
      const key = (card.dataset.plan || "").toLowerCase(); // trainee, junior, bit_trainee...
      const cfg = table && table[key];
      if (!cardValido(cfg)) {
        // LP: sem preço ou sem checkout, o card sai do carrossel (e o indicador dele não nasce)
        console.warn(`[planos] Card retirado, sem preço ou checkout válido no modo "${mode}": ${key}`);
        card.remove();
        return;
      }

      // OLD PRICE -> atualiza só o valor do span
      const oldPriceEl = card.querySelector(".js-old-price");
      if (oldPriceEl && cfg.oldPrice) {
        const newOld = String(cfg.oldPrice);
        if (oldPriceEl.textContent !== newOld) {
          oldPriceEl.textContent = newOld;
          flashPreco(oldPriceEl);
        }
      }

      // MAX DIAS
      const maxEl = card.querySelector(".js-max-dias");
      if (maxEl && typeof cfg.maxDias !== "undefined") {
        const newMax = String(cfg.maxDias);
        if (maxEl.textContent !== newMax) {
          maxEl.textContent = newMax;
          flashMaxDias(maxEl);
        }
      }

      // PREÇO PARCELADO
      const parcelEl = card.querySelector(".js-price-parcel");
      if (parcelEl && cfg.parcel) {
        const newParcelVal = (() => {
          const val = String(cfg.parcel).replace(/^12x\s*/i, "");
          return `<span>12x</span> ${escapeHTML(val)}`;
        })();
        if (parcelEl.innerHTML !== newParcelVal) {
          parcelEl.innerHTML = newParcelVal;
          flashPreco(parcelEl);
        }
      }

      // PREÇO À VISTA
      const avistaEl = card.querySelector(".js-price-avista");
      if (avistaEl && cfg.avista) {
        const cleaned = String(cfg.avista).replace(/^ou\s*/i, "").replace(/\s*à vista$/i, "");
        const newAvistaVal = `<span>ou</span> ${escapeHTML(cleaned)} <span>à vista</span>`;
        if (avistaEl.innerHTML !== newAvistaVal) {
          avistaEl.innerHTML = newAvistaVal;
          flashPreco(avistaEl);
        }
      }

      // CHECKOUT
      const link = card.querySelector(".js-checkout");
      if (link && cfg.checkout) {
        link.classList.add("link4selet");
        const newHref = withCurrentQueryParams(cfg.checkout);
        if (link.getAttribute("href") !== newHref) {
          link.setAttribute("href", newHref);
        }
      }

      card.classList.add("is-pronto");
    });
  }

  // Notinha dentro de cada card, acima do botão. Controlada pelo planos.json
  // (mode.footnote). Sem o campo footnote no modo ativo, nada é exibido.
  function applyFootnote(mode) {
    const mc = modesConfig.find(m => m && String(m.id) === String(mode)) || {};
    const footnote = typeof mc.footnote === "string" ? mc.footnote : "";
    allCards.forEach(card => {
      const fn = ensureFootnote(card);
      if (!fn) return;
      fn.textContent = footnote;
      fn.style.display = footnote ? "" : "none";
    });
  }

  function ensureFootnote(card) {
    let fn = card.querySelector(".js-plan-footnote");
    if (fn) return fn;
    fn = document.createElement("p");
    fn.className = "js-plan-footnote";
    fn.style.cssText = "font-size:11px;line-height:1.35;color:#fff;opacity:.7;text-align:center;margin:14px 0 8px;padding:0 8px;";
    const btn = card.querySelector(".js-checkout") || card.querySelector(".z7-btnx");
    if (btn && btn.parentNode) {
      btn.parentNode.insertBefore(fn, btn);
    } else {
      card.appendChild(fn);
    }
    return fn;
  }

  function escapeHTML(s) {
    return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }

  function withCurrentQueryParams(href) {
    const params = window.location.search.substring(1);
    if (!params) return href;

    return href + (href.includes("?") ? "&" : "?") + params;
  }

  // inicia no modo padrão
  return init().catch(console.error);
}
