<template>
    <div class="myEchart"
        :style="{ 'height': `${imageHeight}px`, 'background-image': `url(${bgImage})`, 'background-size': `${bgWidth}px auto` }"
        ref="chalkEcharts">
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import * as echarts from 'echarts';

import request from '../../request/index';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    bgImageList: {
        type: [Array, String]
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
let bgWidth = ref(500);
let myEchart;
const repairType = new Map([
    ['trim', '裁剪'], ['window', '窗'], ['mirror', '镜子'], ['wall', '补墙']
]);

onMounted(() => {
    myEchart = initEchart();

    if (!props.bgImageList) {
        bgImage.value = '';
        return message.error('户型图缺失！');
    }

    bgImage.value = props.bgImageList[0];
    changeEchart(myEchart);
});

watch([() => props.bgImageList, () => props.data], () => {
    if (!props.bgImageList) {
        bgImage.value = '';
        myEchart.setOption({ series: [], }, formatOptions());
        return message.error('户型图缺失！');
    }

    bgImage.value = props.bgImageList[0];
    changeEchart(myEchart);

});

let imageHeight = ref(500);
const changeEchart = async (echartsInstance) => {
    const [curFloorChalk, legend] = getCurFloorDrawing(0);
    const optionsOther = formatOptions(['legend']);

    const { width, height } = await fetchOSSFileProp(bgImage.value);
    const floorSize = {
        width: width / 200,
        height: height / 200
    };

    let { xAxisMax, yAxisMax } = edgeValue(curFloorChalk, floorSize);
    xAxisMax = xAxisMax + 0.2;
    yAxisMax = yAxisMax + 0.2;

    bgWidth.value = (width / 200) * 500 / xAxisMax;
    const newHeight = (Math.abs(yAxisMax) * 2) * 100;
    imageHeight.value = (newHeight / width) * bgWidth.value + 20;

    nextTick(() => {
        echartsInstance.resize();
    });

    const xAxis = {
        max: xAxisMax,
        min: -xAxisMax
    };

    const yAxis = {
        max: yAxisMax,
        min: -yAxisMax
    };

    echartsInstance.setOption(
        {
            series: curFloorChalk,
            legend: { data: legend },
            xAxis: xAxis,
            yAxis: yAxis
        },
        optionsOther);

};

// 获取oss图片宽高信息
async function fetchOSSFileProp(url) {
    try {
        const OSS_INFO_QUERY = 'x-oss-process=image/info';

        const imageInfo = await request
            .get(`${url}?${OSS_INFO_QUERY}`);

        return {
            width: parseInt(imageInfo.ImageWidth.value),
            height: parseInt(imageInfo.ImageHeight.value)
        };
    } catch (error) {
        return {
            width: 0,
            height: 0
        };
    }
}

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

const edgeValue = (array, floorSize) => {
    const xAxisArray = [];
    const yAxisArray = [];

    array.forEach(item => {
        if (Array.isArray(item.data)) {
            const data = item.data;

            data.forEach(point => {
                xAxisArray.push(Math.abs(point[0]));
                yAxisArray.push(Math.abs(point[1]));
            });
        }

    });

    return {
        xAxisMax: Math.max(...xAxisArray, floorSize.width),
        yAxisMax: Math.max(...yAxisArray, floorSize.height)
    };


};


/**
 * 初始化echarts图表
 */
const chalkEcharts = ref(null);
const initEchart = () => {

    let chalkEchart = echarts.init(chalkEcharts.value);

    let option = {
        grid: {
            left: '10px',
            right: '10px',
            bottom: '0px',
            top: '20px',
            containLabel: false
        },
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
    background-repeat: no-repeat;
    background-position: 50% calc(50% + 10px);
}
</style>