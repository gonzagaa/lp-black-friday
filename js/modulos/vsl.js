// VSL (#vsl): player leve. A capa (imagem local) só é pedida quando a seção chega a ~800 px da tela (fora da janela da
// primeira dobra, onde o loading="lazy" do Chrome ainda a baixaria); o botão de play já existe na carga.
// No clique: o preconnect para os domínios do YouTube, o iframe do youtube-nocookie com autoplay e o evento vsl_play no
// dataLayer. Nada do YouTube é pedido antes do clique.
const ID = 'beNPuHfW1UQ';
const ORIGENS = ['https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://i.ytimg.com'];

function preconectar() {
  ORIGENS.forEach((href) => {
    if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'preconnect';
    l.href = href;
    l.crossOrigin = '';
    document.head.append(l);
  });
}

export function iniciarVsl() {
  const moldura = document.querySelector('[data-vsl]');
  if (!moldura) return;
  const botao = moldura.querySelector('[data-vsl-play]');
  const capa = moldura.querySelector('.vsl__capa');
  const img = capa.querySelector('img');

  const carregarCapa = () => {
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    if (img.dataset.src) img.src = img.dataset.src;
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((e) => {
      if (!e.some((x) => x.isIntersecting)) return;
      io.disconnect();
      carregarCapa();
    }, { rootMargin: '800px 0px' });
    io.observe(moldura);
  } else carregarCapa();

  botao.addEventListener('click', () => {
    preconectar();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'vsl_play', vsl_id: ID });

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = 'Entenda o maior pacote de benefícios da história da Zero7';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    capa.replaceWith(iframe);
    iframe.focus();
  });
}
