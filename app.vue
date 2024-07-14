<template>
  <div>
    <NuxtLayout>
      <div class="content">
        <NuxtPage/>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const nuxtApp = useNuxtApp()


//OnMounted hooks only get called on client
// Checking if user is authed
onMounted(() => {
  const userDetails = useState<UserCreds>("userDetails", () => ({uid: "", email: ""}));
})
</script>

<style>
</style>