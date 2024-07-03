<template>
  <div class="navbar">
    <nav>
      <h1>
        <NuxtLink :to="{ name: 'index' }">My-Note</NuxtLink>
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

const handleLogout = async () => {
  const res = await logout(auth);

  if (error.value) {
    return;
  }

  router.push({name: "login"});
};
</script>

<style scoped>
</style>
