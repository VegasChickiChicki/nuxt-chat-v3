export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: {
    enabled: true
  },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module',
    'nuxt-icons'
  ],
  css: [
    '@/assets/styles/main.scss',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/vars/colors.scss" as *;
          `
        }
      }
    }
  },
})
