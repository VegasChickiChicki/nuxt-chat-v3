<template>
  <button class="user-item" type="button" @click="setPopupState(true)">
    <span class="user-item__image">
      <v-user-avatar :user-image="userAvatar" :user-login="props.user.login" />
    </span>

    <span class="user-item__content">
      <span class="user-item__wrapper">
        <span class="user-item__title">
          {{ props.user.login }}
        </span>

        <span class="user-item__info" :class="userItemInfoClasses" v-if="props.showStatus">
          {{ userStatus }}

          <span class="user-item__status" />
        </span>
      </span>

      <span class="user-item__wrapper">
        <span class="user-item__subtitle">
          {{ props.role }}
        </span>

        <span class="user-item__info" v-if="showLastOnline && !props.user.isOnline && props.user.lastOnlineDate">
          {{ userLastOnlineStatus }}
        </span>
      </span>
    </span>
  </button>

  <teleport to="body">
    <transition name="popup">
      <v-popup title="User info" v-if="popupState" @close-popup="setPopupState(false)">
        <v-user-info :user="props.user" />
      </v-popup>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { TProps } from './v-user.types'

import VUserAvatar from "~/components/kit/v-user-avatar/v-user-avatar.vue";
import VPopup from "~/components/kit/v-popup/v-popup.vue";
import VUserInfo from '~/components/kit/v-user-info/v-user-info.vue';

import { getLastOnlineStatus } from "~/utils/getLastOnlineStatus/getLastOnlineStatus";
import { usePopup } from "~/composables/usePopup/usePopup";

const { filesPath } = useAppConfig();
const { popupState, setPopupState } = usePopup();

const props = withDefaults(defineProps<TProps>(), {
  tag: 'span',
  showStatus: true,
  showLastOnline: true
});


const userStatus = computed<string>(() => {
  return props.user.isOnline ? 'online' : 'offline'
});
const userItemInfoClasses = computed<Record<string, boolean>>(() => {
  return {
    'user-item__info--active': props.user.isOnline
  }
});
const userAvatar = computed<string | undefined>(() => {
  return props.user.image.length !== 0 ? `${filesPath}${props.user.image}` : undefined;
});
const userLastOnlineStatus = computed<string>(() => {
  if (props.user.lastOnlineDate) {
    return getLastOnlineStatus(props.user.lastOnlineDate)
  }

  return ''
});
</script>

<style lang="scss">
.user-item {
  $this: &;

  width: 100%;
  height: auto;

  padding: 12px;

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  column-gap: 8px;

  transition: background-color ease 0.25s;
  cursor: pointer;
  background-color: transparent;
  border: none;

  font-size: 32px;

  &:not(:first-child) {
    border-top: 1px solid $main-color--light;
  }

  &:last-child {
    border-bottom: 1px solid $main-color--light;
  }

  &:hover {
    background-color: $main-color--light;
  }

  &__image {
    width: 48px;
    height: 48px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__content {
    width: 100%;
    height: auto;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    row-gap: 4px;
  }

  &__wrapper {
    width: 100%;
    height: auto;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    color: $main-color--text;
  }

  &__subtitle {
    width: auto;
    height: 20px;

    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: $helper-color--text;
  }

  &__info {
    width: auto;
    height: auto;

    margin-left: auto;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 8px;


    font-size: 14px;
    line-height: 16px;

    color: $helper-color--text;

    &--active {
      color: $helper-color;

      #{$this}__status {
        border: none;
        background-color: $helper-color;
      }
    }
  }

  &__status {
    width: 12px;
    height: 12px;

    border-radius: 50%;
    border: 1px solid $helper-color--text;
  }
}
</style>
