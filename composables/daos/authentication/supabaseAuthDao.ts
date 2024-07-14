import {ref} from "vue";


const error = ref(null);
const isPending = ref(false);

const login = async (email: string, password: string): Promise<UserCreds | undefined> => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;
    isPending.value = true;

    try {
        const {data, error} = await auth.signInWithPassword({
            email,
            password,
        })

        if (!data.session) {
            throw new Error("Couldn't sign in...");
        }

        return {
            uid: data.user.id,
            email: data.user.email,
        };
    } catch (err) {
        console.log(err);
    } finally {
        isPending.value = false;
    }
}

const signup = async (email: string, password: string) => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;
    isPending.value = true;

    try {

        const {data, error} = await auth.signUp({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            uid: data.user.id,
            email: data.user.email,
        };
    } catch (err) {
        error.value = err.message;
        console.log(err);
    } finally {
        isPending.value = false;
    }
};

const logout = async () => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;

    try {
        isPending.value = true;
        const {error} = await auth.signOut();

        if (error) {
            throw new Error(error.message);
        }
    } catch (err) {
        error.value = err.message;
        console.log(err);
    } finally {
        isPending.value = false;
    }
};

const useSupabaseAuthDao = (): AuthDao => {
    return {error, isPending, login, signup, logout};
};

export default useSupabaseAuthDao;
