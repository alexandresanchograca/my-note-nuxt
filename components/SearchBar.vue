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
const db = useFirestore();
const user = useState("userState");
const searchValue = ref("");
const searchedNotes = ref([]);

/* Getting persistent note */
const {getDocumentRealtime, error: docError} = useDoc(db, "notes");
const {document: doc} = getDocumentRealtime(user.value.uid);

/* Getting note list (shared notes)*/
const {getDocuments} = useCol(db);
const {documents: notes, error} = getDocuments(
    "shared-notes",
    ["users", "array-contains", user.value.email],
    ["owner", "==", user.value.email]
);

/* Getting daily notes */
const {getSubcollectionDocuments} = useCol(db);
const {documents: dailyNotes, error: dailyError} = getSubcollectionDocuments(
    "notes",
    user.value.uid,
    "daily"
);

watch(
    notes,
    () => {
      notes.value.forEach((note) => searchedNotes.value.push(note));
    },
    {once: true}
);

watch(
    doc,
    () => {
      searchedNotes.value.push({...doc.value, isPersistent: true});
    },
    {once: true}
);

watch(
    dailyNotes,
    () => {
      dailyNotes.value.forEach((note) =>
          searchedNotes.value.push({...note, isDaily: true})
      );
    },
    {once: true}
);

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
        console.log("foud", notesCollection[i])
        tempNotes.add(notesCollection[i]);
      }
    }
  }

  return Array.from(tempNotes);
};

const handleSearch = () => {
  searchedNotes.value = searchNotes(notes.value, searchValue.value);

  searchNotes(
      [{...doc.value, isPersistent: true}],
      searchValue.value
  ).forEach((note) => searchedNotes.value.push(note));

  const searchedDailyNotes = searchNotes(dailyNotes.value, searchValue.value);

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
