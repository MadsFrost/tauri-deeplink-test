<template>
  <button @click="handleAuthGitHub">GitAuth</button>
</template>

<script setup lang="ts">
import { listen, emit } from "@tauri-apps/api/event";
import { shell } from "@tauri-apps/api";
const handleAuthGitHub = () => {
  shell.open(
    `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }&redirect_uri=md-scheme://github&allow_signup=true&scope=repo,user`
  );
};

await listen("scheme-request-received", (event: any) => {
  console.log(event.name, event.payload);
  // event.event is the event name (useful if you want to use a single callback fn for multiple event types)
  // event.payload is the payload object
});

emit("scheme-request-received");
</script>
