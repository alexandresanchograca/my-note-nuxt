export default defineNuxtRouteMiddleware(async (to, from) => {
    //No need to auth on this paths
    if (to.path === "/login" || to.path === "/signup") {
        return;
    }

    const {databaseOption} = useRuntimeConfig().public;
    const userState = useState('userDetails', () => null);

    try {
        //Server-side auth check
        console.log(useRequestHeaders(["cookie"]));
        const {data: hasAccess} = await useFetch(`/api/v1/${databaseOption}/auth`, {
            headers: useRequestHeaders(["cookie"]),
        });

        if (!hasAccess.value) {
            throw new Error("User not authenticated");
        }

        //Defining our user
        console.log("userData", hasAccess.value);
        userState.value = hasAccess.value;
        return;
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
