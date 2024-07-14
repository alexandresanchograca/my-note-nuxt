<template>
  <div class="note">
    <button
        v-if="isOwner(note)"
        class="delete item-btn"
        @click="handleDelete(note)"
        :disabled="note.isPersistent"
    >
      <i class="fa-solid fa-trash"></i>
    </button>
    <ul v-if="note.users">
      <li v-for="user in note.users" :key="user">
        <i class="fa-solid fa-user"></i> {{ user }}
      </li>
      <li v-if="note.users.length > 3"><i class="fa-solid fa-user"></i> ...</li>
    </ul>
    <div class="note-title">
      <h3 v-if="note.title">{{ note.title }}</h3>
      <h3 v-else-if="note.isPersistent">Persistent Note</h3>
      <h3 v-else-if="note.isDaily">{{ note.id }}</h3>
    </div>
    <button class="view item-btn" @click="handleView(note)">View</button>
  </div>
</template>

<script setup>
const props = defineProps(["note"]);
const db = useFirestore();

const {deleteDocument} = useDoc(db, "shared-notes");
const {deleteDocument: deleteDaily} = useDoc(db, "notes", "daily");
const user = useState("userDetails");
const router = useRouter();

const isOwner = (note) => {
  return note.isPersistent || note.isDaily || note.owner === user.value.email;
};

const handleDelete = async (note) => {
  if (note.isDaily) {
    await deleteDaily(user.value.uid, note.id);
  } else {
    await deleteDocument(note.id);
  }
};

const handleView = (note) => {
  if (note.isPersistent) {
    router.push({name: "index"});
  } else if (note.isDaily) {
    router.push(`/daily/${note.id}`);
  } else {
    router.push(`/note/${note.id}`);
  }
};
</script>

<style scoped>
.note {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 16px 10px;
  gap: 2.8rem;
  height: 140px;
  overflow: hidden;
  background: var(--widget-background);
}

.note-title {
  overflow: hidden;
}

h3 {
  text-wrap: wrap;
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
  line-height: 1.6rem;

  @media (max-width: 600px) {
    display: none;
  }
}

li {
  font-size: 0.85rem;
  text-wrap: nowrap;
}

.fa-user {
  color: #252222;
}

.item-btn {
  height: 80%;
  flex-shrink: 0;
}

.view {
  margin: 20px;
  width: 160px;
  background-color: var(--secondary);
}

.delete {
  margin: 20px 0px;
  background-color: rgba(150, 37, 0, 0.5);
}
</style>
