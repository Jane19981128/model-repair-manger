<template>
    <div class="search-box">
        <a-input-search v-model:value="search" placeholder="请输入模型id" enter-button="搜索" @search="onSearch"></a-input-search>
        <a-button type="link" @click="showCheckBoxChange">{{ openTip }}</a-button>
    </div>
    <div v-show="showCheckBox">
        <!-- <a-row type="flex">
            <a-col flex="80px">状态：</a-col>
            <a-col flex="auto">
                <a-checkbox :checked="checkState.checkAll" :indeterminate="checkState.indeterminate"
                    @change="onCheckAllChange">
                    全选</a-checkbox>
                <a-checkbox-group v-model:value="checkState.checkedList" :options="options.state" />
            </a-col>
        </a-row> -->
        <a-row type="flex">
            <a-col flex="80px">设备类型：</a-col>
            <a-col flex="auto">
                <a-checkbox :checked="checkDevice.checkAll" :indeterminate="checkDevice.indeterminate"
                    @change="onCheckAllChangeDevice">
                    全选</a-checkbox>
                <a-checkbox-group v-model:value="checkDevice.checkedList" :options="options.device" />
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';

const emit = defineEmits(['searchKey']);
const search = ref('');

const onSearch = () => {
    emit('searchKey', search, checkDevice.checkedList);
};

/**
 * 展开选项
 */
const showCheckBox = ref(false);
const openTip = ref('展开选项');
const showCheckBoxChange = () => {
    showCheckBox.value = !showCheckBox.value;
    openTip.value = showCheckBox.value ? '关闭选项' : '展开选项';
};

const options = reactive({
    // state: [{
    //     label: '未制作',
    //     value: 0
    // }, {
    //     label: '制作中',
    //     value: 1
    // }, {
    //     label: '制作完成',
    //     value: 2
    // }, {
    //     label: '制作失败',
    //     value: 3
    // }],
    device: ['N', 'L', 'X']
});

/**
 * 状态复选框控制
 */
// const checkState = reactive({
//     indeterminate: false,
//     checkAll: true,
//     checkedList: options.state.map(item => {
//         return item.value;
//     })
// });

// const onCheckAllChange = (e) => {
//     const optionsState = options.state.map(item => {
//         return item.value;
//     });
//     checkState.checkedList = e.target.checked ? optionsState : [];
// };

// watch(() => checkState.checkedList, val => {
//     checkState.indeterminate = !!val.length && val.length < options.state.length;
//     checkState.checkAll = val.length === options.state.length;
// });

/**
 * 设备类型复选框控制
 */
const checkDevice = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: options.device
});

const onCheckAllChangeDevice = (e) => {
    checkDevice.checkedList = e.target.checked ? options.device : [];
};

watch(() => checkDevice.checkedList, val => {
    checkDevice.indeterminate = !!val.length && val.length < options.device.length;
    checkDevice.checkAll = val.length === options.device.length;
});
</script>
<style lang="scss" scoped>
.search-box {
    margin: 20px auto 10px;
    display: flex;
    justify-content: space-between;
    width: 400px;
}

.btn-box {
    position: absolute;
    right: 200px;
    top: 70px;

    button {
        margin: 0 10px;
    }
}
</style>