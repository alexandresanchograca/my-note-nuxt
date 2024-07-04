import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import {ref, watchEffect} from "vue";

const useDoc = (db, collectionName, subCollectionName) => {
    const error = ref("");
    const isPending = ref(false);

    const getDocumentRealtime = (documentId, timestamp) => {
        error.value = "";
        const document = ref(null);

        //TODO organize this better, (function overloading?)
        let collectionPath = collectionName;
        let documentName = documentId;
        if (subCollectionName && timestamp) {
            collectionPath = `${collectionName}/${documentId}/${subCollectionName}`;
            documentName = timestamp;
        }

        const docRef = doc(db, collectionPath, documentName);

        const unsub = onSnapshot(docRef, (doc) => {
            document.value = doc.data();
        });

        watchEffect((onInvalidate) => {
            onInvalidate(() => unsub());
        });

        return {document};
    };

    const getDocument = async (documentId, timestamp) => {
        error.value = "";
        isPending.value = true;

        try {
            //TODO organize this better, (function overloading?)
            let collectionPath = collectionName;
            let documentName = documentId;
            if (subCollectionName && timestamp) {
                collectionPath = `${collectionName}/${documentId}/${subCollectionName}`;
                documentName = timestamp;
            }

            const docRef = doc(db, collectionPath, documentName);
            return await getDoc(docRef);
        } catch (err) {
            error.value = "Couldn't retrieve note, try again later...";
        } finally {
            isPending.value = false;
        }
    };

    const addDocument = async (documentData) => {
        error.value = "";
        isPending.value = true;

        try {
            return await addDoc(collection(db, collectionName), documentData);
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    const setDocument = async (documentId, documentData, timestamp) => {
        error.value = "";
        isPending.value = true;

        try {
            let collectionPath = collectionName;
            let documentName = documentId;

            if (subCollectionName && timestamp) {
                collectionPath = `${collectionName}/${documentId}/${subCollectionName}`;
                documentName = timestamp;
            }

            const docRef = doc(db, collectionPath, documentName);
            return await setDoc(docRef, documentData);
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };
    const deleteDocument = async (documentId, timestamp) => {
        error.value = "";
        isPending.value = true;

        try {
            let collectionPath = collectionName;
            let documentName = documentId;
            if (subCollectionName && timestamp) {
                collectionPath = `${collectionName}/${documentId}/${subCollectionName}`;
                documentName = timestamp;
            }

            const docRef = doc(db, collectionPath, documentName);
            return await deleteDoc(docRef);
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    const updateDocument = async (documentId, documentData) => {
        error.value = "";
        isPending.value = true;

        try {
            const docRef = doc(db, collectionName, documentId);
            return await updateDoc(docRef, documentData);
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        getDocument,
        getDocumentRealtime,
        addDocument,
        setDocument,
        deleteDocument,
        updateDocument,
        error,
        isPending,
    };
};

export default useDoc;
