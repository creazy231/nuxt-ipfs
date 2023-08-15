<template>
  <div>
    <div class="grid">
      <div
        v-for="(image) in images"
        :key="image.name"
        class="pswp-gallery__item"
      >
        <a
          @click.prevent
          :href="`${BASE_URL}assets/images/${image.name}`"
          :data-pswp-width="500"
          :data-pswp-height="500"
          target="_blank"
          rel="noreferrer"
          class="artwork"
        >
          <NuxtImg
            loading="lazy"
            :src="`${BASE_URL}assets/images/${image.name}`"
            format="webp"
            width="200"
            quality="10"
            :alt="`Image: ${image.name}`"
          />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* @ts-expect-error */
import PhotoSwipeLightbox from "photoswipe/lightbox";

import "photoswipe/style.css";
import type { PhotoSwipe } from "photoswipe/dist/types/core/eventable";

import images from "~/src/_images.json";

const BASE_URL = process.env.NODE_ENV === "development" ? "/" : "./";

let lightbox: PhotoSwipeLightbox | null = null;

onMounted(async () => {
  lightbox = new PhotoSwipeLightbox({
    gallery: ".grid",
    children: ".pswp-gallery__item",
    pswpModule: () => import("photoswipe"),
    initialZoomLevel: "fit",
    secondaryZoomLevel: 2,
    maxZoomLevel: 5,
  }) as PhotoSwipeLightbox & { pswp: PhotoSwipe };

  lightbox.init();
  document.querySelector(".grid")?.setAttribute("style", "opacity: 1;");
});

onUnmounted(() => {
  document.querySelector(".grid")?.setAttribute("style", "opacity: 0;");

  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }
});
</script>

<style>
.grid {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
</style>
