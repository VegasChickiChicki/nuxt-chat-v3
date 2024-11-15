<template>
  <form class="default-form" :key="'loginUserForm'" @submit.prevent="loginUser">
    <p class="default-form__title">
      Sign up
    </p>

    <v-input
      class="input-text--default"
      :name="'login-login'"
      :title="'Email / Login'"
      :helper-text="$userValidator.login.$errors?.[0]?.$message"
      :class="{ 'input-text--error': $userValidator.login.$error }"
      @update:model-value="clearValidationError('login')"
      v-model="user.login"
    />

    <v-input
      class="input-text--default"
      :name="'login-password'"
      :title="'Password'"
      :type="'password'"
      :helper-text="$userValidator.password.$errors?.[0]?.$message"
      :class="{ 'input-text--error': $userValidator.password.$error }"
      @update:model-value="clearValidationError('password')"
      v-model="user.password"
    />

    <button type="submit" class="btn-main btn--transparent">
      login
    </button>
  </form>
</template>

<script setup lang="ts">
import type { TLoginValidationError } from "~/stores/auth/auth.types";
import type { TLoginForm } from "./the-login-form.types";
import type { TUser } from "~/stores/user/user.types";

import { REQUIRED_TEXT } from "./the-login-form.constants";

import VInput from "~/components/kit/v-input/v-input.vue";

import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { useAuthStore } from "~/stores/auth/auth";
import { useUserStore } from "~/stores/user/user";

const authStore = useAuthStore()
const userStore = useUserStore()

const user = ref<TLoginForm>({
  login: '',
  password: '',
})
const validationErrors = ref<Partial<TLoginForm>>({})

const $userValidator = useVuelidate<TLoginForm>({
  login: {
    required: helpers.withMessage(REQUIRED_TEXT, required),
  },
  password: {
    required: helpers.withMessage(REQUIRED_TEXT, required)
  }
}, user, {
  $externalResults: validationErrors
})

const clearValidationError = (field: keyof TLoginForm): void => {
  if (validationErrors.value.hasOwnProperty(field)) {

    delete validationErrors.value[field]

    $userValidator.value[field].$reset()
  }
}
const loginUser = async (): Promise<void> => {
  $userValidator.value.$touch()

  if (!$userValidator.value.$error) {
    await authStore.loginUser(user.value).then((user: TUser) => {
      userStore.setUser(user)
      authStore.setAuthState(true)

      navigateTo('/')
    }).catch((errors: TLoginValidationError[]) => {
      validationErrors.value = Object.fromEntries(errors.map((error: TLoginValidationError) => {
        return [error.errorType, error.errorText]
      }))
    })
  }
}
</script>

<style lang="scss">

</style>
