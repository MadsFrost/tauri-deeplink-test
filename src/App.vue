<script setup lang="ts">
import Test from "./components/Editor/Test.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Tiptap from "./components/Editor/Tiptap.vue";
</script>

<template>
  <Suspense>
    <div>
      <Tiptap />
      <Test />
    </div>
  </Suspense>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
