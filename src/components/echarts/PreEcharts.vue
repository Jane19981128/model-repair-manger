<template>
    <div class="myEchart" :style="{ 'height': `${imageHeight}px`, 'background-image': `url(${bgImage})` }"
        ref="chalkEcharts">
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
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
let myEchart;
const repairType = new Map([
    ['trim', '裁剪'], ['window', '窗'], ['mirror', '镜子'], ['wall', '补墙']
]);

onMounted(() => {
    myEchart = initEchart();
    changeEchart(myEchart);
});

watch(() => props.data, () => {
    changeEchart(myEchart);
});

watch(() => props.bgImageList, (newVal) => {
    bgImage.value = props.bgImageList[0];
    setBgImageSize(bgImage.value);

});

const changeEchart = (echartsInstance) => {
    const [curFloorChalk, legend] = getCurFloorDrawing(0);
    const [edgeMax, edgeMin] = edgeValue(curFloorChalk);
    const optionsOther = formatOptions(['legend', 'xAxis', 'yAxis']);

    const axis = {
        max: edgeMax,
        min: edgeMin
    };

    echartsInstance.setOption(
        {
            series: curFloorChalk,
            legend: { data: legend },
            xAxis: axis,
            yAxis: axis
        },
        optionsOther);

};

let imageHeight = ref(500);
const setBgImageSize = (url) => {
    var img = new Image();
    img.src = url;
    img.onload = () => {
        imageHeight.value = (img.height / img.width) * 520 + 20;

        nextTick(() => {
            myEchart.resize();
        });
    };
};

const getCurFloorDrawing = (i) => {
    const chalkList = props.data[i]?.drawing?.chalkList;
    if (Array.isArray(chalkList)) {
        const legend = [];
        const pointList = chalkList.map(item => {
            const lineList = item.pointList.map(line => {
                return [line[0] / 1000, line[1] / 1000];
            });

            const name = repairType.get(item.type);
            legend.push(name);

            const options = {
                name,
                symbolSize: 10,
                // symbol: 'triangle',
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

const edgeValue = (array) => {
    const newArray = [];

    array.forEach(item => {
        if (Array.isArray(item.data)) {
            const data = item.data;

            data.forEach(point => {
                newArray.push(...point);
            });
        }

    });

    return [Math.max(...newArray), Math.min(...newArray)];
};


/**
 * 初始化echarts图标
 */
const chalkEcharts = ref(null);
const initEchart = () => {

    let chalkEchart = echarts.init(chalkEcharts.value);

    let option = {
        grid: {
            left: '0px',
            right: '0px',
            bottom: '0px',
            top: '20px',
            containLabel: false
        },
        // legend: {
        //     data: repairType
        // },
        xAxis: {
            min: -10,
            max: 10
        },
        yAxis: {
            min: -10,
            max: 10
        }
    };

    chalkEchart.setOption(option);

    return chalkEchart;
};


</script>
<style scoped lang="scss">
.myEchart {
    width: 100%;
    // background-color: aqua;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% calc(50% + 10px);
}
</style>