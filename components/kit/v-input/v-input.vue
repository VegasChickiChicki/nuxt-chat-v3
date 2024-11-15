<template>
  <div class="input-text">
    <label :for="`input-${props.type}-${props.name}`" class="input-text__wrapper">
      <span class="input-text__title" v-if="props.title">
        {{ props.title }}
      </span>

      <input
        class="input-text__input"
        :type="props.type"
        :id="`input-${props.type}-${props.name}`"
        :value="props.modelValue"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :autocomplete="props.autocomplete"
        ref="inputElement"
        @blur="emits('blur-input')"
        @input="emits('update:model-value', $event?.target?.value as string)"
      >

      <span class="input-text__footer">
        <transition name="input-text__footer-inner">
          <span class="input-text__footer-inner" v-if="props.helperText && props.helperText.length > 0">
            {{ props.helperText }}
          </span>
        </transition>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import type { TProps, TEmits } from './v-input.types'

const props = withDefaults(defineProps<TProps>(), {
  title: '',
  type: 'string',
  helperText: '',
  value: '',
  disabled: false,
  placeholder: '',
  autocomplete: 'off'
})
const emits = defineEmits<TEmits>()

const inputElement = ref<HTMLInputElement | null>(null)

const focusInputElement = (): void => {
  if (inputElement.value) {
    inputElement.value.focus()
  }
}

defineExpose({
  focus: focusInputElement
})
</script>

<style lang="scss">
.input-text {
  width: auto;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  &__wrapper {
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  &__title, &__footer {
    width: 100%;
    height: 24px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  &__title {
    margin-bottom: 4px;

    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    color: $helper-color--text;
  }

  &__footer {
    min-height: 28px;

    font-size: 12px;
    line-height: 14px;
    font-weight: 600;
    color: $helper-color--text;

    &-inner{
      font-size: inherit;
      line-height: inherit;
      font-weight: inherit;
      color: inherit;

      &-enter-active, &-leave-active {
        transition: opacity 0.25s;
      }

      &-enter, &-leave-to{
        opacity: 0;
      }
    }
  }

  &__input {
    width: 100%;
    height: 32px;

    padding: 4px 0;

    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    font-size: 16px;
    font-weight: 400;

    &:focus{
      cursor: text;
    }

    &::placeholder{
      font-family: 'Raleway', sans-serif;
      color: $helper-color--text;
    }
  }

  &--default {
    .input-text__title {
      color: $helper-color--text;
    }

    .input-text__input {
      border-bottom: 0.1px solid $helper-color--text;

      color: $helper-color--text
    }
  }

  &--error{
    .input-text__input {
      border-bottom: 0.1px solid $main-color--error;
    }

    .input-text__footer{
      color: $main-color--error;
    }
  }
}
</style>
