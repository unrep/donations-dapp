// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },

      meta: [],
      script: [],
    },
  },
  plugins: [],
  modules: [
    "@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
    "@nuxtjs/eslint-module", // https://nuxt.com/modules/eslint
    "@nuxtjs/tailwindcss", // https://nuxt.com/modules/tailwindcss
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Quicksand: "300..700",
        },
      },
    ],
  ],
  css: ["~/assets/css/tailwind.css", "~/assets/css/style.scss"],
  ssr: false,
  pinia: {
    storesDirs: ["./store/**"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      ipfs: {
        KEY: process.env.IPFS_KEY,
        PROOF: process.env.IPFS_PROOF,
      },
    },
  },
  appConfig: {
    walletConnectProjectID: process.env.WALLET_CONNECT_PROJECT_ID,
    contract: {
      address: process.env.FUNDRAISING_CONTRACT_ADRESS,
    },
  },
  devtools: { enabled: false },
});
