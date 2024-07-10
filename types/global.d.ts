import type {Ref} from "vue";
import type {Timestamp} from "@firebase/firestore";
import type {Auth} from "@firebase/auth";
import {firestore} from "firebase-admin";

export {};

declare global {
    type Some<T> = T | null | undefined;

    type DBAuth = {
        fbAuth: Auth | null | undefined;
        fbDatabase: any;
        sbDatabase: any;
        sbAuth: any;
    }

    type BasicNote = {
        modifiedAt: Timestamp;
        payload: string;
    }

    type BasicDao = {
        db: object;
        saveOrUpdate();
        read();
        delete();
    }

    type PersistentNoteDao = {}

    type DailyNoteDao = {}

    type NoteDao = {}

    type AuthDao = {
        login(auth, email, password);
        signup(auth, email, password);
        logout(auth);
        error: Ref<any>;
        isPending: Ref<boolean>;
    }
}