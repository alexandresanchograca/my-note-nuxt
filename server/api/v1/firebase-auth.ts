import admin from "firebase-admin";
import createFirebaseApp from "~/server/utils/firebaseApp";
import {DecodedIdToken} from "firebase-admin/auth";


export default defineEventHandler(async (event): Promise<UserCreds> => {
    const app = await createFirebaseApp();
    const userCookie = event.headers.get("cookie");

    try {
        const sessionCookie = userCookie?.substring("__session=".length);
        // User has no session
        if (!sessionCookie) {
            throw new Error(
                "Authentication failed. Please check that you are sending the user cookies to process client authentication."
            );
        }

        const hasSession: DecodedIdToken = await admin.auth().verifySessionCookie(sessionCookie);

        if (!hasSession) {
            throw new Error("User cookie is not valid.");
        }

        return {
            uid: hasSession.uid,
            email: hasSession.email,
        };
    } catch (err) {
        console.log(err.message);
        setResponseStatus(event, 401);
        return err.message;
    }
});