<template>
  <form @submit.prevent="handleSubmit">
    <input
        type="text"
        placeholder="Type a message...."
        v-model="userInput"
        :disabled="pendingResponse"
    />
    <button :disabled="pendingResponse">
      <i class="fa-solid fa-paper-plane"></i>
    </button>
  </form>
</template>

<script setup>
import {marked} from "marked";
import prism from "prismjs";

// Add numbering to the Code blocks
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/toolbar/prism-toolbar.js"; // required for the following plugins
import "prismjs/plugins/toolbar/prism-toolbar.css"; // required for the following plugins
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js"; // show copy button
import "prismjs/plugins/show-language/prism-show-language.js"; // display the language of the code block

const props = defineProps(["pendingResponse"]);
const emits = defineEmits(["userSubmit"]);
const userInput = ref("");

marked.use({
  highlight: (code, lang) => {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

const handleSubmit = () => {
  const userMessage = userInput.value;
  const formattedUserMessage = marked.parse(userMessage);
  prism.highlightAll();

  const message = {
    user: "You",
    created: Date.now(),
    message: formattedUserMessage,
    rawInput: userInput.value,
  };

  emits("userSubmit", message);

  userInput.value = "";
};
</script>

<style scoped>
form {
  display: flex;
  border-radius: 0px 0px 8px 8px;
}

form input {
  width: 95%;
}

form button {
  box-sizing: border-box;
  flex-grow: 1;
  margin-left: 10px;
  padding: 10px;
}
</style>
