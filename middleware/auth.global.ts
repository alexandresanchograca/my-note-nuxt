import {getCurrentUser} from "vuefire";
import path from "node:path";
import type {RouteLocationNormalizedGeneric} from "vue-router";

export default defineNuxtRouteMiddleware(async (to, from) => {
    //No need to auth on this paths
    if (to.path === "/login" || to.path === "/signup") {
        return;
    }

    const userState = useState('userState', () => null);

    try {
        //Server-side auth check
        if (import.meta.server) {
            const hasAccess = await $fetch("/api/auth", {
                headers: useRequestHeaders(["cookie"]),
            });

            if (!hasAccess) {
                throw new Error("Server: User not authenticated");
            }

            //Defining our user
            userState.value = hasAccess;

        } else { //Client-side auth check
            const user = await getCurrentUser()

            if (!user) {
                throw new Error("Client: User not authenticated.");
            }

            userState.value = user;
        }
    } catch (err) {
        console.log("Error: ", err.message);
        // return navigateTo({
        //     path: '/login',
        //     query: {
        //         redirect: to.fullPath,
        //     },
        // });
    }
});