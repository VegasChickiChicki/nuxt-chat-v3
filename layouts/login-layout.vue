<template>
	<div class="main-case login">
    <header class="header">
      <div class="header__wrapper">
        <div class="header__login">
          <button type="button" class="btn-main btn--transparent" @click="authStore.toggleLoginState">
            Sign in
          </button>

          <button type="button" class="btn-main btn--transparent" @click="authStore.toggleLoginState">
            Sign up
          </button>
        </div>
      </div>
    </header>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth/auth";

const authStore = useAuthStore();
</script>
