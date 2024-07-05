<template>
  <div class="navbar">
    <nav>
      <h1>
        <NuxtLink :to="{ name: 'index' }">My-Note</NuxtLink>
        <button v-if="isDark" label="Light Mode" @click="toggleColorScheme()"><i class="fa-regular fa-sun"></i></button>
        <button v-if="!isDark" label="Dark Mode" @click="toggleColorScheme()"><i class="fa-regular fa-moon"></i>
        </button>
      </h1>
      <div class="links">
        <div v-if="user">
          <NuxtLink :to="{ name: 'index' }">Forever Note</NuxtLink>
          <NuxtLink :to="{ name: 'daily' }">Daily Notes</NuxtLink>
          <NuxtLink :to="{ name: 'note-list' }">Note List</NuxtLink>
          <NuxtLink :to="{ name: 'search' }">Search Notes</NuxtLink>
          <NuxtLink :to="{ name: 'chatbot' }">Help</NuxtLink>
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
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)');
});

const toggleColorScheme = () => {
  const element = document.querySelector(':root');
  element.style.colorScheme = isDark.value ? 'light' : 'dark';
  isDark.value = !isDark.value;
}
</script>

<style scoped>
.navbar {
  padding: 16px 10px;
  margin: 5px;
  background: var(--widget-colors);
  border-radius: 8px;
}

nav {
  display: flex;
  align-items: center;
  margin: 0 auto;
}

nav h1 {
  margin-left: 20px;
  white-space: nowrap;
}

nav .links {
  margin-left: auto;
}

nav .links a,
button {
  margin-left: 16px;
  font-size: 14px;
}

nav img {
  max-height: 60px;
}

span {
  font-size: 14px;
  display: inline-block;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid #eee;
}

@media only screen and (max-width: 600px) {
  .user-status {
    display: none;
  }
}
</style>

