<template>
  <form class="default-form" :key="'registerUserForm'" @submit.prevent="registerUser">
    <p class="default-form__title">
      Sign in!
    </p>

    <v-input
      class="input-text--default"
      :name="'register-email'"
      :title="'Email'"
      :placeholder="'some-email@gmail.com'"
      :helper-text="$userValidator.email.$errors?.[0]?.$message"
      :class="{ 'input-text--error': $userValidator.email.$error }"
      @update:model-value="clearValidationError('email')"
      v-model="user.email"
    />

    <v-input
      class="input-text--default"
      :name="'register-name'"
      :title="'Login'"
      :placeholder="'some-login'"
      :helper-text="$userValidator.login.$errors?.[0]?.$message"
      :class="{ 'input-text--error': $userValidator.login.$error }"
      @update:model-value="clearValidationError('login')"
      v-model="user.login"
    />

    <v-input
      class="input-text--default"
      :name="'register-password'"
      :title="'Password'"
      :placeholder="'some-password'"
      :type="'password'"
      :helper-text="$userValidator.password.$errors?.[0]?.$message"
      :class="{ 'input-text--error': $userValidator.password.$error }"
      @update:model-value="clearValidationError('password')"
      v-model="user.password"
    />

    <button type="submit" class="btn-main btn--transparent">
      register
    </button>
  </form>
</template>

<script setup lang="ts">
import type { TRegisterValidationError } from "~/stores/auth/auth.types";
import type { TRegisterForm } from "./the-register-form.types";
import type { TUser } from "~/stores/user/user.types";

import { REQUIRED_TEXT } from "./the-register-form.constants";

import VInput from "~/components/kit/v-input/v-input.vue";

import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useAuthStore } from "~/stores/auth/auth";
import { useUserStore } from "~/stores/user/user";

const authStore = useAuthStore()
const userStore = useUserStore()

const user = ref<TRegisterForm>({
  email: 'www.check@gmail.com',
  login: 'Vegas',
  password: '1234567',
})
const validationErrors = ref<Partial<TRegisterForm>>({})

const $userValidator = useVuelidate<TRegisterForm>({
  email: {
    required: helpers.withMessage(REQUIRED_TEXT, required),
  },
  login: {
    required: helpers.withMessage(REQUIRED_TEXT, required),
  },
  password: {
    required: helpers.withMessage(REQUIRED_TEXT, required)
  }
}, user, {
  $externalResults: validationErrors
})

const clearValidationError = (field: keyof TRegisterForm): void => {
  if (validationErrors.value.hasOwnProperty(field)) {

    delete validationErrors.value[field]

    $userValidator.value[field].$reset()
  }
}
const registerUser = async (): Promise<void> => {
  $userValidator.value.$touch()

  if (!$userValidator.value.$error) {
    await authStore.registerUser(user.value).then((user: TUser) => {
      userStore.setUser(user)
      authStore.setAuthState(true)

      navigateTo('/')
    }).catch((errors: TRegisterValidationError[]) => {
      validationErrors.value = Object.fromEntries(errors.map((error: TRegisterValidationError) => {
        return [error.errorType, error.errorText]
      }))
    })
  }
}
</script>

<style lang="scss">

</style>
