<script setup lang="ts">
import { useLinks } from "~~/composables/useLinks";
import { useRoute } from "vue-router";
import { FormKitNode } from "@formkit/core"
import { Link } from "~~/types";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const { find, link, update } = useLinks()

const shortLink = route.params.id as string;

onMounted(async () => {
  try {
    await find(shortLink);
  } catch (error) {
    console.error("Error inicial:", error);
  }
});

async function handleUpdate(payload:Partial<Link>, node?:FormKitNode){
  try{
    await update(shortLink, payload)
    navigateTo("/links")
  }catch(err){
    handleInvalidForm(err, node)
  }
}
onMounted(async () => {
  await find(shortLink);
});
</script>
<template>
  <h1>Update Link</h1>
  <GoBack>or go back to links</GoBack>

  <FormKit type="form" submit-label="Update Link" :value="link" @submit="handleUpdate">
    <FormKit type="text" name="short_link" label="Short Link" v-model="link.short_link" />
    <FormKit type="url" name="full_link" label="Full Link" v-model="link.full_link"/>
  </FormKit>
</template>
