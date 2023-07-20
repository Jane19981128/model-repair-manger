<template>
    <div>
        <a-modal :visible="visible" title="模型标记" @ok="handleOk" @cancel="handleOk" :body-style="bodyStyle">
            <template #footer>
                <a-button key="submit" @click="handleOk" type="primary">确定</a-button>
            </template>
            <div class="modal-content">
                <pre>{{ JSON.parse(drawingData.drawing) }}</pre>
            </div>
        </a-modal>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
const emit = defineEmits(['modalCancel']);
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    drawingData: {
        type: Object,
        default: ''
    }
});

const bodyStyle = {
    'padding': '10px 0px'
};
const handleOk = () => {
    emit('modalCancel', false);
};
</script>
<style scoped lang="scss">
.modal-content {
    max-height: calc(80vh - 150px);
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 6px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }

    &::-webkit-scrollbar-thumb {
        // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #e3e3e6;
        border-radius: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }
}
</style>