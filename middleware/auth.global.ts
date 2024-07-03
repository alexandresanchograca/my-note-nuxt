import {getCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const {$hasSession, $isServerVerification} = useNuxtApp();

    let user = null;
    if (!$isServerVerification) {
        user = await getCurrentUser()
    }

    // redirect the user to the login page
    if (!user && !$hasSession && to.path !== "/login" && to.path !== "/signup") {
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        })
    }
})