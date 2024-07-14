<template>
  <div class="note-calendar">
    <ClientOnly>
      <DatePicker
          transparent
          :attributes="attrs"
          v-model="date"
          :is-required="true"
      ></DatePicker>
    </ClientOnly>
  </div>
</template>

<script setup>
import {DatePicker} from "v-calendar";
import useDatabaseDao from "~/composables/daos/database/databaseDao.ts";

const date = ref(new Date());
const attrs = ref(null);

const selectedDate = defineModel();

const {findAll, error, isPending} = useDatabaseDao().daily;

const assignSelectedDate = () => {
  selectedDate.value = date.value.toISOString().substring(0, 10);
};

const docs = await findAll();
const dates = docs.map((doc) => doc.title);

attrs.value = [
  {
    dot: true,
    dates,
  },
];

onMounted(() => {
  if (!selectedDate.value) {
    assignSelectedDate();
  } else {
    date.value = new Date(selectedDate.value);
  }

  watch(date, () => {
    assignSelectedDate();
  });
});
</script>

<style>
.note-calendar {
  margin-top: 5px;
}
</style>
