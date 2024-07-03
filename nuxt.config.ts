// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ["nuxt-vuefire"],
    vuefire: {
        auth: {
            enabled: true,
            sessionCookie: true
        },
        config: {
            apiKey: "AIzaSyDT8G6-tLNkusP1UpAe8Ix5rqE_7Yjb4Ok",
            authDomain: "my-notes-app-224e4.firebaseapp.com",
            projectId: "my-notes-app-224e4",
            storageBucket: "my-notes-app-224e4.appspot.com",
            messagingSenderId: "447538367879",
            appId: "1:447538367879:web:ea462636db079dc6585722"
        },
    }
})