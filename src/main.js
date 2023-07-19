import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import router from './router';

import 'ant-design-vue/dist/antd.css';

import { store } from './store/store';
const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');