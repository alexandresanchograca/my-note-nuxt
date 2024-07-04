<template>
  <button @click="handleClick">Back</button>
  <div class="markdown-view">
    <div class="line-numbers language-markup" v-html="formattedContent"></div>
  </div>
</template>

//@Credits https://github.com/michaeldhead/vue32-markdown
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

const note = ref("");
const formattedContent = ref("");
const router = useRouter();

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
  if (history.state.payload) {
    note.value = history.state.payload;
    formattedContent.value = marked.parse(note.value);
    prism.highlightAll();
  }
});

const handleClick = () => {
  router.go(-1);
};
</script>

<style>
@import "prismjs/themes/prism-tomorrow.css";
</style>
