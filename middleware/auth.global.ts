import {getCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
    //Middleware only runs on client
    if (import.meta.server) return

    const user = await getCurrentUser()

    // redirect the user to the login page
    if (!user && to.path !== "/login") {
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        })
    }
})