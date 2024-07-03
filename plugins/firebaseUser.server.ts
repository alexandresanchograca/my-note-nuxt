import {initializeApp, cert, getApp} from "firebase-admin/app";
import admin from "firebase-admin";

const createFirebaseApp = () => {
    const config = useRuntimeConfig();
    try {
        return getApp();
    } catch {
        return initializeApp();
    }
};

export default defineNuxtPlugin(() => {
    const app = createFirebaseApp();

    addRouteMiddleware('server-auth', async (to, from) => {
        const nuxtApp = useNuxtApp();

        const userCookie = useRequestHeaders().cookie;

        try {
            const sessionCookie = userCookie?.substring("__session=".length);

            // User has no session
            if (!sessionCookie && (to.path !== "/login" || to.path !== "/signup")) {
                throw new Error("No valid session found");
            } else if (sessionCookie) {
                const hasSession = await admin.auth().verifySessionCookie(sessionCookie);

                //redirect the user to the login on the server
                if (!hasSession) {
                    throw new Error("No valid session found");
                }
            }
        } catch (err) {
            //console.error(err);
            return navigateTo({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                },
            })
        }
    }, {global: true})
});