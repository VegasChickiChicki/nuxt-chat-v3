<template>
  <div class="chat-preview">
    <div class="chat-preview__icon">
      {{ chatIcon }}
    </div>

    <div class="chat-preview__content">
      <p class="chat-preview__name">
        {{ props.chatName }}
      </p>

      <button
        class="chat-preview__remove-chat"
        type="button"
        title="Remove chat"
        @click.prevent="removeChat"
        v-if="user?.login === chatOwner.login"
      >
        <nuxt-icon class="chat-preview__remove-chat-icon" name="trash-icon" filled />
      </button>

      <button
        class="chat-preview__remove-chat"
        type="button"
        title="Leave from chat"
        @click.prevent="leaveChat"
        v-else-if="userAlreadyInChat"
      >
        <nuxt-icon class="chat-preview__remove-chat-icon" name="leave-icon" filled />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TProps } from './v-chat-preview.types'
import type { TUser } from "~/stores/user/user.types";

import { useChatsStore } from "~/stores/chats/chats";
import { useUserStore } from "~/stores/user/user";

const chatsStore = useChatsStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const props = withDefaults(defineProps<TProps>(), {
  chatUsers: () => []
})
const route = useRoute()

const removeChat = async (): Promise<void> => {
  await chatsStore.removeChat(props.chatId).then(() => {
    if (route.params?.name === props.chatName) {
      navigateTo('/')
    }
  })
}
const leaveChat = async (): Promise<void> => {
  await chatsStore.leaveChat(props.chatId).then(() => {
    if (route.params?.name === props.chatName) {
      navigateTo('/')
    }
  })
}

const userAlreadyInChat = computed<boolean>(() => {
  return !!props.chatUsers.find((chatMember: Omit<TUser, 'token'>) => {
    return chatMember.login === user.value?.login
  })
})
const chatIcon = computed<string>(() => {
  return props.chatName.split('')[0]
})
</script>

<style lang="scss">
.chat-preview{
  $this: &;

  width: 100%;
  height: auto;

  padding: 16px 24px;

  display: flex;
  justify-content: flex-start;
  align-items: stretch;

  text-decoration: none;

  &__icon{
    width: 32px;
    height: 32px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    border-radius: 50%;
    border: 1px solid $main-color--text;

    color: $main-color--text;
    font-size: 20px;
    line-height: 32px;
    font-weight: 700;
  }

  &__content{
    width: 100%;
    height: auto;

    margin-left: 16px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__name{
    color: $main-color--text;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  &__remove-chat {
    width: 24px;
    height: 24px;

    display: flex;
    justify-content: center;
    align-items: center;

    margin-left: auto;
    margin-bottom: auto;

    background-color: transparent;
    border: none;

    cursor: pointer;

    &:hover {
      #{$this}__remove-chat-icon svg {
        fill: $main-color--text;
      }
    }
  }

  &__remove-chat-icon {
    font-size: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 20px;
      height: 20px;

      transition: fill ease 0.25s;

      fill: $main-color--text;
    }
  }
}
</style>
