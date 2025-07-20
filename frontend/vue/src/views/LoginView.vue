<script setup lang="ts">
import {login, loginCb} from "@/security/oidcClient.ts";

const handleLogin = () => {
  console.log('handleLogin')
  login()
}
</script>

<template>
  <button @click="handleLogin">Login</button>
</template>

<style scoped>

</style>