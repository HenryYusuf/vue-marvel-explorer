<script lang="ts" setup>
import type { Character } from "@/types/marvel";
import CardView from "./CardView.vue";

interface Props {
  character: Character;
}

defineProps<Props>();
</script>
<template>
  <CardView :id="character.id">
    <img
      :src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
      alt="Thumbnail Image"
      class="float-left w-12 mb-2 mr-4 rounded-full shadow-md aspect-square"
    />
    <template #header>
      {{ character.name }}
    </template>
    <div class="text-base max-w-prose">{{ character.description }}</div>
  </CardView>
</template>
