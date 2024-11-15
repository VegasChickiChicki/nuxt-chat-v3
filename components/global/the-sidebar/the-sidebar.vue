<template>
	<aside class="sidebar">
    <div class="sidebar__head">
      <div class="sidebar__settings">
        <button class="sidebar__settings-button btn-main btn--transparent" type="button" @click="setPopupState(true)">
          settings

          <nuxt-icon class="sidebar__settings-button-icon" name="gear-icon" filled />
        </button>

        <button class="sidebar__settings-button btn-main btn--transparent" type="button" @click="logout">
          logout

          <nuxt-icon class="sidebar__settings-button-icon" name="leave-icon" filled />
        </button>
      </div>
    </div>

    <div class="sidebar__content">
      <the-users-list />
    </div>
  </aside>

  <teleport to="body">
    <transition name="popup">
      <v-popup
        title="Profile settings"
        @close-popup="setPopupState(false)"
        v-if="popupState"
      >
        <the-user-settings />
      </v-popup>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import TheUsersList from "~/components/pages/chat/the-users-list/the-users-list.vue";
import TheUserSettings from "~/components/global/the-user-settings/the-user-settings.vue";
import VPopup from "~/components/kit/v-popup/v-popup.vue";

import { useUserStore } from "~/stores/user/user";
import { useAuthStore } from "~/stores/auth/auth";
import { useChatsStore } from "~/stores/chats/chats";
import { usePopup } from "~/composables/usePopup/usePopup";

const userStore = useUserStore();
const authStore = useAuthStore();
const chatsStore = useChatsStore();
const { popupState, setPopupState } = usePopup();

const logout = async (): Promise<void> => {
  await authStore.logoutUser().finally(() => {
    userStore.setUser(null)
    authStore.setAuthState(false)

    chatsStore.chats = []

    useCookie('authToken').value = null

    // TODO: Убрать костыль, middleware авторизации не успевает среагировать на изменение переменных state и authToken
    setTimeout(() => {
      navigateTo('/login')
    }, 10)
  });
};
</script>

<style lang="scss">
.sidebar{
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  grid-area: sidebar;

  border-left: 1px solid $main-color--light;

  &__head{
    width: 100%;
    height: var(--header-height);

    display: flex;
    justify-content: flex-end;
    align-items: stretch;
  }

  &__settings{
    width: 100%;
    height: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    .btn-main {
      width: 50%;
      height: 100%;

      border-top: none;

      font-size: 20px;

      &:nth-of-type(1){
        border-left: none;
      }

      &:nth-of-type(2){
        border-left: none;
        border-right: none;
      }
    }
  }

  &__settings-button {
    column-gap: 8px;
  }

  &__settings-button-icon {
    width: auto;
    height: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      fill: $helper-color--text;
    }
  }

  &__content{
    width: 100%;
    height: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  &__name{
    font-size: 24px;
    font-weight: 500;
    color: $main-color--text;
  }
}
</style>
