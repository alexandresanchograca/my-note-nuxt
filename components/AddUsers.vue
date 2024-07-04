<template>
  <div class="shared-users-container">
    <button v-if="!sharedUsers.length" @click="handleShare">
      Share with user
    </button>
    <button v-else class="add-user" @click="handleShare">+ Add user</button>
    <form v-if="sharedUsers.length" @submit.prevent="">
      <!-- Todo: index shouldnt be used as a key here -->
      <div
          v-for="(user, index) in sharedUsers"
          :key="`user-${index}`"
          class="shared-user"
      >
        <label :for="`email-${index}`">User Email:</label>
        <input
            :name="`email-${index}`"
            type="email"
            v-model="sharedUsers[index]"
            :placeholder="`user_${index}@mail.com`"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
const sharedUsers = defineModel();

const handleShare = () => {
  sharedUsers.value.push("");
};
</script>

<style scoped>
.shared-users-container {
  box-sizing: border-box;
  margin: 5px;
}

.shared-user {
  display: flex;
  align-items: center;
}

button {
  margin: 0;
  width: 100%;
}

label {
  text-wrap: nowrap;
}

.add-user {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

form {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
</style>
