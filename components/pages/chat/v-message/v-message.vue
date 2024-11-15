<template>
  <div class="chat-message" :is="props.tag">
    <span class="chat-message__options">
      <v-button-small
        icon="pencil-icon"
        theme="orange"
        @click="editMessage"
        v-if="props.author.id === userStore.user?.id"
      />

      <v-button-small
        icon="trash-icon"
        @click="deleteMessage"
        v-if="props.author.id === userStore.user?.id"
      />

      <v-button-small icon="forward-icon" theme="blue" />
    </span>

    <span class="chat-message__head">
      <button class="chat-message__head-user-button" type="button" @click="setPopupState(true)">
        <span class="chat-message__head-author-avatar">
          <v-user-avatar :user-image="userAvatar" :user-login="props.author.login" />
        </span>

        <strong class="chat-message__head-author-name">
          {{ props.author.login }}
        </strong>
      </button>

      <span class="chat-message__date">
        {{ messageDate }}
      </span>
    </span>

    <span class="chat-message__images" v-if="props.messageImages.length !== 0">
      <span class="chat-message__images-wrapper">
        <v-message-image
          v-for="(image, index) in props.messageImages"
          :key="`chat-image--${props.chatId}-${props.messageId}-${index}`"
          :image-path="image"
        />
      </span>
    </span>

    <span class="chat-message__text" v-if="props.text.length !== 0">
      {{ props.text }}
    </span>

    <span class="chat-message__statuses">
      <v-message-status
        v-for="messageStatus in props.messageStatuses"
        :key="messageStatus.id"
        :status-active="messageStatus.users.length !== 0"
        :status-type="messageStatus.type"
        :status-count="messageStatus.users.length"
        @handle-click="messageUpdateStatus"
      />
    </span>
  </div>

  <teleport to="body">
    <transition name="popup">
      <v-popup title="User info" v-if="popupState" @close-popup="setPopupState(false)">
        <v-user-info :user="props.author" />
      </v-popup>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { TProps } from './v-message.types'

import { useChatsStore } from "~/stores/chats/chats";
import { useUserStore } from "~/stores/user/user";
import { usePopup } from "~/composables/usePopup/usePopup";

import VMessageStatus from "~/components/pages/chat/v-message-status/v-message-status.vue";
import VButtonSmall from "~/components/kit/v-button-small/v-button-small.vue";
import VUserAvatar from "~/components/kit/v-user-avatar/v-user-avatar.vue";
import VMessageImage from "~/components/pages/chat/v-message-image/v-message-image.vue";
import VUserInfo from "~/components/kit/v-user-info/v-user-info.vue";
import VPopup from "~/components/kit/v-popup/v-popup.vue";

const { filesPath } = useAppConfig();
const { popupState, setPopupState } = usePopup();

const chatStore = useChatsStore();
const userStore = useUserStore();

const props = withDefaults(defineProps<TProps>(), {
  tag: 'span'
});

const messageDate = computed<string>(() => {
  return new Date(props.date).toLocaleString('ru-RU')
});
const userAvatar = computed<string | undefined>(() => {
  return props.author?.image.length !== 0 ? `${filesPath}${props.author?.image}` : undefined;
});

const messageUpdateStatus = async (statusType: string): Promise<void> => {
  await chatStore.messageUpdateStatus(props.chatId, props.messageId, statusType)
}
const deleteMessage = async (): Promise<void> => {
  await chatStore.messageDelete(props.chatId, props.messageId)
};
const editMessage = async (): Promise<void> => {
  console.log('try edit message')
};
</script>

<style lang="scss">
.chat-message {
  $this: &;

  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  text-align: left;

  // background-color: $main-color--light;
  border: 1px solid $main-color--light;
  border-radius: 10px;
  position: relative;

  &:hover {
    .message-status:not(.message-status--active) {
      opacity: 1;
    }

    #{$this}__options {
      opacity: 1;
    }
  }

  &__options {
    width: auto;
    height: auto;

    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    column-gap: 8px;

    transform: translateY(-50%);
    position: absolute;
    right: 12px;
    top: -8px;

    opacity: 0;
    transition: opacity ease 0.25s;
  }

  &__head {
    width: 100%;
    height: auto;

    padding: 8px 16px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    border-bottom: 1px solid $main-color--light;
    font-size: 24px;

    & + #{$this}__text {
      border-top: none;
    }
  }

  &__head-user-button {
    width: auto;
    height: auto;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 8px;

    background-color: transparent;
    cursor: pointer;
    border: none;
  }

  &__head-author-avatar {
    width: 40px;
    height: 40px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__head-author-name {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: $main-color--text;
  }

  &__statuses {
    width: auto;
    height: auto;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    position: absolute;
    left: 12px;
    bottom: -8px;

    transform: translateY(50%);
  }

  &__date {
    margin-left: auto;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: $main-color--text;
  }

  &__images {
    width: 100%;
    height: auto;

    padding: 24px 16px 8px 16px;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__images-wrapper {
    width: 100%;
    height: auto;

    padding-bottom: 8px;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    column-gap: 10px;

    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      height: 8px;
    }
  }

  &__text {
    width: 100%;
    height: auto;

    padding: 16px;

    border-top: 1px solid $main-color--light;

    font-family: 'Roboto', sans-serif;
    word-break: break-word;
    font-size: 16px;
    line-height: 20px;
    color: $helper-color--text;
    font-weight: 500;
  }

  &--helper {
    width: auto;

    padding: 0;

    background-color: transparent;
  }

  .message-status:not(.message-status--active) {
    opacity: 0;
    transition: opacity ease 0.25s;
  }
}
</style>
