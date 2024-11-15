<template>
  <div class="chat-footer">
    <form class="chat-footer__message-area" @submit.prevent="emits('send-message', message)">
      <input
        class="chat-footer__message-text"
        id="new-message"
        type="text"
        autocomplete="off"
        @focus="emits('focus-input')"
        @blur="emits('blur-input')"
        v-model="message"
      >

      <label class="chat-footer__message-button">
        <input
          class="chat-footer__message-files"
          type="file"
          accept="image/*"
          multiple
          @change="uploadFiles"
        >

        <nuxt-icon name="file-icon" filled />
      </label>

      <button class="chat-footer__message-button chat-footer__message-button--rotated" type="submit">
        <nuxt-icon name="double-arrow-icon" filled />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { TEmits } from './v-chat-footer.types'

const emits = defineEmits<TEmits>()

const message = ref<string>('');

const clearInput = (): void => {
  message.value = '';
};
const uploadFiles = (event: Event): void => {
  const input = event.target as HTMLInputElement;

  if (input?.files) {
    emits('upload-files', input.files);

    input.value = '';
  }
}

defineExpose({
  clearInput
})
</script>

<style lang="scss">
.chat-footer {
  $this: &;

  width: 100%;
  height: auto;

  padding: 16px 24px 16px 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  border-top: 1px solid $main-color--light;

  &__message-area {
    width: 100%;
    height: auto;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: 10px;
    border: 1px solid $main-color--light;
    background-color: transparent;
    outline: none;
    overflow: hidden;
  }

  &__message-text {
    width: 100%;
    height: auto;

    padding: 0 12px;

    font-size: 20px;
    color: $main-color--text;
    font-weight: 500;

    border: none;
    outline: none;
    background-color: transparent;
  }

  &__message-button {
    width: 100px;
    height: auto;

    padding: 12px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    border: none;
    border-left: 1px solid $main-color--light;
    outline: none;
    background-color: transparent;
    cursor: pointer;

    &--rotated {
      svg {
        transform: rotate(90deg);
      }
    }

    svg {
      font-size: 24px;

      fill: $main-color--text;
    }
  }

  &__message-files {
    width: 0;
    height: 0;

    visibility: hidden;
  }
}
</style>
