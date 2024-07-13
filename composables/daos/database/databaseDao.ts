import supabasePersistentDao from "~/composables/daos/database/persistent/supabasePersistentDao";

const useDatabaseDao = (): DatabaseDao => {
    const {databaseOption} = useRuntimeConfig().public;

    let db: DatabaseDao = null;
    switch (databaseOption) {
        case "firebase":
            break;
        case "supabase":
            db = {
                persistent: supabasePersistentDao(),
                daily: null,
                note: null
            }
            break;
        default:
            break;
    }

    return db;
}

export default useDatabaseDao;
