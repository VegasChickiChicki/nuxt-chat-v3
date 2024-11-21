<template>
	<aside class="chats-list">
    <div class="chats-list__head">
      <transition :name="headerOptionsTransition" mode="out-in">
        <div class="chats-list-options" v-if="!searchChat && !createChat" key="header-options">
          <nuxt-link class="chats-list-options__text" to="/">
            Chats
          </nuxt-link>

          <div class="chats-list-options__settings">
            <button type="button" class="btn-icon chats-list-options__settings--search" @click="showSearchChatForm">
              <nuxt-icon name="search-icon" filled />
            </button>

            <button type="button" class="btn-icon chats-list-options__settings--create" @click="showCreateChatForm">
              <nuxt-icon name="plus-icon" filled />
            </button>
          </div>
        </div>

        <div class="chats-list-search" v-else-if="searchChat" key="header-search">
          <the-search-chat-form v-on-click-outside="closeSearchChatForm" />
        </div>

        <div class="chats-list-create" v-else-if="createChat" key="header-create">
          <the-create-chat-form v-on-click-outside="closeCreateChatForm" />
        </div>
      </transition>
    </div>

    <div class="chats-list__content">
      <transition name="chats-list-chats" mode="out-in">
        <transition-group name="chats-list-chats" class="chats-list-chats" tag="ul" :key="'chatList'" v-if="foundedChats.length === 0">
          <li class="chats-list-chats__item"
              :class="{ 'chats-list-chats__item--active': chat.name === route.params?.name }"
              v-for="chat in chats"
              :key="`chat-${chat.name}`"
          >
            <nuxt-link class="chats-list-chats__link" :to="`/chat/${chat.name}`">
              <v-chat-preview
                :chat-id="chat.id"
                :chat-name="chat.name"
                :chat-owner="chat.owner"
                :chat-users="chat.users"
              />
            </nuxt-link>
          </li>
        </transition-group>

        <transition-group name="chats-list-chats" class="chats-list-chats" tag="ul" :key="'foundedChats'" ref="foundedChatsElement" v-else>
          <li class="chats-list-chats__item"
              v-for="chat in foundedChats"
              :key="`chat-${chat.name}`"
              @click="joinInChat(chat.id, chat.name)"
          >
            <v-chat-preview
              :chat-id="chat.id"
              :chat-name="chat.name"
              :chat-owner="chat.owner"
              :chat-users="chat.users"
            />
          </li>
        </transition-group>
      </transition>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { TChat } from "~/stores/chats/chats.types";

import TheSearchChatForm from "~/components/global/the-search-chat-form/the-search-chat-form.vue";
import TheCreateChatForm from "~/components/global/the-create-chat-form/the-create-chat-form.vue";
import VChatPreview from "~/components/kit/v-chat-preview/v-chat-preview.vue";

import { vOnClickOutside } from '@vueuse/components';

import { useChatsStore } from "~/stores/chats/chats";

const chatsStore = useChatsStore();
const route = useRoute()

const { foundedChats, chats } = storeToRefs(chatsStore)

const headerOptionsTransition = ref<string>('');
const searchChat = ref<boolean>(false);
const createChat = ref<boolean>(false);

const foundedChatsElement = ref<HTMLDivElement | null>(null)

const closeSearchChatForm:  [((() => void)), { ignore: Ref<HTMLDivElement | null>[] }] = [
  (): void => {
    headerOptionsTransition.value = 'chats-list-options--search';

    foundedChats.value = []

    searchChat.value = false;
  }, {
    ignore: [
      foundedChatsElement
    ]
  }
]
const closeCreateChatForm = (): void => {
  headerOptionsTransition.value = 'chats-list-options--create';

  createChat.value = false;
}

const joinInChat = async (chatId: string, chatName: string): Promise<void> => {
  await chatsStore.joinChat(chatId).then(() => {
    navigateTo(`/chat/${chatName}`);
  }).finally(closeSearchChatForm[0])
}

const showSearchChatForm = (): void => {
  headerOptionsTransition.value = 'chats-list-options--search';

  searchChat.value = true;
};
const showCreateChatForm = (): void => {
  headerOptionsTransition.value = 'chats-list-options--create';

  createChat.value = true;
};

await useAsyncData('chatsList', async () => {
  let chatsList: TChat[] = [];

  if (chats.value.length === 0) {
    await chatsStore.getChatsList().then((response: TChat[]) => {
      chatsList = response
    })
  }

  return chatsList;
}, {
  immediate: chatsStore.chats.length === 0
});
</script>

<style lang="scss">
.chats-list{
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  grid-area: chats-list;

  border-right: 1px solid $main-color--light;

  &__head{
    width: 100%;
    height: var(--header-height);

    padding: 12px 12px 12px 24px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    border-bottom: 1px solid $main-color--light;
  }

  &__content{
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
}

.chats-list-chats{
  width: 100%;
  height: auto;

  padding: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  list-style: none;

  &__item{
    width: 100%;
    height: auto;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    border-bottom: 1px solid $main-color--light;

    cursor: pointer;
    background-color: transparent;
    transition: background-color ease 0.25s, trasnform ease 0.35s;

    &--active, &:hover {
      background-color: $main-color--light;
    }
  }

  &__link{
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: flex-end;
    align-items: center;

    text-decoration: none;
  }

  &-enter-active, &-leave-active {
    transition: opacity ease 0.15s;
  }

  &-enter-from, &-leave-to{
    opacity: 0;
  }

  &-move {
    transition: transform ease 0.35s;
  }
}

.chats-list-options{
  width: 100%;
  height: auto;

  display: flex;
  justify-content: space-between;
  align-items: center;

  overflow: hidden;

  .btn-main{
    width: calc(50% - 12px)
  }

  &__text{
    width: auto;
    height: auto;

    font-size: 24px;
    color: $main-color--text;
    font-weight: 400;

    text-decoration: none;
  }

  &__settings{
    width: auto;
    height: auto;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;

    .btn-icon{
      svg{
        width: 16px;
        height: 16px;

        fill: $main-color--text;
      }
    }
  }

  &--search{
    &-enter-active, &-leave-active {
      transition: opacity ease 0.35s;

      .chats-list-options__text{
        transition: opacity ease 0.35s;
      }

      .chats-list-options__settings{
        transition: transform ease 0.35s;
      }

      .chats-list-search__input{
        transition: width ease 0.5s;
      }
    }

    &-enter-from, &-leave-to{
      .chats-list-options__text{
        opacity: 0;
      }

      .chats-list-options__settings{
        transform: translateX(calc(48px));
      }

      .chats-list-search__input{
        width: 0;
      }
    }
  }

  &--create{
    &-enter-active, &-leave-active {
      transition: opacity ease 0.35s;

      .chats-list-options__text, .chats-list-options__settings--search {
        transition: opacity ease 0.35s;
      }

      .chats-list-create__input{
        transition: width ease 0.5s;
      }
    }

    &-enter-from, &-leave-to{
      .chats-list-options__text, .chats-list-options__settings--search {
        opacity: 0;
      }

      .chats-list-create__input{
        width: 0;
      }
    }
  }
}

.chats-list-search, .chats-list-create{
  width: 100%;
  height: auto;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &__form{
    width: 100%;
    height: auto;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__input{
    width: 100%;

    margin-right: 16px;
    margin-top: 28px;

    overflow: hidden;

    .input-text__input {
      font-size: 20px;
    }

    .input-text__footer-inner{
      white-space: nowrap;
    }
  }

  &__button {
    flex-shrink: 0;

    svg {
      width: 16px;
      height: 16px;

      fill: $main-color--text;
    }
  }
}
</style>
