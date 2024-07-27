import {ref} from "vue";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";

const error = ref(null);
const isPending = ref(false);

const login = async (email: string, password: string): Promise<UserCreds | undefined> => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.fbAuth;
    error.value = null;
    isPending.value = true;

    try {
        console.log("authlogin", dbConnection.value);
        const res = await signInWithEmailAndPassword(auth, email, password);

        if (!res) {
            throw new Error("Couldn't sign in...");
        }

        console.log("signin res:", res)

        const idToken = await res.user.getIdToken();
        //TODO implement CSRF attack prevention

        const sessionCookie = await $fetch("/api/v1/firebase/sign-in", {
            method: "POST",
            body: {
                idToken,
            }
        })

        return {
            uid: res.user.uid,
            email: res.user.email,
            username: res.user.displayName
        };
    } catch (err) {
        console.log(err.message);
        error.value = "Username or password are incorrect, please try again...";
    } finally {
        isPending.value = false;
    }
};

const signup = async (email: string, password: string): Promise<UserCreds | undefined> => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;
    error.value = null;
    isPending.value = true;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        if (!res) {
            throw new Error("Couldn't sign up...");
        }


        return {
            uid: res.user.uid,
            email: res.user.email,
            username: res.user.displayName
        };
    } catch (err) {
        error.value = err.message;
    } finally {
        isPending.value = false;
    }
};

const logout = async () => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;
    error.value = null;
    try {
        return await $fetch("/api/firebase/v1/sign-out", {
            method: "GET",
            headers: useRequestHeaders(['cookie']),
        });
    } catch (err) {
        error.value = err.message;
    }
};

const useFirebaseAuthDao = (): AuthDao => {
    return {error, isPending, login, logout, signup};
};

export default useFirebaseAuthDao;
