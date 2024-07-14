import userStateDao from "~/composables/daos/userStateDao";

export default defineNuxtRouteMiddleware(async (to, from) => {
    //No need to auth on this paths
    if (to.path === "/login" || to.path === "/signup") {
        return;
    }

    const userState = useState('userDetails', () => null);
    try {
        //Server-side auth check
        if (import.meta.server) {
            const hasAccess = await $fetch(`/api/v1/${useRuntimeConfig().public.databaseOption}-auth`, {
                headers: useRequestHeaders(["cookie"]),
            });

            if (!hasAccess) {
                throw new Error("Server: User not authenticated");
            }

            //Defining our user
            console.log("userCookie", hasAccess);
            userState.value = hasAccess;

        } else { //Client-side auth check
            // const user = await getCurrentUser()
            const user = userStateDao();

            const dbConnection = useState<DBAuth>("dbConnection");

            if (!dbConnection.value) {
                dbConnection.value = {
                    fbDb: useFirestore(),
                    fbAuth: useFirebaseAuth(),
                    db: useSupabaseClient(),
                    auth: useSupabaseClient().auth,
                }
            }

            if (!user) {
                throw new Error("Client: User not authenticated.");
            }

            userState.value = user;
        }
    } catch (err) {
        console.log("Error: ", err.message);
        // return navigateTo({
        //     path: '/login',
        //     query: {
        //         redirect: to.fullPath,
        //     },
        // });
    }
});