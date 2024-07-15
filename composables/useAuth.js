import {ref} from "vue";
import {
    setPersistence,
    inMemoryPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";

const error = ref(null);
const isPending = ref(false);

const login = async (auth, email, password) => {
    error.value = null;
    isPending.value = true;

    try {
        // await setPersistence(auth, inMemoryPersistence);
        const res = await signInWithEmailAndPassword(auth, email, password);

        if (!res) {
            throw new Error("Couldn't sign in...");
        }

        const idToken = await res.user.getIdToken();
        //TODO implement CSRF attack prevention

        const sessionCookie = await $fetch("/api/v1/sign-in", {
            method: "POST",
            body: {
                idToken,
            }
        })

        return res;
    } catch (err) {
        console.log(err.message);
        error.value = "Username or password are incorrect, please try again...";
    } finally {
        isPending.value = false;
    }
};

const signup = async (auth, email, password) => {
    error.value = null;
    isPending.value = true;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        if (!res) {
            throw new Error("Couldn't sign up...");
        }

        return res;
    } catch (err) {
        error.value = err.message;
    } finally {
        isPending.value = false;
    }
};

const logout = async (auth) => {
    error.value = null;
    try {
        return await $fetch("/api/v1/sign-out", {
            method: "GET",
            headers: useRequestHeaders(['cookie']),
        });
    } catch (err) {
        error.value = err.message;
    }
};

const useAuth = () => {
    return {error, isPending, login, logout, signup};
};

export default useAuth;
