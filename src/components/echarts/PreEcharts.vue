<template>
    <div class="myEchart" :style="{ 'background-image': `url(${bgImage})` }" ref="chalkEcharts">
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    bgImageList: {
        type: [Array, String],
        default: () => []
    }
});

const formatSeries = (data, options, line = 'line') => {

    return {
        data: data,
        type: line,
        ...options
    };
};
const formatOptions = (replaceMerge = [], options = {}) => {

    return {
        replaceMerge: ['series', ...replaceMerge],
        ...options
    };
};
/**
 * 计算默认楼层的户型图和标记信息
 */

let bgImage = ref('');

onMounted(() => {
    const curFloorChalk = getCurFloorDrawing(0)[0];
    initEchart(curFloorChalk);
});

watch(() => props.data, () => {
    const [curFloorChalk, legend] = getCurFloorDrawing(0);
    const optionsOther = formatOptions(['legend']);

    chalkEchart.setOption(
        { series: curFloorChalk, legend: { data: legend } },
        optionsOther
    );
});

watch(() => props.bgImageList, (newVal) => {
    bgImage.value = props.bgImageList[0];
});

const getCurFloorDrawing = (i) => {
    const chalkList = props.data[i]?.drawing?.chalkList;
    if (Array.isArray(chalkList)) {
        const legend = [];
        const pointList = chalkList.map(item => {
            const lineList = item.pointList.map(line => {
                return [line[0] / 1000, line[1] / 1000];
            });

            legend.push(item.type);
            const options = {
                name: item.type,
                symbolSize: 15,
                symbol: 'triangle',
                // endLabel: {
                //     show: true,
                //     formatter: function (params) {
                //         return params.seriesName;

                //     }
                // }
            };

            return formatSeries(lineList, options);
        });
        return [pointList, legend];
    }

    return [];
};

/**
 * 初始化echarts图标
 */
const chalkEcharts = ref(null);
let chalkEchart;
const initEchart = (chalkData) => {
    chalkEchart = echarts.init(chalkEcharts.value);
    let option = {
        grid: {
            left: '10px',
            right: '10px',
            bottom: '10px',
            top: '50px',
            containLabel: true
        },
        legend: {
            data: chalkData.map(item => {
                return item.name;
            })
            // data: ['窗户', '剪刀', '墙', '切割']
        },
        xAxis: {
            min: -10,
            max: 10
        },
        yAxis: {
            min: -10,
            max: 10
        },
        series: chalkData,
    };

    chalkEchart.setOption(option);
};


</script>
<style scoped lang="scss">
.myEchart {
    width: 520px;
    height: 500px;
}
</style>