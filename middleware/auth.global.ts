import {getCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {$hasSession, $isServerVerification} = useNuxtApp();

    // redirect the user to the login page
    if ($isServerVerification) {
        if (!$hasSession && to.path !== "/login" && to.path !== "/signup") {
            return navigateTo({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            })
        }
    } else {
        const user = await getCurrentUser()
        if (!user && to.path !== "/login" && to.path !== "/signup") {
            return navigateTo({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            })
        }
    }
})