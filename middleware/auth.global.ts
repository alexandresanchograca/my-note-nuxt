import {getCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
    //No need to auth on this paths
    if (to.path === "/login" || to.path === "/signup") {
        return;
    }

    const userState = useState('userState', () => null);

    try {
        const {data: hasAccess} = await useFetch("/api/v1/auth", {
            headers: useRequestHeaders(["cookie"]),
        });

        if (!hasAccess.value) {
            throw new Error("Server: User not authenticated");
        }

        //Defining our user
        userState.value = hasAccess;
    } catch (err) {
        console.log("Error: ", err.message);
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath,
            },
        });
    }
});