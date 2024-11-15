<template>
  <div class="main-case">
    <the-chats-list />

    <the-header />

    <the-sidebar />

    <section class="main-case__wrapper">
      <slot />
    </section>
  </div>
</template>

<script setup lang="ts">
import TheHeader from "~/components/global/the-header/the-header.vue";
import TheSidebar from "~/components/global/the-sidebar/the-sidebar.vue";
</script>

<style lang="scss">
.main-case{
  width: 100%;
  height: 100%;

  min-height: 100vh;

  display: grid;
  grid-template-areas: 'chats-list header sidebar' 'chats-list content sidebar';
  grid-template-columns: var(--sidebar-size--left) calc(100vw - var(--sidebar-size--left) - var(--sidebar-size--right)) var(--sidebar-size--right);
  grid-template-rows: var(--header-height) calc(100vh - var(--header-height));

  background: $main-color;

  &__wrapper{
    width: 100%;
    height: 100%;

    grid-area: content;

    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-grow: 1;
  }
}

.layout-enter-active, .layout-leave-active{
  transition: opacity ease 0.5s;

  .login-case, .user-info, .header__login, .header__nav, .header__wrapper, .chat-list, .main-case__wrapper, .user-profile{
    transition: opacity ease 0.5s;
  }
}

.layout-enter-from, .layout-leave-to{
  .login-case, .user-info, .header__login, .header__nav, .header__wrapper, .chat-list, .main-case__wrapper, .user-profile{
    opacity: 0;
  }
}
</style>
