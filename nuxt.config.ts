// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    app: {
      baseURL: process.env.NODE_ENV === "development" ? "/" : "./",
    },
    public: {
      baseURL: process.env.NODE_ENV === "development" ? "/" : "./",
      siteName: "Nuxt + IPFS",
      siteDescription: "Exploring the synergy between Nuxt + IPFS in the MOCA Fundraiser project. Overcoming hosting challenges, achieving seamless IPFS integration. Discovering smart configurations for decentralized hosting. Experiencing IPFS hosting with the MOCA Fundraiser Collection using Nuxt.",
      language: "en",
    },
  },

  router: {
    options: {
      hashMode: process.env.NODE_ENV !== "development",
    },
  },

  css: [ "~/assets/css/main.css" ],

  modules: [
    "@nuxt/image",
  ],

  extends: [
    "nuxt-seo-kit",
  ],

  app: {
    head: {
      meta: [
        {
          charset: "utf-8",
        },
        {
          property: "og:image",
          content: "https://hackmd.io/_uploads/ByDkwvdnn.jpg",
        },
      ],
    },
  },
});
