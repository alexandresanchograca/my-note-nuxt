import {initializeApp, getApp} from "firebase-admin/app";
import admin from "firebase-admin";

const createFirebaseApp = () => {
    const config = useRuntimeConfig();
    try {
        return getApp();
    } catch {
        return initializeApp();
    }
};

export default defineNuxtPlugin(async () => {
    const app = createFirebaseApp();
    const nuxtApp = useNuxtApp();
    const userCookie = useRequestHeaders().cookie;

    try {
        const sessionCookie = userCookie?.substring("__session=".length);

        // User has no session
        if (!sessionCookie) {
            return;
        }

        const hasSession = await admin.auth().verifySessionCookie(sessionCookie);

        nuxtApp.provide("hasSession", hasSession);
    } catch (err) {
        console.error(err);
    }
});