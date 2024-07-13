import {cert, getApp, initializeApp, ServiceAccount} from "firebase-admin/app";

const getFirebaseAdminCredentials = async (): Promise<any> => {
    try {
        return JSON.parse(atob(process.env.ADMIN_CREDS));
    } catch (err) {
        console.log("error:", err);
    }
}
const createFirebaseApp = async () => {
    try {
        return getApp();
    } catch {
        const firebaseCreds = await getFirebaseAdminCredentials();
        const credential = cert({
            projectId: firebaseCreds.project_id,
            clientEmail: firebaseCreds.client_email,
            privateKey: firebaseCreds.private_key.replace(/\\n/g, '\n'),
        })
        return initializeApp({credential});
    }
};

export default createFirebaseApp;
