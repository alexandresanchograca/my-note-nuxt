// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    nitro: {
        preset: 'firebase',
        firebase: {
            gen: 2.
        },
    },
    modules: ['nuxt-vuefire', "@nuxtjs/supabase"],
    vuefire: {
        auth: {
            enabled: true,
            sessionCookie: false,
        },
        config: {
            apiKey: "AIzaSyDT8G6-tLNkusP1UpAe8Ix5rqE_7Yjb4Ok",
            authDomain: "my-notes-app-224e4.firebaseapp.com",
            projectId: "my-notes-app-224e4",
            storageBucket: "my-notes-app-224e4.appspot.com",
            messagingSenderId: "447538367879",
            appId: "1:447538367879:web:ea462636db079dc6585722"
        },
    },
    supabase: {
        // Options
    },
    app: {
        head: {
            title: "My Note",
            script: [
                {
                    src: "https://kit.fontawesome.com/3210827b43.js",
                    crossorigin: "anonymous",
                    defer: true,
                },
            ],
        },
    },
    css: [
        "@/assets/css/global.css",
        'v-calendar/style.css'
    ],
    compatibilityDate: "2024-07-03",
})