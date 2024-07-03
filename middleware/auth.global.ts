import {getCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {$hasSession} = useNuxtApp();

    const user = await getCurrentUser()

    // redirect the user to the login page
    if (!user && !$hasSession && to.path !== "/login") {
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        })
    }
})