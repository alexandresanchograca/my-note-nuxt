<template>
  <div class="note-content">
    <button @click="handleView">View in markdown</button>
    <form @submit.prevent="">
      <h4 v-show="!isNoteSaved" class="saved-status">Unsaved note</h4>
      <div class="note-header">
        <label>Forever note:</label>
        <div class="font-size-changer">
          <button class="btn" @click="increaseFontSize">+</button>
          <button class="btn" @click="decreaseFontSize">-</button>
        </div>
      </div>
      <textarea v-model="note" :style="{ fontSize: fontSize + 'px' }"></textarea>
      <div v-if="error">{{ error }}</div>
      <button v-if="!isPending" @click="handleSubmit">Save</button>
      <button v-else disabled>Saving...</button>
    </form>
  </div>
</template>

<script setup>
import useDatabaseDao from "~/composables/daos/database/databaseDao.ts";

const note = ref("");
const fontSize = ref(16);
const isNoteSaved = ref(true);
const isDocChanged = ref(false);
const router = useRouter();
const user = useState("userDetails");

const {find, saveOrUpdate, error, isPending} = useDatabaseDao().persistent;

const handleSubmit = async () => {
  let savedNote = {
    payload: note.value,
    modifiedAt: new Date(),
  };

  await saveOrUpdate(user.value.uid, savedNote);

  if (error.value) {
    return;
  }

  isNoteSaved.value = true;
};

const handleView = async () => {
  await handleSubmit();
  router.push({name: "viewer", state: {payload: note.value}});
};

onBeforeMount(async () => {
  console.log("user", user);

  const doc = await find(user.value.uid);
  note.value = doc.payload;

  console.log("data: ", doc);

  watch(note, () => {
    isNoteSaved.value = false;
  });
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
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr;
  height: 90svh;
}

form {
  display: flex;
  flex-direction: column;
  margin: 5px;
}

form > textarea {
  resize: none;
  flex-basis: 100%;
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
