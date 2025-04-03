<script setup lang="ts">
import axios from 'axios';
import { nanoid } from 'nanoid';
import { LoginPayload } from "@/types";
import { FormKitNode } from "@formkit/core";

definePageMeta({
  middleware: ["auth"],
});

async function createLink(payload: LoginPayload, node?: FormKitNode) {
  try {
    await axios.post("/links", {
      ...payload,
      short_link: nanoid(8)
    })
    await refreshNuxtData();
    navigateTo("/links");
  } catch (err) {
    handleInvalidForm(err, node);
  }
}
</script>
<template>
  <h1>Create New Link</h1>
  <GoBack>or go back to links</GoBack>

  <FormKit type="form" submit-label="Create Link" @submit="createLink">
    <FormKit label="Link" type="url" name="full_link" />
  </FormKit>
</template>
