import {cert, getApp, initializeApp} from "firebase-admin/app";
import admin from "firebase-admin";

const createFirebaseApp = () => {
    const config = useRuntimeConfig();
    try {
        return getApp();
    } catch {
        const credential = cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        })
        return initializeApp({credential});
    }
};

export default defineEventHandler(async (event) => {
    const app = createFirebaseApp();
    const userCookie = event.headers.get("cookie");

    try {

        const sessionCookie = userCookie?.substring("__session=".length);

        // User has no session
        if (!sessionCookie) {
            throw new Error(
                "Authentication failed. Please check that you are sending the user cookies to process client authentication."
            );
        }

        const hasSession = await admin.auth().verifySessionCookie(sessionCookie);

        if (!hasSession) {
            throw new Error("User cookie is not valid.");
        }

        return hasSession;
    } catch (err) {
        console.log(err.message);
        setResponseStatus(event, 401);
        return err.message;
    }
});