<template>
  <div class="user-settings" v-if="user">
    <div class="user-settings__head">
      <label class="user-settings__head-avatar">
        <v-user-avatar
          :user-login="user.login"
          :user-image="userAvatar"
        />

        <span class="user-settings__head-avatar-overlay">
          <nuxt-icon class="user-settings__head-avatar-icon" name="plus-icon" filled />
        </span>

        <input
          class="user-settings__head-avatar-input"
          type="file" accept="image/*"
          @change="updateUserImage"
        >
      </label>

      <div class="user-settings__head-wrapper">
        <span class="user-settings__head-title">
          {{ user.login }}
        </span>

        <span class="user-settings__head-subtitle">
          {{ user.email }}
        </span>
      </div>
    </div>

    <div class="user-settings__content">
      <p class="user-settings__content-text">
        {{ user.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/user/user";

import VUserAvatar from "~/components/kit/v-user-avatar/v-user-avatar.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { filesPath } = useAppConfig();

const updateUserImage = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;

  if (target?.files && target?.files[0]) {
    await userStore.updateUser({
      userImage: target.files[0]
    });

    target.value = '';
  }
};

const userAvatar = computed<string | undefined>(() => {
  return user.value?.image.length !== 0 ? `${filesPath}${user.value?.image}` : undefined;
});
</script>

<style lang="scss">
.user-settings {
  $this: &;

  width: 500px;
  height: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &__head {
    width: 100%;
    height: 80px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 8px;
  }

  &__head-avatar {
    width: auto;
    height: 74px;

    position: relative;
    background-color: transparent;
    border: none;
    overflow: hidden;
    border-radius: 50%;

    font-size: 64px;

    &:hover {
      #{$this}__head-avatar-overlay {
        opacity: 0.9;
      }
    }
  }

  &__head-avatar-overlay {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 2;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;

    cursor: pointer;
    background-color: $main-color--light;
    opacity: 0;
    transition: opacity ease 0.25s;


  }

  &__head-avatar-input {
    visibility: hidden;
    width: 0;
    height: 0;
  }

  &__head-avatar-icon {
    width: auto;
    height: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 32px;
      height: 32px;

      fill: $helper-color--text;
    }
  }

  &__head-wrapper {
    width: auto;
    height: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__head-title {
    font-size: 24px;
    line-height: 32px;
    color: $main-color--text;
  }

  &__head-subtitle {
    font-size: 16px;
    line-height: 24px;
    color: $main-color--text;
  }

  &__content {
    width: 100%;
    height: auto;

    margin-top: 20px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__content-text {
    font-size: 24px;
    line-height: 32px;
    color: $main-color--text;
  }
}
</style>
