import {ref} from "vue";

const supabaseNote = (): BasicDao<Note> => {
    //Assigning db
    const {db} = useState<DBAuth>("dbConnection").value;

    //Instance related variables
    const user = useState("userDetails");
    const collectionName = "shared_notes";
    const error = ref("");
    const isPending = ref(false);

    const find = async (id: string): Promise<Note | undefined> => {
        error.value = "";
        isPending.value = true;

        try {
            const {data: note, error: fetchError} = await db
                .from("shared_notes")
                .select(`
                    user_id,
                    notes (
                        id,
                        title,
                        payload,
                        modifiedAt,
                        owner:profiles(
                        id,
                        email
                        )
                    )
                  `)
                .eq("note_id", id)
                .single();

            if (fetchError) {
                throw fetchError;
            }

            const massagedNote = {
                ...note?.notes,
                users: []
            }

            return massagedNote;
        } catch (err) {
            console.error(err);
            error.value = "Couldn't retrieve note, try again later...";
        } finally {
            isPending.value = false;
        }
    };

    const findAll = async (): Promise<Note[] | undefined> => {
        const dbConnection = useState<DBAuth>("dbConnection");
        const db = dbConnection.value.db;

        error.value = "";
        isPending.value = true;

        try {
            const {data: notes, error: fetchError} = await db
                .from("shared_notes")
                .select(`
                notes (
                    id,
                    title,
                    payload,
                    modifiedAt,
                    owner:profiles(
                    id,
                    email
                    )
                )
            `);

            console.log("Raw notes:", notes);

            if (fetchError) {
                throw fetchError;
            }

            const massagedNotes = notes.map((note) => ({
                ...note.notes, owner: note.notes.owner?.email
            }));

            return massagedNotes;
        } catch (err) {
            error.value = "Couldn't retrieve notes, try again later...";
            console.log(err);
        } finally {
            isPending.value = false;
        }
    };

    const save = async (note: Note): Promise<void> => {
        error.value = "";
        isPending.value = true;

        try {
            // Insert the note into the notes table first
            const {data: noteData, error: noteError} = await db
                .from("notes")
                .insert({
                    title: note.title,
                    payload: note.payload,
                    owner: user.value.uid,
                    modifiedAt: note.modifiedAt.toISOString()
                })
                .select();

            if (noteError) {
                throw noteError;
            }

            const noteId = noteData?.[0]?.note_id;

            // Insert shared users into the shared_notes table
            const sharedUsers = note.users.map(sharedUser => ({
                note_id: noteId,
                user_id: sharedUser
            }));

            console.log("sharedUsers: ", sharedUsers);

            if (sharedUsers.length > 0) {
                const {error: sharedError} = await db
                    .from("shared_notes")
                    .insert(sharedUsers);

                if (sharedError) {
                    throw sharedError;
                }
            }

            return noteData[0];
        } catch (err) {
            console.error(err);
            error.value = "Couldn't save or update note, try again later...";
        } finally {
            isPending.value = false;
        }
    }

    const saveOrUpdate = async (id: string, note: Note): Promise<void> => {
        error.value = "";
        isPending.value = true;

        try {
            let noteId = id;

            if (noteId) {
                // Update existing note
                const {data: updateData, error: updateError} = await db
                    .from("notes")
                    .update({
                        title: note.title,
                        payload: note.payload,
                        modifiedAt: note.modifiedAt.toISOString()
                    })
                    .eq("id", noteId)
                    .select();

                if (updateError) {
                    throw updateError;
                }
            } else {
                // Insert new note
                const {data: insertData, error: insertError} = await db
                    .from("notes")
                    .insert({
                        title: note.title,
                        payload: note.payload,
                        owner: user.value.uid,
                        modifiedAt: note.modifiedAt.toISOString()
                    })
                    .select();

                if (insertError) {
                    throw insertError;
                }

                noteId = insertData?.[0]?.note_id;
            }

            // Insert shared users into the shared_notes table
            const sharedUsers = note.users.map(sharedUser => ({
                note_id: noteId,
                user_id: sharedUser
            }));

            if (sharedUsers.length > 0) {
                const {error: sharedError} = await db
                    .from("shared_notes")
                    .insert(sharedUsers);

                if (sharedError) {
                    throw sharedError;
                }
            }

            return {id: noteId};
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
                .eq('note_id', id);

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
        save,
        saveOrUpdate,
        remove,
        error,
        isPending,
    };
};

export default supabaseNote;
