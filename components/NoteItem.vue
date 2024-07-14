<template>
  <div class="note-content">
    <button @click="handleView">View in markdown</button>
    <AddUsers v-if="note" v-model="note.users"></AddUsers>
    <form @submit.prevent="">
      <h4 v-show="!isNoteSaved" class="saved-status">Unsaved note</h4>
      <div class="title-container">
        <label class="title-label">Title:</label>
        <input class="title-label" v-model="note.title" required/>
      </div>
      <div class="note-header">
        <label>Payload:</label>
        <div class="font-size-changer">
          <button class="btn" @click="increaseFontSize">+</button>
          <button class="btn" @click="decreaseFontSize">-</button>
        </div>
      </div>
      <textarea v-model="note.payload" :style="{ fontSize: fontSize + 'px' }"></textarea>
      <div v-if="error">{{ error }}</div>
      <button v-if="!isPending" @click="handleSubmit">Save</button>
      <button v-else disabled>Saving...</button>
    </form>
  </div>
</template>

<script setup>
import AddUsers from "./AddUsers.vue";
import useDatabaseDao from "~/composables/daos/database/databaseDao.ts";

const props = defineProps(["noteId"]);

const note = ref("");
const fontSize = ref(16);
const isNoteSaved = ref(true);
const router = useRouter();

const {find, saveOrUpdate, error, isPending} = useDatabaseDao().note;

const handleSubmit = async () => {
  note.value.users = note.value.users
      .filter((usr) => usr.length)
      .reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr);
        }
        return acc;
      }, []);

  let savedNote = {
    ...note.value,
    modifiedAt: new Date(),
  };

  await saveOrUpdate(props.noteId, savedNote);

  if (error.value) {
    return;
  }

  isNoteSaved.value = true;
};

const handleView = async () => {
  await handleSubmit();
  router.push({name: "viewer", state: {payload: note.value.payload}});
};

onBeforeMount(async () => {
  const noteDoc = await find(props.noteId);
  note.value = noteDoc;
  console.log(noteDoc);

  watch(
      note,
      () => {
        isNoteSaved.value = false;
      },
      {deep: true}
  );
});

const increaseFontSize = () => {
  fontSize.value++;
}
const decreaseFontSize = () => {
  fontSize.value--;
}
</script>

<style scoped>
.note-content {
  display: flex;
  flex-direction: column;
}

form {
  display: flex;
  flex-direction: column;
  margin: 5px;
}

form > textarea {
  resize: none;
  flex-basis: 45svh;
}

.note-content > button {
  margin: 5px;
}

button:disabled {
  background-color: rgb(51, 50, 50);
}

.saved-status {
  font-weight: bold;
  color: brown;
  text-align: center;
}

.title-container {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  border: 0px;
  border-bottom: 1px;
  border-color: rgb(222, 222, 220);
  border-style: dashed;
  margin-bottom: 20px;
}

.title-container input {
  font-size: 1.2rem;
}

.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0px;
  border-bottom: 1px;
  border-color: rgb(222, 222, 220);
  border-style: dashed;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.font-size-changer {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(177, 177, 177, 0.5);
  border-radius: 8px;
  padding: 5px;
  margin: 0px
}

.btn {
  margin: 0px
}
</style>
