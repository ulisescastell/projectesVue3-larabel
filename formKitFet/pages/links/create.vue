<script setup lang="ts">
import axios from "axios";
import { nanoid } from "nanoid";
import { LoginPayload } from "@/types";
import { FormKitNode } from "@formkit/core";

definePageMeta({
  middleware: ["auth"],
});

const isSubmitting = ref(false);

async function createLink(payload: LoginPayload, node?: FormKitNode) {
  isSubmitting.value = true;

  try {
    await axios.post("/links", {
      ...payload,
      short_link: nanoid(8),
    });

    await refreshNuxtData();
    navigateTo("/links");
  } catch (err) {
    console.error("Error al crear el enllaç:", err);
    node?.setErrors(["No s'ha pogut crear l'enllaç."]);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-2">Create New Link</h1>
    <GoBack>or go back to links</GoBack>

    <FormKit
      type="form"
      submit-label="Create Link"
      :disabled="isSubmitting"
      @submit="createLink"
      class="max-w-xl mt-6"
    >
      <FormKit
        type="url"
        name="full_link"
        label="Enllaç complet"
        validation="required|url"
        placeholder="https://example.com"
      />
    </FormKit>
  </div>
</template>
