<template>
  <div class="note-content">
    <AddUsers v-model="sharedUsers"></AddUsers>
    <form @submit.prevent="handleSubmit">
      <div class="title-container">
        <label class="title-label">Title:</label>
        <input class="title-label" v-model="note.title" required/>
      </div>
      <label class="note-label">Payload:</label>
      <textarea v-model="note.payload"></textarea>
      <div v-if="error">{{ error }}</div>
      <button v-if="!isPending">Create</button>
      <button v-else disabled>Saving...</button>
    </form>
  </div>
</template>

<script setup>
import {Timestamp} from "@firebase/firestore";

const router = useRouter();
const user = useCurrentUser();
const db = useFirestore();

const note = ref({
  title: "",
  payload: "",
  owner: user.value.email,
  users: [],
});

const sharedUsers = ref([]);

const {addDocument, error, isPending} = useDoc(db, "shared-notes");

const handleSubmit = async () => {
  note.value.users = sharedUsers.value
      .filter((usr) => usr.length)
      .reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr);
        }
        return acc;
      }, []);

  let savedNote = {
    ...note.value,
    modifiedAt: Timestamp.fromDate(new Date()),
  };

  await addDocument(savedNote);

  if (error.value) {
    return;
  }

  router.push({name: "shared"});
};
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
  flex-basis: 60svh;
}

.note-content > button {
  margin: 5px;
}

button:disabled {
  background-color: rgb(51, 50, 50);
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

.title-label {
  float: left;
}

.note-label {
  border: 0px;
  margin-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px;
  border-color: rgb(222, 222, 220);
  border-style: dashed;
}
</style>
