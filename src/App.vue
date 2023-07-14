<template>
  <ConfigProvider :locale="zhCN">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive"></component>
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive"></component>
    </router-view>
  </ConfigProvider>
</template>

<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ConfigProvider } from 'ant-design-vue';
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
}
</style>
