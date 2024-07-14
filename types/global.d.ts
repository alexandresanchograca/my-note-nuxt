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

    type CreatedDocument = {
        id: string
    }

    type BasicDao<T> = {
        save?(content: T): CreatedDocument;
        update?(id: string, content: T);
        saveOrUpdate(id: string, content: T);
        find(id: string): Promise<T | undefined>;
        findAll?(): Promise<Array<T> | undefined>;
        remove(id: string);
        error: Ref<any>;
        isPending: Ref<boolean>;
    };

    type BasicNote = {
        modifiedAt: Date;
        payload: string;
    }

    type PersistentNote = BasicNote;

    type DailyNote = BasicNote & {
        title?: string;
    }

    type Note = BasicNote & {
        title: string;
        owner: string;
        users: Array<any>;
    }


    type AuthDao = {
        login(auth, email, password): Promise<UserCreds | undefined>;
        signup(auth, email, password): Promise<UserCreds | undefined>;
        logout(auth): Promise<void>;
        error: Ref<any>;
        isPending: Ref<boolean>;
    } | null;

    type NoteDao = BasicDao<Note> & {
        save(content: Note): CreatedDocument;
    }

    type DatabaseDao = {
        persistent: BasicDao<PersistentNote>;
        daily: BasicDao<DailyNote>;
        note: BasicDao<Note>;
    } | null;
}