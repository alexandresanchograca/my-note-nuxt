<template>
  <div class="navbar">
    <nav>
      <h1>
        <NuxtLink :to="{ name: 'index' }">My-Note</NuxtLink>
        <Button v-if="isDark" label="Light Mode" @click="toggleColorScheme()"/>
        <Button v-if="!isDark" label="Dark Mode" @click="toggleColorScheme()"/>
      </h1>
      <div class="links">
        <div v-if="user">
          <NuxtLink :to="{ name: 'index' }">Forever Note</NuxtLink>
          <NuxtLink :to="{ name: 'index' }">Daily Notes</NuxtLink>
          <NuxtLink :to="{ name: 'index' }">Note List</NuxtLink>
          <NuxtLink :to="{ name: 'index' }">Search Notes</NuxtLink>
          <NuxtLink :to="{ name: 'index' }">Help</NuxtLink>
          <span class="user-status">Logged in {{ user.email }}</span>
          <button @click="handleLogout">Logout</button>
        </div>
        <div v-else>
          <NuxtLink class="btn" :to="{ name: 'signup' }">Signup</NuxtLink>
          <NuxtLink class="btn" :to="{ name: 'login' }">Login</NuxtLink>
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
