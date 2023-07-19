<template>
    <div class="header">
        <img src="~@/assets/home/logo_zi.png" alt="allfun" />
        <a-dropdown>
            <a class="right-side" @click.prevent>
                <a-avatar>
                    <template #icon>
                        <UserOutlined />
                    </template>
                </a-avatar>
                <div class="avatar-name">
                    <span>{{ username }}</span>
                </div>
                <down-outlined />
            </a>
            <template #overlay>
                <a-menu>
                    <a-menu-item>
                        <a href="javascript:;" @click="exit()">退出</a>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>

    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/store';
import { UserOutlined, DownOutlined } from '@ant-design/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const { removeUser, getUsername } = userStore;
const username = getUsername();
const exit = () => {
    removeUser();
    router.push('/login');
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

    .right-side {
        cursor: pointer;
        height: 50px;
        position: absolute;
        margin-right: 20px;
        right: 0px;
        top: 0px;
        display: flex;
        align-items: center;
        color: #fff;
    }

    .right-side :hover {
        color: #ddd;
    }

    .avatar-name {
        margin: 0 10px;
    }
}
</style>