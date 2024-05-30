<template>
  <button @click="handleAuthGitHub">GitAuth</button>
  <button @click="createRepo">Create Repo</button>
  <p>Access Token: {{ accessToken }}</p>
</template>

<script setup lang="ts">
import { listen, emit } from "@tauri-apps/api/event";
import { shell } from "@tauri-apps/api";
import useGithubAuth from "../hooks/github/useGithubAuth";
import { ref } from "vue";
const { handleParseCode, accessToken, createRepo } = useGithubAuth();
const hasRequested = ref(false);
const handleAuthGitHub = () => {
  shell.open(
    `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }&redirect_uri=md-scheme://github&allow_signup=true&scope=repo,user&state=${
      import.meta.env.VITE_GITHUB_STATE
    }`
  );
};

await listen("scheme-request-received", (event: any) => {
  if (event.payload && !hasRequested.value) {
    hasRequested.value = true;
    console.log("App received response from OAuth");
    console.log(event.payload);
    handleParseCode(event.payload);
  }
});

emit("scheme-request-received");
</script>
