<template>
  <form @submit.prevent="createChat" class="chats-list-create__form">
    <v-input
      class="input-text--default chats-list-create__input"
      name="create-chat"
      placeholder="chat name"
      :helper-text="$chatNameValidator.chatName.$errors[0]?.$message"
      :class="{ 'input-text--error': $chatNameValidator.chatName.$error }"
      ref="createChatInput"
      @update:model-value="clearValidationError"
      v-model="chatName"
    />

    <button type="submit" class="btn-icon chats-list-create__button">
      <nuxt-icon name="plus-icon" filled />
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
const createChat = async (): Promise<void> => {
  $chatNameValidator.value.$touch()

  if (!$chatNameValidator.value.$error) {
    await chatStore.createChat(chatName.value).catch((errors: TApiError[]) => {
      if (errors.length > 0) {
        $validationErrors.value['chatName'] = errors[0].errorText
      }
    })
  }
}
</script>

<style lang="scss">

</style>
