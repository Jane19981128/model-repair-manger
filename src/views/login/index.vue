<template>
    <a-spin :tip="tip" :spinning="loading">
        <div class="container">
            <img src="@/assets/login/logo-big-new.png">
            <div id="login_box">
                <h2>LOGIN</h2>
                <a-form ref="formRef" :model="formData" :rules="rules">
                    <a-form-item name="username">
                        <div class="input-box">
                            <a-input :bordered="false" style="border-bottom: 2px solid #fff;"
                                v-model:value="formData.username" placeholder="请输入用户名" />
                        </div>
                    </a-form-item>

                    <a-form-item name="password">
                        <div class="input-box">
                            <a-input-password :bordered="false" style="border-bottom: 2px solid #fff;"
                                v-model:value="formData.password" placeholder="请输入密码" />
                        </div>
                    </a-form-item>

                    <a-form-item>
                        <div class="login-button">
                            <a-button type="text" @click="triggerLogin" style="color: #d9d9d9;">登 录</a-button>
                        </div>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </a-spin>
</template>
<script setup>
import { ref, reactive, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { apiLogin } from '@/api/login';
import { SUCCESS_CODE, LOGIN_CODE as LC } from '@/constant/index';
import { useUserStore } from '@/store/store';

import { debounce } from '../../../utils/index';

const router = useRouter();

const userStore = useUserStore();
const { setUserInfo } = userStore;

const formRef = ref();
const formData = reactive({
    username: '',
    password: ''
});

const rules = reactive({
    username: [{
        required: true, trigger: 'blur', message: "用户名不能为空!"
    }],
    password: [{ required: true, trigger: 'blur', message: '密码不能为空!' }]
});

const tip = ref('登录中...');
const loading = ref(false);

const onSubmit = async () => {
    formRef.value.validate().then(() => {
        loading.value = true;
        apiLogin(formData).then(response => {
            if (response.code === SUCCESS_CODE) {
                //将token和用户信息存入state
                setUserInfo(formData.username, response.data);
                router.push('/chalk');
            }

            if (response.code === LC.PARAM_ERROR.code)
                message.error(LC.PARAM_ERROR.message);

            if (response.code === LC.NOT_FOUND.code)
                message.error(LC.NOT_FOUND.message);
            loading.value = false;
        }).catch(error => {
            loading.value = false;
            message.error(error);
        });

    }).catch(error => {
        console.log('error', error);
    });
};

const triggerLogin = debounce(function () {
    onSubmit();
});
</script>
<style scoped>
.ant-input {
    caret-color: #fff;
    color: #fff;
}

.ant-input-password-icon svg {
    color: #d9d9d9;
}

.container {
    min-height: 100vh;
    background: url('../../assets/login/manager_house_bg.jpg') no-repeat;
    background-size: 100% 100%;
    padding-top: 10%;
}

img {
    position: absolute;
    top: 20px;
    left: 5px;
    height: 50px;
}

#login_box {
    width: 20%;
    height: 350px;
    background-color: #00000060;
    margin: auto;
    text-align: center;
    border-radius: 10px;
    padding: 50px 50px;
}

h2 {
    color: #ffffff90;
    margin-top: 5%;
}

.input-box {
    margin: 3% auto;
    width: 70%;
}

.login-button {
    margin: 20px auto 0;
    width: 70%;
    height: 32px;
    border-radius: 10px;
    text-align: center;
    background-image: linear-gradient(to right, #30cfd0, #330867);
}

#sign_up {
    margin-top: 45%;
    margin-left: 60%;
}
</style>