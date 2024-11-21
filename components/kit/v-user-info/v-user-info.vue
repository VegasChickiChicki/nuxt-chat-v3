<template>
  <div class="user-info">
    <div class="user-info__head">
      <div class="user-info__head-avatar">
        <v-user-avatar
          :user-login="props.user.login"
          :user-image="userAvatar"
        >
          <v-image-preview :image="userAvatar" v-if="userAvatar" />
        </v-user-avatar>
      </div>

      <div class="user-info__head-wrapper">
        <span class="user-info__head-title">
          {{ props.user.login }}
        </span>

        <span class="user-info__head-subtitle">
          {{ props.user.email }}
        </span>

        <span class="user-info__head-online-status">
          {{ userLastOnlineStatus }}
        </span>
      </div>
    </div>

    <div class="user-info__content">
      <p class="user-info__content-text">
        {{ props.user.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TProps } from './v-user-info';

import VUserAvatar from "~/components/kit/v-user-avatar/v-user-avatar.vue";

import { getLastOnlineStatus } from "~/utils/getLastOnlineStatus/getLastOnlineStatus";
import VImagePreview from "~/components/kit/v-image-preview/v-image-preview.vue";

const { filesPath } = useAppConfig();

const props = defineProps<TProps>();

const userAvatar = computed<string | undefined>(() => {
  return props.user.image.length !== 0 ? `${filesPath}${props.user.image}` : undefined;
});
const userLastOnlineStatus = computed<string>(() => {
  if (props.user.isOnline) {
    return  'Online now'
  }

  if (props.user.lastOnlineDate) {
    return getLastOnlineStatus(props.user.lastOnlineDate)
  }

  return ''
});
</script>

<style lang="scss">
.user-info {
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

  &__head-online-status {
    font-size: 14px;
    line-height: 20px;
    color: $helper-color--text;
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
