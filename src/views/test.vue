<template>
    <a-form :model="formData" @finish="onFinish" @finishFailed="onFinishFailed" :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <div class="input-box">
            <a-form-item name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
                <a-input :bordered="false" style="border-bottom: 2px solid #fff;" v-model:value="formData.username"
                    placeholder="请输入用户名" />
            </a-form-item>
        </div>

        <div class="input-box">
            <a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input-password :bordered="false" style="border-bottom: 2px solid #fff;" v-model:value="formData.password"
                    placeholder="请输入密码" />
            </a-form-item>
        </div>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
    </a-form>
</template>
<script setup>
import { reactive } from 'vue';
const labelCol = {
    span: 0,
};
const wrapperCol = {
    span: 17,
};
const formData = reactive({
    username: '',
    password: '',
});
const onFinish = values => {
    console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};
</script>
<style>
.ant-input {
    caret-color: #fff;
    color: #fff;
    /* 将文字颜色设置为红色（您可以根据需要修改颜色值）*/
}

.ant-input-password-icon svg {
    color: #d9d9d9;
    /* 将图标颜色设置为蓝色（您可以根据需要修改颜色值）*/
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
    padding: 15px 0px 0px;
    margin: 5% auto;
    width: 70%;
}

.login-button {
    margin: 40px auto 0;
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