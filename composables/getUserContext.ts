import {type Ref, ref} from "vue";
import useDatabaseDao from "~/composables/daos/database/databaseDao";

const getUserContext = async () => {
    const messages: Ref<any[]> = ref([]);
    const user = useState("userDetails");
    const {persistent, daily, note} = useDatabaseDao();

    console.log("getUserContext", persistent, daily, note);

    const noteObj =
        {
            role: "user",
            content:
                "I will give you all my notes content for context. It will also include the note title so you are able to identify each note",
        };
    messages.value.push(noteObj);


    /* Getting persistent note */
    const doc = await persistent.find(user.value.uid);
    const content = "Note title: [Persistent Note]. Content: [" + doc.payload + ']';
    messages.value.push({
        role: "user", content
    });
    console.log("persistentNoteChat: ", doc);


    /* Getting note list (shared notes)*/
    const notes = await note.findAll();
    notes.forEach(note => {
        if (note.payload) {
            const content = `Note title: [${note.title}]. Content: [` + note.payload + ']';
            messages.value.push({role: "user", content});
        }
    })
    console.log("NoteChat: ", notes);

    /* Getting daily notes */
    const dailyNotes = await daily.findAll();
    dailyNotes.forEach(note => {
        if (note.payload) {
            const content = `Note title: [${note.title}]. Content: [` + note.payload + ']';
            messages.value.push({role: "user", content,});
        }
    })
    console.log("DailyChat: ", dailyNotes);

    return messages.value;
}

export default getUserContext;