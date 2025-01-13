<script setup lang="ts">
import {environment} from "@/environment/environment.ts";
import {type Ref, ref} from "vue";

const cu: Ref<any> = ref(null)
fetch(environment.apiUrl + '/user/current').then(r => {
  console.log(r)
  cu.value = r
})

</script>

<template>
  HOME
  {{ cu }}
</template>
