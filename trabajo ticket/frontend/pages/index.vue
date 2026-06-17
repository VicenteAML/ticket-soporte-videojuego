<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>
