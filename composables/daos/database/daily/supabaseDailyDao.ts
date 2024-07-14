import {ref} from "vue";

const supabaseDailyNote = () => {
    //Assigning db
    const {db} = useState<DBAuth>("dbConnection").value;

    //Instance related variables
    const collectionName = "daily_notes";
    const error = ref("");
    const isPending = ref(false);

    const find = async (id: number) => {
        error.value = "";
        isPending.value = true;

        try {
            const {data: note, error: fetchError} = await db
                .from(collectionName)
                .select('*')
                .eq("title", id)
                .single();

            if (fetchError) {
                throw fetchError;
            }

            return note;
        } catch (err) {
            console.error(err);
            error.value = "Couldn't retrieve note, try again later...";
        } finally {
            isPending.value = false;
        }
    };

    const findAll = async () => {
        error.value = "";
        isPending.value = true;

        try {
            const {data: notes, error: fetchError} = await db
                .from(collectionName)
                .select('*');

            if (fetchError) {
                throw fetchError;
            }

            return notes;
        } catch (err) {
            console.error(err);
            error.value = "Couldn't retrieve note, try again later...";
        } finally {
            isPending.value = false;
        }
    }

    const saveOrUpdate = async (id: string, content: PersistentNote) => {
        error.value = "";
        isPending.value = true;

        try {
            let result;
            if (id) {
                // Update existing note
                result = await db
                    .from(collectionName)
                    .update(content)
                    .eq('title', id);
            } else {
                // Insert new note
                result = await db
                    .from(collectionName)
                    .insert(content);
            }

            const {data, error: upsertError} = result;

            if (upsertError) {
                throw upsertError;
            }

            return data;
        } catch (err) {
            console.error(err);
            error.value = "Couldn't save or update note, try again later...";
        } finally {
            isPending.value = false;
        }
    };

    const remove = async (id: string) => {
        error.value = "";
        isPending.value = true;

        try {
            const {data, error: deleteError} = await db
                .from(collectionName)
                .delete()
                .eq('title', id);

            if (deleteError) {
                throw deleteError;
            }

            return data;
        } catch (err) {
            console.error(err);
            error.value = "Couldn't delete note, try again later...";
        } finally {
            isPending.value = false;
        }
    };


    return {
        find,
        findAll,
        saveOrUpdate,
        remove,
        error,
        isPending,
    };
};

export default supabaseDailyNote;
