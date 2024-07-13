import {
    collection,
    deleteDoc,
    doc,
    getDoc, getDocs, or, orderBy, query,
    setDoc, where,
} from "firebase/firestore";
import {ref} from "vue";

const firebaseDailyNote = () => {
    //Assigning db
    const {fbDb: db} = useState<DBAuth>("dbConnection").value;

    //Instance related variables
    const user = useState("userDetails");
    const collectionName = "shared-notes";
    const subCollectionName = "daily";
    const error = ref("");
    const isPending = ref(false);

    const find = async (id: string) => {
        error.value = "";
        isPending.value = true;

        try {
            const collectionPath = `${collectionName}/${id}/${subCollectionName}`;
            const docRef = doc(db, collectionPath, id);
            return await getDoc(docRef);
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
            const colRef = collection(db, collectionName);

            const q = query(
                colRef,
                or(where("users", "array-contains", user.value.email), where("owner", "==", user.value.email)),
                orderBy("modifiedAt", "desc")
            );

            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => doc.data());
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    }

    const saveOrUpdate = async (id: string, content: PersistentNote) => {
        error.value = "";
        isPending.value = true;

        try {
            const collectionPath = `${collectionName}/${id}/${subCollectionName}`;
            const docRef = doc(db, collectionPath, id);
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
            const collectionPath = `${collectionName}/${id}/${subCollectionName}`;
            const docRef = doc(db, collectionPath, id);
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

export default firebaseDailyNote;