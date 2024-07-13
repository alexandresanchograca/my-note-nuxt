import supabasePersistentDao from "~/composables/daos/database/persistent/supabasePersistentDao";
import firebasePersistentDao from "~/composables/daos/database/persistent/firebasePersistentDao";
import firebaseDailyDao from "~/composables/daos/database/daily/firebaseDailyDao";
import supabaseDailyDao from "~/composables/daos/database/daily/supabaseDailyDao";

const useDatabaseDao = (): DatabaseDao => {
    const {databaseOption} = useRuntimeConfig().public;

    let db: DatabaseDao = null;
    switch (databaseOption) {
        case "firebase":
            db = {
                persistent: firebasePersistentDao(),
                daily: firebaseDailyDao(),
                note: null
            }
            break;
        case "supabase":
            db = {
                persistent: supabasePersistentDao(),
                daily: supabaseDailyDao(),
                note: null
            }
            break;
        default:
            break;
    }

    return db;
}

export default useDatabaseDao;
