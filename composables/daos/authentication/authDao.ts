import useFirebaseAuthDao from "~/composables/daos/authentication/firebaseAuthDao";
import useSupabaseAuthDao from "~/composables/daos/authentication/supabaseAuthDao";

const useAuthDao = (): AuthDao => {
    const {databaseOption} = useRuntimeConfig().public;

    let auth: AuthDao = null;
    switch (databaseOption) {
        case "firebase":
            auth = useFirebaseAuthDao();
            break;
        case "supabase":
            auth = useSupabaseAuthDao();
            break;
        default:
            break;
    }
    return auth;
}

export default useAuthDao;