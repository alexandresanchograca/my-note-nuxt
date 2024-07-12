import {ref} from "vue";


const error = ref(null);
const isPending = ref(false);

const login = async (email: string, password: string): Promise<UserCreds | undefined> => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;

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

const signup = async (): Promise<UserCreds | undefined> => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;

    return {
        uid: "",
        email: null,
    };
}

const logout = async () => {
    const dbConnection = useState<DBAuth>("dbConnection");
    const auth = dbConnection.value.auth;
}

const useSupabaseAuthDao = (): AuthDao => {
    return {error, isPending, login, signup, logout};
};

export default useSupabaseAuthDao;
