import {cert, getApp, initializeApp, ServiceAccount} from "firebase-admin/app";
// import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
//
// const getFirebaseAdminCredentials = async (): Promise<any> => {
//     const secretManagerClient = new SecretManagerServiceClient();
//
//     try {
//         const request = {
//             name: 'projects/447538367879/secrets/FIREBASE_ADMIN_CREDENTIALS/versions/1'
//         }
//
//         const response = await secretManagerClient.accessSecretVersion(request);
//
//         if (response?.length) {
//             const payload = response[0].payload.data.toString();
//             return JSON.parse(atob(payload));
//         }
//     } catch (err) {
//         console.log("error:", err);
//     }
// }
const createFirebaseApp = async () => {
    try {
        return getApp();
    } catch {
        // const firebaseCreds = await getFirebaseAdminCredentials();
        // const credential = cert({
        //     projectId: firebaseCreds.project_id,
        //     clientEmail: firebaseCreds.client_email,
        //     privateKey: firebaseCreds.private_key.replace(/\\n/g, '\n'),
        // })
        return initializeApp();
    }
};

export default createFirebaseApp;
