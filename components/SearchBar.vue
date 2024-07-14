<template>
  <div id="search-notes">
    <form @submit.prevent="handleSearch" class="search-bar">
      <input placeholder="search" type="text" v-model="searchValue"/>
      <button><i class="fa-solid fa-magnifying-glass"></i></button>
    </form>
    <NotePreview
        v-for="note in searchedNotes"
        :key="note.payload"
        :note="note"
    />
  </div>
</template>

<script setup>
import useDatabaseDao from "~/composables/daos/database/databaseDao.ts";

const db = useFirestore();

const user = useState("userDetails");
const searchValue = ref("");
const searchedNotes = ref([]);

const {persistent, daily, note} = useDatabaseDao();

/* Getting persistent note */
const doc = await persistent.find(user.value.uid);
searchedNotes.value.push({...doc, isPersistent: true});
console.log("persistentNoteSearch: ", doc);


/* Getting note list (shared notes)*/
const notes = await note.findAll();
notes.forEach((note) => searchedNotes.value.push(note));
console.log("NoteSearch: ", notes);

/* Getting daily notes */
const dailyNotes = await daily.findAll();
dailyNotes.forEach((note) => searchedNotes.value.push({...note, isDaily: true}));
console.log("DailySearch: ", dailyNotes);

const searchNotes = (notesCollection, searchParams) => {
  const searchValues = searchParams.toLowerCase().split(" ");
  const tempNotes = new Set();

  //Only the loops are O(n*m)... and the includes is O(k) = O(n*m*k)
  //Using for loops as copium for this
  for (var i = 0; i < notesCollection.length; i++) {
    const noteTitle = notesCollection[i].title?.toLowerCase();
    const notePayload = notesCollection[i].payload.toLowerCase();
    for (var j = 0; j < searchValues.length; j++) {
      if (notePayload.includes(searchValues[j])) {
        tempNotes.add(notesCollection[i]);
      }

      if (noteTitle && noteTitle.includes(searchValues[j])) {
        console.log("found", notesCollection[i])
        tempNotes.add(notesCollection[i]);
      }
    }
  }

  return Array.from(tempNotes);
};

const handleSearch = () => {
  searchedNotes.value = searchNotes(notes, searchValue.value);

  searchNotes(
      [{...doc, isPersistent: true}],
      searchValue.value
  ).forEach((note) => searchedNotes.value.push(note));

  const searchedDailyNotes = searchNotes(dailyNotes, searchValue.value);

  searchedDailyNotes.forEach((note) =>
      searchedNotes.value.push({...note, isDaily: true})
  );
};
</script>

<style scoped>
#search-notes {
  display: flex;
  flex-direction: column;
  margin: 5px;
  gap: 10px;
}

.search-bar {
  display: flex;
  box-sizing: border-box;
  align-self: center;
  width: 100%;
}

.search-bar input {
  width: 95%;
}

.search-bar button {
  box-sizing: border-box;
  flex-grow: 1;
  margin-left: 10px;
  padding: 10px;
}
</style>
