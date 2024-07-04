<template>
  <div class="chat-window">
    <div v-if="messages" class="messages" ref="messagesDiv">
      <div v-for="message in messages" :key="message.created" class="single">
        <span class="name">{{ message.user }}: </span>
        <span class="message language-markup" v-html="message.message"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["messages"]);
const messagesDiv = ref("");

onUpdated(() => {
  if (messagesDiv.value) {
    messagesDiv.value.scrollTop = messagesDiv.value.scrollHeight;
  }
});
</script>

<style scoped>
.chat-window {
  background-color: var(--widget-colors);
  box-sizing: border-box;
  border: 1px solid var(--secondary);
  border-bottom: 0px;
  border-radius: 8px 8px 0px 0px;
  padding: 30px 20px;
}

.single {
  display: flex;
  flex-direction: column;
  background-color: var(--secondary);
  margin: 5px;
  gap: 10px;
  border-radius: 8px;
  padding: 12px;
}

.name {
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 8px;
  background-color: var(--widget-pill-background);
  font-weight: bold;
  margin-right: 6px;
}

.messages {
  max-height: 400px;
  overflow: auto;
}
</style>
