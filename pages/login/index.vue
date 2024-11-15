<template>
  <div class="login-case">
    <div class="login-case__wrapper login-case__content">

    </div>

    <div class="login-case__wrapper">
      <transition name="login-form" mode="out-in">
        <the-login-form v-if="loginState"/>

        <the-register-form v-else/>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import TheLoginForm from "~/components/pages/login/the-login-form/the-login-form.vue";
import TheRegisterForm from "~/components/pages/login/the-register-form/the-register-form.vue";

import { useAuthStore } from "~/stores/auth/auth";

definePageMeta({
  layout: 'login-layout'
})

const authStore = useAuthStore()
const { loginState } = storeToRefs(authStore)

if (authStore.authState) {
  navigateTo('/')
}
</script>

<style lang="scss">
.login-case{
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  grid-row-start: 2;
  grid-row-end: -1;
  grid-column-start: 1;
  grid-column-end: -1;

  &__wrapper{
    width: 50%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    border-left: 1px solid $main-color--light;
  }

  &__content{
    height: calc(100% + 200px);

    transform: translateY(-100px);
  }
}

.login-form{
  &-enter-active, &-leave-active {
    transition: opacity 0.25s, transform ease 0.25s;
  }

  &-enter-from, &-leave-to{
    opacity: 0;
    transform: translateY(-32px);
  }
}
</style>
