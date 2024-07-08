import {cert, getApp, initializeApp} from "firebase-admin/app";

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

export default createFirebaseApp;
