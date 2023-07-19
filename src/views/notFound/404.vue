<template>
    <div class="header">
        <img src="~@/assets/home/logo_zi.png" alt="allfun" />
    </div>
    <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
        <template #extra>
            <a-button type="primary" @click="goHome">Back Home</a-button>
        </template>
    </a-result>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goHome = () => {
    router.push('/');
};
</script>
<style scoped lang="scss">
.header {
    width: 100%;
    height: 50px;
    background-color: #118cff;

    img {
        width: 170px;
        height: 100%;
    }
}
</style>