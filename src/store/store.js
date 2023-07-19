import { defineStore, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { computed, ref } from 'vue';

export const store = createPinia();
store.use(piniaPluginPersistedstate);

const key = 'qtoken';

export const useUserStore = defineStore('main', () => {
    const username = ref('');
    const token = ref('');

    function setUserInfo(_username, _token) {
        username.value = _username;
        token.value = _token;
    }

    function removeUser() {
        username.value = '';
        token.value = '';
    }

    function getToken() {
        return token;
    }

    function getUsername() {
        return username;
    }

    return { username, token, setUserInfo, removeUser, getToken, getUsername };
}, {
    persist: true
});