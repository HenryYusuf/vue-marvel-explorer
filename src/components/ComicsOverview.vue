<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useComics } from "@/composables/marvelApi";
import type { Comic } from "@/types/marvel";

import LoadingIndicator from "./LoadingIndicator.vue";
import ComicCard from "./ComicCard.vue";
import PaginationComponent from "./PaginationComponent.vue";

const route = useRoute();
const router = useRouter();

const isLoading: Ref<boolean> = ref(false);
const data: Ref<Comic[] | undefined> = ref();
const currentPage: Ref<number | string> = ref(0);
const totalPages: Ref<number> = ref(0);

if (route.params.page) {
  currentPage.value = +route.params.pages;
}

const getComics = async (page: number = 0) => {
  try {
    isLoading.value = true;
    const comics = await useComics(page);

    currentPage.value = comics?.offset / comics?.limit || 0;
    totalPages.value = Math.ceil(comics.total / comics.limit);

    data.value = comics.results;
    isLoading.value = false;
  } catch (error) {
    router.push({ path: "error", query: { info: error as string } });
  }
};

watch(
  () => route.params.page,
  async (newPage) => {
    await getComics(+newPage);
  }
);

onMounted(async () => {
  await getComics(+currentPage.value);
});
</script>

<template>
  <div>
    <LoadingIndicator v-if="isLoading" text="Loading comics..." />
    <div v-if="data && !isLoading">
      <div
        class="grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <ComicCard
          v-for="comic in data"
          :comic="comic"
          :key="comic.id"
        ></ComicCard>
      </div>
      <PaginationComponent
        :total-pages="totalPages"
        path="/"
        :current-page="+currentPage"
      />
    </div>
  </div>
</template>
