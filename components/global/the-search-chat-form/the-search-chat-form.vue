<template>
  <form @submit.prevent="searchChat" class="chats-list-search__form">
    <v-input
      class="input-text--default chats-list-search__input"
      name="search-chat"
      placeholder="chat name"
      :helper-text="$chatNameValidator.chatName.$errors[0]?.$message"
      :class="{ 'input-text--error': $chatNameValidator.chatName.$error }"
      ref="searchChatInput"
      @update:model-value="clearValidationError"
      v-model="chatName"
    />

    <button type="submit" class="btn-icon chats-list-search__button">
      <nuxt-icon name="search-icon" filled />
    </button>
  </form>
</template>

<script setup lang="ts">
import type { TApiError } from "~/types/api";

import VInput from "~/components/kit/v-input/v-input.vue";

import { useChatsStore } from "~/stores/chats/chats";
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const chatStore = useChatsStore();

const chatName = ref<string>('Vegas')
const $validationErrors = ref<{ chatName?: string }>({})
const $chatNameValidator = useVuelidate<{ chatName: string }>({
  chatName: {
    required: helpers.withMessage('Field is required', required),
  }
}, {
  chatName: chatName
}, {
  $externalResults: $validationErrors
})

const clearValidationError = (): void => {
  if ($validationErrors.value.hasOwnProperty('chatName')) {

    delete $validationErrors.value['chatName']

    $chatNameValidator.value['chatName'].$reset()
  }
}
const searchChat = async (): Promise<void> => {
  $chatNameValidator.value.$touch()

  if (!$chatNameValidator.value.$error) {
    await chatStore.searchChat(chatName.value).catch((errors: TApiError[]) => {
      if (errors.length > 0) {
        $validationErrors.value['chatName'] = errors[0].errorText
      }
    })
  }
}
</script>

<style lang="scss">

</style>
