<template>
  <div class="chat" :class="chatClasses">
    <div class="chat__wrapper">
      <v-virtualization-container class="chat__list" :items="messages" v-if="chat" ref="virtualizationContainer">
        <template v-slot:default="{ itemsToShow, removeVirtualizationItem, resizeObserver }">
          <v-virtualization-item
            v-for="item in itemsToShow"
            :key="item.originalItem.id"
            :id="item.originalItem.id"
            :position="item.virtualizationItem.position"
            :resize-observer="resizeObserver"
          >
            <v-message
              :message-id="item.originalItem.id"
              :chat-id="chat.id"
              :date="item.originalItem.date"
              :author="item.originalItem.author"
              :text="item.originalItem.text"
              :message-statuses="item.originalItem.statuses"
              :message-images="item.originalItem.images"
              @remove-message="deleteMessage($event).then(() => removeVirtualizationItem($event))"
            />
          </v-virtualization-item>
        </template>
      </v-virtualization-container>
    </div>

    <div class="chat__helper-stage" v-if="writingUser.length > 0 && user?.login !== writingUser">
      <span class="chat__helper-stage-message">
        {{ writingUser }} is typing a message...
      </span>
    </div>

    <div class="chat__files-previews" v-if="filesToPreviews.length !== 0">
      <div class="chat__files-previews-wrapper">
        <v-file-preview
          v-for="file in filesToPreviews"
          :key="file.name"
          :image="file"
          @remove-file="removeFileFromMessage"
        />
      </div>
    </div>

    <v-chat-footer
      @focus-input="userStartWriting"
      @blur-input="userStopWriting"
      @send-message="sendMessage"
      @upload-files="addFileToMassage"
      ref="chatFooter"
    />
  </div>
</template>

<script setup lang="ts">
import type { TChat, TMessage } from "~/stores/chats/chats.types";
import type { TUser } from "~/stores/user/user.types";

import VVirtualizationContainer from "~/components/kit/v-virtualization-container/v-virtualization-container.vue";
import VVirtualizationItem from "~/components/kit/v-virtualization-item/v-virtualization-item.vue";
import VMessage from "~/components/pages/chat/v-message/v-message.vue";
import VChatFooter from "~/components/pages/chat/v-chat-footer/v-chat-footer.vue";
import VFilePreview from "~/components/pages/chat/v-file-preview/v-file-preview.vue";

import { useChatsStore } from "~/stores/chats/chats";
import { useUserStore } from "~/stores/user/user";

const nuxtApp = useNuxtApp()
const socket = nuxtApp.$socket;

const chatsStore = useChatsStore();
const userStore = useUserStore();
const { chats } = storeToRefs(chatsStore);
const { user } = storeToRefs(userStore);

const loadingState = ref<boolean>(true);
const writingUser = ref<string>('');
const filesToPreviews = ref<File[]>([]);

const virtualizationContainer = ref<InstanceType<typeof VVirtualizationContainer> | null>(null);
const chatFooter = ref<InstanceType<typeof VChatFooter> | null>(null);

const route = useRoute();
const currentChatName: string = route.params?.name as string || '';

const chat = computed<TChat | null>(() => {
  return chats.value.find(el => el.name === currentChatName) || null
})
const chatClasses = computed<Record<string, boolean>>(() => {
  return {
    'chat--loading': loadingState.value
  }
})
const messages = computed<TMessage[]>(() => {
  if (chat.value){
    return chats.value.find((currentChat: TChat) => {
      return currentChat.id === chat.value?.id
    })?.messages || []
  }

  return [];
})

const scrollChatDown = (): void => {
  if (virtualizationContainer.value) {
    virtualizationContainer.value.scrollDown();
  }
}
const sendMessage = async (message: string): Promise<void> => {
  if (chat.value && (message.length > 0 || filesToPreviews.value.length > 0)){
    await chatsStore.messageCreate(chat.value.id, message, filesToPreviews.value);

    if (chatFooter.value) {
      chatFooter.value.clearInput();
      filesToPreviews.value = [];
    }
  }
};
const deleteMessage = async (messageId: string): Promise<void> => {
  if (chat.value) {
    await chatsStore.messageDelete(chat.value.id, messageId);
  }
};
const addFileToMassage = (files: FileList): void => {
  Array.from(files).forEach((file: File) => {
    filesToPreviews.value.push(file);
  })

  setTimeout(() => {
    scrollChatDown();
  }, 100)
};
const removeFileFromMessage = (fileName: string) => {
  filesToPreviews.value = filesToPreviews.value.filter((file: File) => {
    return file.name !== fileName
  });
}
const userStartWriting = (): void => {
  if (chat.value && user.value) {
    socket.emit('user-start-writing', {
      userName: user.value.login,
      chatId: chat.value.id
    });
  }
};
const userStopWriting = (): void => {
  if (chat.value) {
    socket.emit('user-stop-writing', {
      chatId: chat.value.id
    });
  }
};

await useAsyncData('chatMessages', async () => {
  if (chats.value.length === 0){
    await chatsStore.getChatsList();
  }

  if (messages.value.length === 0 && chat.value !== null) {
    await chatsStore.getMessagesList(chat.value?.id);
  }

  return {
    chats: chats.value,
    messages: messages.value
  }
})

onMounted(() => {
  if (chat.value && user.value) {
    socket.connect();

    socket.emit('join-in-chat', chat.value.id);

    socket.on('update-chat', (message: TMessage) => {
      if (chat.value) {
        chatsStore.chatAddMessage(chat.value.id, message);

        setTimeout(scrollChatDown, 0);
      }
    });

    socket.on('update-message', (message: TMessage) => {
      if (chat.value) {
        chatsStore.chatUpdateMessage(chat.value.id, message)
      }
    });

    socket.on('delete-message', (message: TMessage) => {
      if (chat.value) {
        chatsStore.chatDeleteMessage(chat.value.id, message.id)
      }
    });

    socket.on('update-writing-user', (writingUserName: string) => {
      writingUser.value = writingUserName;
    });

    socket.on('update-user-online-status', (user: Omit<TUser, 'token'>) => {
      if (chat.value) {
        chatsStore.chatUpdateUserOnlineStatus(chat.value.id, user)
      }
    });

    socket.on('user-leave', (user: Omit<TUser, 'token'>) => {
      if (chat.value) {
        chatsStore.chatRemoveUser(chat.value?.id, user);
      }
    });

    socket.on('user-join', (user: Omit<TUser, 'token'>) => {
      if (chat.value) {
        chatsStore.chatAddUser(chat.value?.id, user);
      }
    });
  }

  setTimeout(() => {
    scrollChatDown();

    loadingState.value = false;
  }, 175);
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<style lang="scss">
.chat {
  $this: &;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  &__wrapper{
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-self: center;

    padding: 24px 8px 8px 0;

    overflow: hidden;
    transition: filter ease 0.35s;
  }

  &__helper-stage{
    width: 100%;
    height: 64px;

    padding: 8px 24px 8px 16px;

    display: flex;
    justify-content: flex-start;
    align-items: center;

    border-top: 1px solid $main-color--light;
  }

  &__helper-stage-message {
    color: $helper-color--text;
  }

  &__files-previews {
    width: 100%;
    height: auto;

    padding: 16px 24px 16px 16px;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    border-top: 1px solid $main-color--light;
  }

  &__files-previews-wrapper {
    width: 100%;
    height: auto;

    padding-bottom: 12px;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;

    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      height: 8px;
    }
  }

  &__files-previews-inner {
    width: auto;
    height: auto;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    flex-shrink: 0;

    border: 1px solid $main-color--light;
    border-radius: 10px;
  }

  &__list{
    width: 100%;
    height: 100%;

    padding: 0 8px 0 16px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    row-gap: 48px;

    transition: opacity ease 0.125s;
    list-style: none;
    overflow: auto;
  }

  &--loading {
    #{$this}__wrapper {
      filter: blur(16px);
      pointer-events: none;
    }

    #{$this}__list {
      opacity: 0;
    }
  }
}
</style>
