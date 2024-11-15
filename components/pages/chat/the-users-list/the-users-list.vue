<template>
  <div class="users-list">
    <ul class="users-list__content">
      <li class="users-list__content-item" v-if="userStore.user !== null">
        <v-user
          :user="userStore.user"
          :show-status="false"
          :show-last-online="false"
          :role="getUserRole(userStore.user)"
        />
      </li>

      <template v-if="!loadingState">
        <transition-group name="ease-opacity">
          <li
            class="users-list__content-item"
            v-for="(user, userIndex) in usersList"
            :key="`chat-member-${userIndex}`"
          >
            <v-user
              :user="user"
              :show-status="user.login !== userStore.user?.login"
              :role="getUserRole(user)"
            />
          </li>
        </transition-group>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TChat } from "~/stores/chats/chats.types";
import type { TUser } from "~/stores/user/user.types";

import { useChatsStore } from "~/stores/chats/chats";
import { useUserStore } from "~/stores/user/user";

import VUser from '~/components/pages/chat/v-user/v-user.vue'

const chatStore = useChatsStore();
const userStore = useUserStore();
const { chats } = storeToRefs(chatStore)
const route = useRoute()
const loadingState = ref<boolean>(true)

const currentChat = computed<TChat | null>(() => {
  return chats.value.find((chat: TChat) => {
    return chat.name === route.params?.name
  }) || null
})
const usersList = computed<Omit<TUser, 'token'>[]>(() => {
  if (!currentChat.value) {
    return []
  }

  return currentChat?.value.users.filter((user: Omit<TUser, 'token'>) => {
    return user.id !== userStore.user?.id
  })
})

const getUserRole = (user: Omit<TUser, 'token'>): string => {
  if (user.login === userStore.user?.login) {
    return 'You'
  }

  if (user.login === currentChat.value?.owner.login) {
    return 'Owner'
  }

  return 'Guest'
}

onMounted(() => {
  setTimeout(() => {
    loadingState.value = false;
  }, 175)
})
</script>

<style lang="scss">
.users-list {
  $this: &;

  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  &__content {
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    list-style: none;
  }

  &__content-item {
    width: 100%;
    height: auto;
  }
}
</style>
