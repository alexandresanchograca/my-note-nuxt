<template>
  <div v-if="noteId">
    <NoteItem :noteId="noteId"></NoteItem>
  </div>
</template>

<script setup>
const route = useRoute();
const {noteId} = route.params;
</script>

<style></style>
