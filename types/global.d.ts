import type {Ref} from "vue";
import type {Timestamp} from "@firebase/firestore";
import type {Auth} from "@firebase/auth";

export {};

declare global {
    type Some<T> = T | null | undefined;

    type DBAuth = {
        auth: any;
        db: any;
    }

    type UserCreds = {
        uid: string;
        email: string | null;
        username?: string | null;
    }

    type BasicDao<T> = {
        saveOrUpdate();
        read(): T;
        delete();
    }

    type BasicNote = {
        modifiedAt: Timestamp;
        payload: string;
    }

    type PersistentNote = {}

    type DailyNote = {}

    type Note = {}

    type AuthDao = {
        login(auth, email, password): Promise<UserCreds | undefined>;
        signup(auth, email, password): Promise<UserCreds | undefined>;
        logout(auth): Promise<void>;
        error: Ref<any>;
        isPending: Ref<boolean>;
    } | null;
}