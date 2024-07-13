import {
    deleteDoc,
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import {ref, watchEffect} from "vue";

const firebasePersistentNote = () => {
    //Assigning db
    const {fbDb: db} = useState<DBAuth>("dbConnection").value;

    //Instance related variables
    const collectionName = "notes";
    const error = ref("");
    const isPending = ref(false);

    const find = async (id: string) => {
        error.value = "";
        isPending.value = true;

        try {
            const docRef = doc(db, collectionName, id);
            return await getDoc(docRef);
        } catch (err) {
            console.error(err);
            error.value = "Couldn't retrieve note, try again later...";
        } finally {
            isPending.value = false;
        }
    };

    const saveOrUpdate = async (id: string, content: PersistentNote) => {
        error.value = "";
        isPending.value = true;

        try {
            const docRef = doc(db, collectionName, id);
            return await setDoc(docRef, content);
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };
    const remove = async (id: string) => {
        error.value = "";
        isPending.value = true;

        try {
            const docRef = doc(db, collectionName, id);
            return await deleteDoc(docRef);
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        find,
        saveOrUpdate,
        remove,
        error,
        isPending,
    };
};

export default firebasePersistentNote;
