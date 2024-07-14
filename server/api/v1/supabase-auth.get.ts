import {serverSupabaseUser} from "#supabase/server";

export default defineEventHandler(async (event): Promise<UserCreds> => {
    const serverUser = await serverSupabaseUser(event);

    return {
        uid: serverUser.id,
        email: serverUser.email
    };
});
