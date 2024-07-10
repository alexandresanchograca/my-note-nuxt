import useFirebaseDoc from "~/composables/database/useFirebaseDoc";
import useSupabaseDoc from "~/composables/database/useSupabaseDoc";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;

const useDocF = (db: Firestore | Object, dbSb, collectionName, subCollectionName) => {

    const {
        getDocumentRealtime,
        setDocument,
        error,
        isPending,
    } = useFirebaseDoc(db, collectionName, subCollectionName);


    const {
        getDocument,
        error: sbError,
        isPending: sbPending,
    } = useSupabaseDoc(dbSb, "persistent_notes");


    const getDoc = async (user_id: string) => {
        const {document: doc} = getDocumentRealtime(user_id);
        const data = await getDocument();
        return {doc, data}
    }

    return {
        getDoc,
        isPending,
        error
    }
}

export default useDocF;