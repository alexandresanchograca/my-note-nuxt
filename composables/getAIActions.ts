import useDatabaseDao from "~/composables/daos/database/databaseDao";
import {Timestamp} from "@firebase/firestore";

const createNote = async (user, response) => {
    const {save, error, isPending} = useDatabaseDao()?.note;

    console.log("Executing action...", save, response);

    const notePrefix = "Creating note: Title - ";
    const noteDetails = response.message
        .slice(notePrefix.length)
        .split(", Content - ");
    const noteTitle = noteDetails[0].trim();
    let noteContent = "";

    if (noteDetails.length === 2) {
        noteContent = noteDetails[1].trim();
    }

    const note: Note = {
        title: noteTitle,
        payload: noteContent,
        owner: user.value.email,
        users: [],
        modifiedAt: (new Date()),
    };


    const res = await save(note);

    console.log("Action response: ", res);

    if (error.value) {
        return;
    }

    return `<p>Note created sucessfully: 
    <a class="btn widget-btn" href="/note/${res.id}">Check Note</a> 
    </p>`;
}

const getAIActions = () => {
    const user = useState("userDetails");

    async function executeAction(response) {
        if (response.message.startsWith("Creating note: Title - ")) {
            return await createNote(user, response);
        }
    }

    return {
        executeAction,
    }
}

export default getAIActions;