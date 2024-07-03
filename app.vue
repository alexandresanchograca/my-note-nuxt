<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">

const router = useRouter()
const route = useRoute()
const nuxtApp = useNuxtApp()
const user = useCurrentUser()


// Checking if user is authed
// OnMounted hooks only get called on client
onMounted(() => {
  watch(user, (user, prevUser) => {
    // console.log("Watch user", user);
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