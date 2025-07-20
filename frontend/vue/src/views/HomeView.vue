<script setup lang="ts">
import {environment} from "@/environment/environment.ts";
import {type Ref, ref} from "vue";
import {user} from "@/security/oidcClient.ts";
const cu: Ref<any> = ref(null)
fetch(environment.apiUrl + '/user/current', {
  headers: {
    'Authorization': 'Bearer ' + user.value?.access_token
  }
}).then(async (r) => {
  cu.value = await r.json()
})

</script>

<template>
  HOME
  {{ cu }}
</template>
