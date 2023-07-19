import { defineStore, createPinia } from 'pinia';
import { computed, ref } from 'vue';

export const store = createPinia();
const key = 'qtoken';

export const useUserStore = defineStore('main', () => {
    const username = ref('');
    const token = ref('');

    function setUserInfo(_username, _token) {
        username.value = _username;
        token.value = _token;
        localStorage.setItem(key, _token);
    }

    function removeUser() {
        username.value = '';
        token.value = '';
        localStorage.removeItem(key);
    }

    function getToken() {
        token.value = localStorage.getItem(key);
        return token;
    }

    return { username, token, setUserInfo, removeUser, getToken };
});