<template>
  <form @submit.prevent="">
    <h4 v-if="!isNoteSaved" class="saved-status">Unsaved note</h4>
    <div class="note-header">
      <label>Daily note:</label>
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
</template>

<script setup>
import useDatabaseDao from "~/composables/daos/database/databaseDao.ts";

const props = defineProps(["selectedDate", "wasViewClicked"]);
const note = ref("");
const fontSize = ref(16);
const isNoteSaved = ref(true);
const isNewlyLoadedNote = ref(true);
const isDocChanged = ref(false);
const router = useRouter();


let find, saveOrUpdate, remove, error, isPending;
onMounted(async () => {
  ({find, saveOrUpdate, remove, error, isPending} = useDatabaseDao().daily);

  watch(props, handlePropsChange);

  const unWatch = watch(note, () => {
    if (!isNewlyLoadedNote.value && !isDocChanged.value) {
      isNoteSaved.value = false;
    } else {
      isNewlyLoadedNote.value = false;
      isDocChanged.value = false;
    }
  });
});


const handleSubmit = async () => {
  if (!note.value) {
    await remove(props.selectedDate);

    if (error.value) {
      return;
    }

    isNoteSaved.value = true;
  } else {

    let savedNote = {
      title: props.selectedDate,
      payload: note.value,
      modifiedAt: new Date()
    };

    await saveOrUpdate(props.selectedDate, savedNote);

    if (error.value) {
      return;
    }

    isNoteSaved.value = true;
  }
};

const handleGetDoc = async () => {
  const doc = await find(props.selectedDate);

  console.log("DailyNote: ", doc);

  if (doc) {
    note.value = doc.payload;
  } else {
    note.value = "";
  }

  isNewlyLoadedNote.value = true;
  isNoteSaved.value = true;
};

const handleView = async () => {
  await handleSubmit();
  router.push({name: "viewer", state: {payload: note.value}});
};

const handlePropsChange = () => {
  if (props.wasViewClicked) {
    handleView();
  } else {
    handleGetDoc();
  }
};

const increaseFontSize = () => {
  fontSize.value++;
}
const decreaseFontSize = () => {
  fontSize.value--;
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  margin: 5px;
}

form > textarea {
  flex-basis: 70vh;
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
