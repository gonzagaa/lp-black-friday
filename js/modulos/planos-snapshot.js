// GERADO por scripts/snapshot-planos.mjs a partir de data/planos.json em 2026-10-27. Não edite à mão.
// Fallback da seção de planos: usado só quando o fetch do PLANOS_URL (js/config.js) falha.
export default {
  "config": {
    "defaultMode": "reinicio",
    "hideButtonsWhenSingleMode": true,
    "modes": [
      {
        "id": "60dias",
        "label": "Planos 60 dias",
        "active": true,
        "footnote": "*Plataforma gratuita por 60 dias. Após, cobrança mensal."
      },
      {
        "id": "30dias",
        "label": "Planos 30 dias",
        "active": false
      },
      {
        "id": "reinicio",
        "label": "Planos com Reinício",
        "active": false
      }
    ]
  },
  "30dias": {
    "trainee": {
      "oldPrice": "R$ 387,00",
      "parcel": "12x R$15,48",
      "avista": "ou R$154,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/868db1",
      "maxDias": "30"
    },
    "junior": {
      "oldPrice": "R$ 527,00",
      "parcel": "12x R$21,08",
      "avista": "ou R$210,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/2ad99e",
      "maxDias": "30"
    },
    "pleno": {
      "oldPrice": "R$ 1.297,00",
      "parcel": "12x R$38,91",
      "avista": "ou R$389,10 à vista",
      "checkout": "https://app.zero7.com.br/checkout/eb9d60",
      "maxDias": "30"
    },
    "senior": {
      "oldPrice": "R$ 1.997,00",
      "parcel": "12x R$59,91",
      "avista": "ou R$599,10 à vista",
      "checkout": "https://zero7.com.br/copa-zero7/",
      "maxDias": "30"
    },
    "expert": {
      "oldPrice": "R$ 3.867,00",
      "parcel": "12x R$154,68",
      "avista": "ou R$1.546,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/da7ab3",
      "maxDias": "30"
    },
    "master": {
      "oldPrice": "R$ 4.717,00",
      "parcel": "12x R$188,68",
      "avista": "ou R$1.886,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/5ad741",
      "maxDias": "30"
    },
    "bit_trainee": {
      "oldPrice": "R$ 387,00",
      "parcel": "12x R$15,48",
      "avista": "ou R$154,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/6f46d5",
      "maxDias": "30"
    },
    "bit_junior": {
      "oldPrice": "R$ 527,00",
      "parcel": "12x R$21,08",
      "avista": "ou R$210,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/102e44",
      "maxDias": "30"
    }
  },
  "60dias": {
    "trainee": {
      "oldPrice": "R$ 627,00",
      "parcel": "12x R$12,54",
      "avista": "ou R$125,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/7abf87",
      "maxDias": "ilimitado*"
    },
    "junior": {
      "oldPrice": "R$ 917,00",
      "parcel": "12x R$18,34",
      "avista": "ou R$183,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/9c42c1",
      "maxDias": "ilimitado*"
    },
    "pleno": {
      "oldPrice": "R$ 1.837,00",
      "parcel": "12x R$36,74",
      "avista": "ou R$367,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/f1d2bb",
      "maxDias": "ilimitado*"
    },
    "senior": {
      "oldPrice": "R$ 3.047,00",
      "parcel": "12x R$60,94",
      "avista": "ou R$609,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/b01235",
      "maxDias": "ilimitado*"
    },
    "expert": {
      "oldPrice": "R$ 4.867,00",
      "parcel": "12x R$97,34",
      "avista": "ou R$973,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/e5460e",
      "maxDias": "ilimitado*"
    },
    "master": {
      "oldPrice": "R$ 5.937,00",
      "parcel": "12x R$118,74",
      "avista": "ou R$1.187,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/a44fc5",
      "maxDias": "ilimitado*"
    },
    "bit_trainee": {
      "oldPrice": "R$ 627,00",
      "parcel": "12x R$12,54",
      "avista": "ou R$125,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/f6981b",
      "maxDias": "ilimitado*"
    },
    "bit_junior": {
      "oldPrice": "R$ 917,00",
      "parcel": "12x R$18,34",
      "avista": "ou R$183,40 à vista",
      "checkout": "https://app.zero7.com.br/checkout/fb0bae",
      "maxDias": "ilimitado*"
    }
  },
  "reinicio": {
    "trainee": {
      "oldPrice": "R$ 767,00",
      "parcel": "12x R$30,68",
      "avista": "ou R$306,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/522fa1",
      "maxDias": "60 + reinício"
    },
    "junior": {
      "oldPrice": "R$ 1.027,00",
      "parcel": "12x R$41,08",
      "avista": "ou R$410,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/16fe6c",
      "maxDias": "60 + reinício"
    },
    "pleno": {
      "oldPrice": "R$ 1.997,00",
      "parcel": "12x R$59,91",
      "avista": "ou R$599,10 à vista",
      "checkout": "https://app.zero7.com.br/checkout/eb9d60",
      "maxDias": "60 + reinício"
    },
    "senior": {
      "oldPrice": "R$ 3.227,00",
      "parcel": "12x R$96,81",
      "avista": "ou R$968,10 à vista",
      "checkout": "https://zero7.com.br/copa-zero7/",
      "maxDias": "60 + reinício"
    },
    "expert": {
      "oldPrice": "R$ 4.997,00",
      "parcel": "12x R$199,88",
      "avista": "ou R$1.998,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/8f4197",
      "maxDias": "60 + reinício"
    },
    "master": {
      "oldPrice": "R$ 6.027,00",
      "parcel": "12x R$241,08",
      "avista": "ou R$2.410,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/e64380",
      "maxDias": "60 + reinício"
    },
    "bit_trainee": {
      "oldPrice": "R$ 767,00",
      "parcel": "12x R$30,68",
      "avista": "ou R$306,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/40238d",
      "maxDias": "60 + reinício"
    },
    "bit_junior": {
      "oldPrice": "R$ 1.027,00",
      "parcel": "12x R$41,08",
      "avista": "ou R$410,80 à vista",
      "checkout": "https://app.zero7.com.br/checkout/c44cad",
      "maxDias": "60 + reinício"
    }
  }
};
