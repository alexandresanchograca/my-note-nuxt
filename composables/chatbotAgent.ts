import createNoteAgent from "~/agents/NoteAgent";
import {ref} from "vue";
import {useFetch} from "#app";
import getUserContext from "~/composables/getUserContext";

const chatbotAgent = (addUserNotesContext: boolean) => {
    const messages = createNoteAgent();
    const isPending = ref(false);
    const error = ref(null);

    if (addUserNotesContext) {
        getUserContext().then(userContext => {
            userContext.forEach((note) => {
                messages.value.push(note);
            })
        })
    }

    const ask = async (prompt: string): Promise<any> => {
        error.value = null;
        isPending.value = true;
        messages.value.push({role: "user", content: prompt});

        console.log("Messages: ", messages.value);

        try {

            const {data: res} = await useFetch("/api/v1/chatbot", {
                method: 'POST',
                body: {
                    messages: messages.value
                }
            })

            console.log("ChatGPT Response: ", res);

            const message = res.value.choices?.[0]?.message;

            if (message) {
                messages.value.push(message);
            }

            const messageContent = message?.content;
            const created = res.value.created;

            return {user: "Note Agent", created, message: messageContent};
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {ask, error, isPending};
}

export default chatbotAgent;