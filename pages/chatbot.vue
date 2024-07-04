<template>
  <div class="chatbot">
    <ChatbotWindow :messages="messages"/>
    <NewChatForm @userSubmit="handleSubmit" :pendingResponse="isPending"/>
  </div>
</template>

<script setup>
import useNoteAgent from "@/composables/useAI.js";
import useAIActions from "@/composables/useActions";

import {marked} from "marked";
import prism from "prismjs";

// Add numbering to the Code blocks
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/toolbar/prism-toolbar.js"; // required for the following plugins
import "prismjs/plugins/toolbar/prism-toolbar.css"; // required for the following plugins
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js"; // show copy button
import "prismjs/plugins/show-language/prism-show-language.js";

const messages = ref([]);
const app = useFirebaseApp();
const db = useFirestore();
const user = useCurrentUser();

const {ask, error, isPending} = useNoteAgent(user, db, app, true);
const {executeAction} = useAIActions(user, db);

marked.use({
  highlight: (code, lang) => {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

onMounted(() => {
  const message = "Hi!, How can I help you today";
  const formattedMessage = marked.parse(message);
  prism.highlightAll();

  messages.value.push({
    user: "Note Agent",
    created: Date.now(),
    message: formattedMessage,
  });
});

const handleSubmit = async (userMessage) => {
  messages.value.push(userMessage);

  const message = await ask(userMessage.rawInput);

  if (error.value) {
    return;
  }

  //Checking if a actions is triggered or not
  const actionResult = await executeAction(message);

  if (actionResult) {
    message.message = actionResult;
    messages.value.push(message);
    return;
  }

  const formattedAgentMessage = marked.parse(message.message);
  prism.highlightAll();

  message.message = formattedAgentMessage;

  messages.value.push(message);
};
</script>

<style scoped>
.chatbot {
  margin: 5px;
}
</style>
