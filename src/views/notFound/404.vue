<template>
    <div class="not-found">
        <span>页面不存在!</span>
        <div>
            <a-button type="link" @click="goHome"> 返回首页</a-button>
        </div>
        <a-empty :description="null"></a-empty>
       
    </div>

</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
    router.push('/')
}
</script>
<style scoped>
.not-found{
    text-align: center;
    font-size: 40px;
    font-weight: 700;
    height: 100%;
    margin-top: 150px;
}
</style>