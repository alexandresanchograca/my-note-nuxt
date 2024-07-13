import type {Ref} from "vue";
import type {Timestamp} from "@firebase/firestore";
import type {Auth} from "@firebase/auth";

export {};

declare global {
    type Some<T> = T | null | undefined;

    type DBAuth = {
        auth: any;
        db: any;
        fbAuth: any;
        fbDb: any;
    }

    type UserCreds = {
        uid: string;
        email: string | null;
        username?: string | null;
    }

    type BasicDao<T> = {
        save?(id: string, content: T);
        update?(id: string, content: T);
        saveOrUpdate(id: string, content: T);
        find(id: string): Promise<T>;
        findAll?(): Array<T>;
        remove(id: string);
    }

    type BasicNote = {
        modifiedAt: Timestamp;
        payload: string;
    }

    type PersistentNote = BasicNote;

    type DailyNote = BasicNote & {
        title?: string;
    }

    type Note = BasicNote & {
        title: string;
        users: Array<any>;
    }

    type AuthDao = {
        login(auth, email, password): Promise<UserCreds | undefined>;
        signup(auth, email, password): Promise<UserCreds | undefined>;
        logout(auth): Promise<void>;
        error: Ref<any>;
        isPending: Ref<boolean>;
    } | null;

    type DatabaseDao = {
        persistent: BasicDao<PersistentNote>;
        daily: BasicDao<DailyNote>;
        note: BasicDao<Note>;
    } | null;
}