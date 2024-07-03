<template>
  <div class="welcome">
    <form @submit.prevent="handleSubmit">
      <h3>Login</h3>
      <input type="email" placeholder="email" v-model="email" required/>
      <input
          type="password"
          placeholder="password"
          v-model="password"
          required
      />
      <p>
        Not a user yet?
        <router-link class="welcome-alt" to="signup">Signup now!</router-link>
      </p>
      <p class="error" v-if="error">{{ error }}</p>
      <button v-if="!isPending">Login</button>
      <button v-else disabled>Logging in...</button>
    </form>
    <div></div>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const router = useRouter();
const nuxtApp = useNuxtApp()
const auth = useFirebaseAuth();

const {error, isPending, login} = useAuth();

const handleSubmit = async () => {
  const res = await login(auth, email.value, password.value);

  if (error.value) {
    console.log(error.value);
    return;
  }

  await router.push({name: "index"});
};
</script>

<style scoped>
.welcome {
  margin: 0 5px;
}

button {
  margin: 20px auto;
}

.welcome .welcome-alt {
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
</style>
