<template>
    <div>
        <a-modal :visible="visible" title="模型标记" @ok="handleOk" @cancel="handleOk" :body-style="bodyStyle" :width="620">
            <template #footer>
                <a-button key="submit" @click="handleOk" type="primary">确定</a-button>
            </template>
            <div v-if="type === 'ECHARTS'">
                <pre-echarts :data="echartData" :bgImageList="bgImageList"></pre-echarts>
            </div>
            <div class="modal-content" v-if="type === 'JSON'">
                <json-viewer :value="drawing" :expand-depth=10 :copyable="true" collapse></json-viewer>
            </div>
        </a-modal>
    </div>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { apiFloorModel } from '@/api/m100';
import PreEcharts from './echarts/PreEcharts.vue';
import { SUCCESS_CODE } from '@/constant/index';

const emit = defineEmits(['modalCancel']);
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    type: {
        //type可选值JSON，ECHARTS
        type: String,
        default: 'JSON'
    },
    drawingData: {
        type: Object,
        default: {}
    }
});

let drawing;
watch(() => props.visible, (newVal) => {
    if (newVal) {
        drawing = reactive(JSON.parse(props.drawingData.drawing ?? {}));
        formatEchartsData(drawing);
    }

});

let echartData = [];
let bgImageList = ref('');
const formatEchartsData = (drawing) => {
    if (props.type === "ECHARTS") {
        bgImageList.value = JSON.parse(props.drawingData.mapUrl);
        echartData = reactive(drawing.list ?? []);
    }
};

// const getFloorImage = async () => {
//     const { modelId, modelVersion } = props.drawingData;
//     const queryData = {
//         model_id: modelId,
//         model_version: modelVersion
//     };

//     const response = await apiFloorModel(queryData);
//     const bgImageList = [];

//     if (response.code === SUCCESS_CODE) {
//         response.data.forEach(item => {
//             bgImageList.push(item.info.planformUrl);
//         });
//     }

//     return bgImageList;
// };

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