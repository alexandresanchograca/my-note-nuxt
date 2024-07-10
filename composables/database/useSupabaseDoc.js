import {ref, watchEffect} from "vue";


const useSupabaseDoc = (db, tableName) => {
    const error = ref("");
    const isPending = ref(false);

    const getDocument = async () => {
        error.value = "";

        const {data: persistent_note, refresh: refreshCollaborators} = await useAsyncData('collaborators', async () => {
            const {data} = await db.from(tableName).select('*')
            return data
        })

        return {persistent_note};
    };

    return {
        getDocument,
        error,
        isPending,
    };
};

export default useSupabaseDoc;
