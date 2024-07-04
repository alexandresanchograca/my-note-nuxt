<template>
  <div>
    {{ dateModel }}
  </div>
</template>

<script setup lang="ts">
const dateModel = defineModel();
const route = useRoute();

const {dailyDate} = route.params;
dateModel.value = dailyDate;
</script>

<style scoped>

</style>