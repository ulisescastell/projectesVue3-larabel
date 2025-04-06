<script setup lang="ts">
import { useLinks } from "~~/composables/useLinks";
import { useRoute } from "vue-router";
import { FormKitNode } from "@formkit/core";
import { Link } from "~~/types";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const shortLink = route.params.id as string;

const { find, link, update } = useLinks();

const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    await find(shortLink);
  } catch (err) {
    console.error("Error al cargar el enlace:", err);
    error.value = "No s'ha pogut carregar l'enllaç";
  } finally {
    loading.value = false;
  }
});

async function submitUpdate(payload: Partial<Link>, node?: FormKitNode) {
  try {
    await update(shortLink, payload);
    navigateTo("/links");
  } catch (err) {
    console.error("Error al actualitzar:", err);
    node?.setErrors(["Hi ha hagut un error en actualitzar."]);
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-2">Update Link</h1>
    <GoBack>Or go back to links</GoBack>

    <div v-if="loading" class="text-center mt-6">Loading link...</div>

    <div v-else-if="error" class="text-red-600 mt-6">{{ error }}</div>

    <FormKit
      v-else
      type="form"
      submit-label="Update Link"
      :value="link"
      @submit="submitUpdate"
      class="max-w-xl mt-6"
    >
      <FormKit
        type="text"
        name="short_link"
        label="Short Link"
        validation="required"
        v-model="link.short_link"
      />
      <FormKit
        type="url"
        name="full_link"
        label="Full Link"
        validation="required|url"
        v-model="link.full_link"
      />
    </FormKit>
  </div>
</template>
