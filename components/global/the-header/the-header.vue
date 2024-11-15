<template>
  <header class="header">
    <div class="header__wrapper">

    </div>
  </header>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.header{
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  grid-area: header;

  border-bottom: 1px solid $main-color--light;

  &__wrapper{
    width: 100%;
    height: 100%;

    padding: 12px 24px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__login{
    width: 50%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    .btn-main{
      width: 50%;
      height: 100%;

      border-top: none;

      &:not(:last-of-type){
        border-right: none;
      }
    }
  }
}
</style>
