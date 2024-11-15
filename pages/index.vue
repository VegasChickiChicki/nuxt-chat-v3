<template>
  <div class="home">
    <div class="home__wrapper">
      <h1 class="home__title">
        Welcome to Nuxt-chat!
      </h1>

      <p class="home__content">
        If you want to start a chatting, you just need to join the chat. The chat list is
        located in the left sidebar. If the chat list is empty, you can create your own chat or find and join existing
        chats...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.home{
  width: 100%;
  height: auto;

  padding: 0 50px;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  &__wrapper{
    width: auto;
    height: auto;

    padding-top: 100px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__title, &__content{
    color: $main-color--text;
    text-align: center;
  }

  &__title{
    font-size: 64px;
    font-weight: 500;
  }

  &__content{
    max-width: 800px;
    margin-top: 48px;

    font-size: 24px;
    font-weight: 400;
    line-height: 1.5;
  }

  &-enter-active, &-leave-active{
    transition: opacity ease 0.275s;
  }

  &-enter, &-leave-to{
    opacity: 0;
  }
}
</style>
