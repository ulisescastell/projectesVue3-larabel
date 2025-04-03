<script setup lang="ts">
import axios from "axios";
import { Link } from "~~/types";
import { ref, watch } from 'vue';
//@ts-expect-error
import { TailwindPagination } from "laravel-vue-pagination";
import { useRoute, useRouter } from "vue-router";
import TableTh from "@/components/TableTh.vue";
import { useLinks } from "~~/composables/useLinks";
import { handleError } from "vue";

const route = useRoute();
const router = useRouter();

definePageMeta({
  middleware: ["auth"],
});

const queries = ref({
  page: Number(route.query.page) || 1,
  sort: route.query.sort?.toString() || "",
  "filter[full_link]": route.query["filter[full_link]"]?.toString() || "",
  ...route.query
});

const { data, index: getLinks, destroy } = useLinks({ queries });

async function handleDelete(id: number) {
  try {
    await destroy(id);
    await getLinks();
  } catch (error) {
    console.error(error);
  }
}

watch(queries, () => {
  router.push({ query: queries.value });
  getLinks();
}, { deep: true });

watch(() => route.query, (newQuery) => {
  queries.value = { 
    page: Number(newQuery.page) || 1,
    sort: newQuery.sort?.toString() || "",
    "filter[full_link]": newQuery["filter[full_link]"]?.toString() || "",
    ...newQuery 
  };
});


onMounted(async () => {
  try {
    await getLinks();
  } catch (error) {
    console.error("Error inicial:", error);
  }
});

</script>
<template>
  <div>
    <nav class="flex justify-between mb-4 items-center">
      <h1 class="mb-0">My Links</h1>
      <div class="flex items-center">
        <SearchInput 
        v-model="queries['filter[full_link]']" placeholder="Search my URL..." />
        <NuxtLink to="/links/create" class="ml-4">
          <IconPlusCircle class="inline" /> Create New
        </NuxtLink>
      </div>
    </nav>

    <div v-if="data?.data?.length > 0">
      <table class="table-fixed w-full">
        <thead>
          <tr>
            <TableTh class="w-[35%]" name="full_link" :model-value="queries.sort">Full Link</TableTh>
            <TableTh class="w-[35%]" name="short_link" :model-value="queries.sort">Short Link</TableTh>
            <TableTh class="w-[10%]" name="views" :model-value="queries.sort">Views</TableTh>
            <TableTh class="w-[10%]" name="edit" :model-value="queries.sort">Edit</TableTh>
            <TableTh class="w-[10%]" name="trash" :model-value="queries.sort">Trash</TableTh>
            <TableTh class="w-[6%] text-center" name="refresh" :model-value="queries.sort">
              <button @click="getLinks()">
                <IconRefresh class="w-[15px] relative top-[2px]"/>
              </button>
            </TableTh>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in data?.data" :key="link.short_link">
            <td :title="`created ${useTimeAgo(link.created_at).value}`">
              <a :href="link.full_link" target="_blank">
                {{ link.full_link.replace(/^http(s?):\/\//, "") }}</a>
            </td>
            <td>
              <a :href="`${useRuntimeConfig().public.appURL}/${link.short_link}`" target="_blank">
                {{
                  useRuntimeConfig().public.appURL.replace(
                    /^http(s?):\/\//,
                    ""
                  )
                }}/{{ link.short_link }}
              </a>
            </td>
            <td>{{ link.views }}</td>
            <td>
              <NuxtLink class="no-underline" :to="`/links/${link.short_link}`">
                <iconEdit />
              </NuxtLink>
            </td>
            <td>
              <button @click="handleDelete(link.id)">
                <IconTrash />
              </button>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <TailwindPagination :data="data" @pagination-change-page="queries.page = $event"/>
      <div class="mt-5 flex justify-center gap-2">

      </div>
    </div>

    <!-- No links message for when table is empty -->
    <div v-else class="border-dashed border-gray-500 p-3 border-[1px] text-center">
      <div class="flex justify-center">
        <IconLink />
      </div>
      <p>
        <!-- Show this if reason for no links is none found in search -->
        <span v-if="false"> No links matching links found. </span>

        <!-- Show this if reason for no links is User has none -->
        <span v-else>
          No links created yet
          <NuxtLink to="/links/create" class="text-green-600">Go create your first link!</NuxtLink>
        </span>
      </p>
    </div>
  </div>
</template>
