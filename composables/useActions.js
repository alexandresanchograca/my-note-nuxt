import useDoc from "@/composables/useDoc";
import {Timestamp} from "@firebase/firestore";

async function createNote(user, db, response) {
    const notePrefix = "Creating note: Title - ";

    //Can move this to the useAIActions
    const {addDocument, error} = useDoc(db, "shared-notes");

    const noteDetails = response.message
        .slice(notePrefix.length)
        .split(", Content - ");
    const noteTitle = noteDetails[0].trim();
    let noteContent = "";

    if (noteDetails.length === 2) {
        noteContent = noteDetails[1].trim();
    }

    const note = {
        title: noteTitle,
        payload: noteContent,
        owner: user.value.email,
        users: [],
        modifiedAt: Timestamp.fromDate(new Date()),
    };

    const resp = await addDocument(note);

    if (error.value) {
        return;
    }

    return `<p>Note created sucessfully: 
    <a class="btn widget-btn" href="/note/${resp.id}">Check Note</a> 
    </p>`;
}

function useAIActions(user, db) {
    async function executeAction(response) {
        if (response.message.startsWith("Creating note: Title - ")) {
            return await createNote(user, db, response);
        }
    }

    return {
        executeAction,
    };
}

export default useAIActions;
