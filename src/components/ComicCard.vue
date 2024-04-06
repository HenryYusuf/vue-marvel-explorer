<script lang="ts" setup>
import { computed } from "vue";
import type { Comic } from "@/types/marvel";
import CardView from "./CardView.vue";

const props = defineProps<{
  comic: Comic;
}>();

const lf = new Intl.ListFormat("en");

const charactersList = computed(() =>
  props.comic.characters.items.map((c) => c.name)
);
const creatorList = computed(() =>
  props.comic.creators.items.map((c) => c.name)
);
</script>

<template>
  <CardView>
    <template #header>
      {{ comic.title }}
    </template>
    <template #default>
      <img
        :src="`${comic.thumbnail.path}.${comic.thumbnail.extension}`"
        alt="Comic Thumbnail"
        class="aspect-[150/228] shadow-xl float-left mr-4"
        width="150"
      />
      <dl>
        <dt>Series:</dt>
        <dd>{{ comic.series.name }}</dd>
        <dt v-if="charactersList.length > 0">Characters:</dt>
        <dd v-if="charactersList.length > 0">
          {{ lf.format(charactersList) }}
        </dd>
        <dt v-if="creatorList.length > 0">Creators:</dt>
        <dd v-if="creatorList.length > 0">{{ lf.format(creatorList) }}</dd>
      </dl>
    </template>
  </CardView>
</template>
