import admin from "firebase-admin";
import createFirebaseApp from "~/server/utils/firebaseApp";


export default defineEventHandler(async (event) => {
    const app = await createFirebaseApp();
    const body = await readBody(event);

    try {
        const idToken = body.idToken;
        const csrfToken = body.csrfToken;

        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await admin.auth().createSessionCookie(idToken, {expiresIn});

        const options = {maxAge: expiresIn, httpOnly: true, secure: true };
        setCookie(event, "__session", sessionCookie, options);

        return JSON.stringify({status: 'success'})
    } catch (err) {
        console.log(err.message);
        setResponseStatus(event, 401);
        return err.message;
    }
});
