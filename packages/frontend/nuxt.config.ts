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
          Inter: "300..700",
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
        TOKEN: process.env.IPFS_TOKEN,
      },
    },
  },
  appConfig: {
    walletConnectProjectID: process.env.WALLET_CONNECT_PROJECT_ID,
    contract: {
      address: process.env.FUNDRAISING_CONTRACT_ADRESS,
    },
  },
  vite: {
    // Make listed envs public and accessible in the runtime
    define: Object.fromEntries(
      ["FUNDRAISING_CONTRACT_ADRESS"].map((key) => [
        `process.env.${key}`,
        JSON.stringify(process.env[key]),
      ]),
    ),
  },
  devtools: { enabled: false },
});
