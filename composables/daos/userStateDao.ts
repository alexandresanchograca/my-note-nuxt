const userStateDao = (): UserCreds => {
    const {databaseOption} = useRuntimeConfig().public;

    let user = null;
    switch (databaseOption) {
        case "firebase":
            user = getCurrentUser();
            break;
        case "supabase":
            user = useSupabaseUser();
            break;
        default:
            break;
    }

    console.log("userClient: ", user.value);

    return {
        uid: user.value.id,
        email: user.value.email,
    };
}

export default userStateDao;