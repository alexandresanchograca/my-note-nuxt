import useSupabaseAuth from "~/composables/authentication/supabaseLogin";
import useAuth from "~/composables/useAuth";
import type {Auth} from "@firebase/auth";

const useAuthF = (fbAuth: Auth, sbAuth) => {

    const dbConnection = useState<DBAuth>("dbConnection");

    const {login: supabaseLogin, isPending, error} = useSupabaseAuth();
    const {login: firebaseLogin} = useAuth();

    const login = async (email: string, password: string) => {
        const sb = await supabaseLogin(dbConnection.value.sbAuth, email, password);
        const fb = await firebaseLogin(dbConnection.value.fbAuth, email, password);
    }

    return {
        login,
        isPending,
        error
    }
}

export default useAuthF;