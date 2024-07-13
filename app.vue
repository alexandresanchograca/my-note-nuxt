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
  const dbAuth: DBAuth = {
    fbDb: useFirestore(),
    fbAuth: useFirebaseAuth(),
    db: useSupabaseClient(),
    auth: useSupabaseClient().auth,
  }

  const dbConnection = useState<DBAuth>("dbConnection", () => dbAuth);
  const user = useCurrentUser()

  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out
      router.push('/login')
    } else if (user && typeof route.query.redirect === 'string') {
      // user logged in
      router.push(route.query.redirect)
    }
  })
})
</script>

<style>
</style>