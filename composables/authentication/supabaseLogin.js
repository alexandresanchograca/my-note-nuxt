import {ref} from "vue";

const error = ref(null);
const isPending = ref(false);

const login = async (auth, email, password) => {
    error.value = null;
    isPending.value = true;
    try {
        const {data, error} = await auth.signInWithPassword({
            email,
            password,
        })

        if (!data.session) {
            throw new Error("Couldn't sign in...");
        }
        return data.session;
    } catch (err) {
        console.log(err);
    } finally {
        isPending.value = false;
    }
}

const useSupabaseAuth = () => {
    return {error, isPending, login};
};

export default useSupabaseAuth;
