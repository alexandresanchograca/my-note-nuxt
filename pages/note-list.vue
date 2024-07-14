<template>
  <div v-if="notes" id="shared-notes">
    <button class="btn" @click="handleCreate">Create note</button>
    <div
        class="drop-zone"
        @drop="onDrop($event, -1)"
        @dragenter.prevent
        @dragover.prevent
    ></div>
    <div v-for="(note, index) in notes" :key="note.title">
      <NotePreview
          :note="note"
          draggable="true"
          @dragstart="startDrag($event, index)"
      ></NotePreview>
      <div
          class="drop-zone"
          @drop="onDrop($event, index)"
          @dragenter.prevent
          @dragover.prevent
      ></div>
    </div>
  </div>
</template>

<script setup>
import NotePreview from "@/components/NotePreview.vue";
import {Timestamp} from "@firebase/firestore";
import useDatabaseDao from "~/composables/daos/database/databaseDao.ts";

const db = useFirestore();
const router = useRouter();
const {updateDocument} = useDoc(db, "shared-notes");

const {find, findAll, saveOrUpdate, error, isPending} = useDatabaseDao().note;

const notes = await findAll();

console.log("note-list: ", notes);

const startDrag = (event, index) => {
  event.dataTransfer.setData("noteIndex", index);
};

const onDrop = async (event, index) => {
  const draggedNoteIndex = event.dataTransfer.getData("noteIndex");

  if (
      !notes.value ||
      draggedNoteIndex >= notes.value.length ||
      index >= notes.value.length ||
      draggedNoteIndex == index
  ) {
    return;
  }

  const grabbedNote = notes.value[draggedNoteIndex];
  const targetNote = notes.value[index];

  grabbedNote.modifiedAt.seconds = targetNote
      ? targetNote.modifiedAt.seconds - 1
      : Timestamp.fromDate(new Date()).seconds;

  await updateDocument(grabbedNote.id, {modifiedAt: grabbedNote.modifiedAt});

  const nextNote = notes.value[index + 1];
  if (nextNote) {
    nextNote.modifiedAt.seconds -= 1;
    await updateDocument(nextNote.id, {modifiedAt: nextNote.modifiedAt});
  }
};

const handleCreate = () => {
  router.push({name: "create"});
};
</script>

<style scoped>
#shared-notes {
  display: flex;
  flex-direction: column;
  margin: 5px;
}

.drop-zone {
  box-sizing: border-box;
  width: 100%;
  height: 10px;
}

.btn {
  background: var(--secondary);
  border-radius: 8px;
  margin: 0;
  border: 0;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
}
</style>
