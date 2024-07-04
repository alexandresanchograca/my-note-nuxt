<template>
  <div class="navbar">
    <nav class="flex align-items-center justify-content-between mx-auto">
      <h1>
        <NuxtLink :to="{ name: 'index' }">My-Note</NuxtLink>
        <Button v-if="isDark" label="Light Mode" @click="toggleColorScheme()"/>
        <Button v-if="!isDark" label="Dark Mode" @click="toggleColorScheme()"/>
      </h1>
      <div class="flex align-items-center">
        <div v-if="user">
          <NuxtLink class="p-button" :to="{ name: 'index' }">Forever Note</NuxtLink>
          <NuxtLink class="p-button" :to="{ name: 'index' }">Daily Notes</NuxtLink>
          <NuxtLink class="p-button" :to="{ name: 'index' }">Note List</NuxtLink>
          <NuxtLink class="p-button" :to="{ name: 'index' }">Search Notes</NuxtLink>
          <NuxtLink class="p-button" :to="{ name: 'index' }">Help</NuxtLink>
          <span class="user-status">Logged in {{ user.email }}</span>
          <Button class="ml-auto" @click="handleLogout">Logout</Button>
        </div>
        <div v-else>
          <NuxtLink class="p-button p-button-outlined ml-4" :to="{ name: 'signup' }">Signup</NuxtLink>
          <NuxtLink class="p-button p-button-outlined ml-4" :to="{ name: 'login' }">Login</NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
const {error, logout} = useAuth();
const router = useRouter();
const user = useCurrentUser()
const auth = useFirebaseAuth();
const isDark = ref(true);

const handleLogout = async () => {
  const res = await logout(auth);

  if (error.value) {
    return;
  }

  router.push({name: "login"});
};


onMounted(() => {
  let isLightSystem = window.matchMedia('(prefers-color-scheme: light)');

  //Remove darkness if the system color is light
  if (isLightSystem.matches) {
    isDark.value = false;
    const element = document.querySelector('html');
    element.classList.toggle('darkness');
  }
});

const toggleColorScheme = () => {
  const element = document.querySelector('html');
  element.classList.toggle('darkness');
  isDark.value = !isDark.value;
}
</script>

<style scoped>
</style>
