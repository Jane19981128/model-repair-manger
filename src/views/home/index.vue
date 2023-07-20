<template>
    <basic-header></basic-header>
    <div class="container">
        <search-box @searchKey="queryList"></search-box>
        <a-table :dataSource="dataSource" :columns="columns" :pagination="paginationProps" :loading="loading"
            :customRow="customRow" :rowClassName="rowClassChange" bordered @expand="expandHandle"
            :expandedRowKeys="expandedRowKeys">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'action'">
                    <div class="button-box">
                        <a-button type="primary" @click="detailDrawing(record)">详情</a-button>
                    </div>
                </template>
            </template>
            <template #expandedRowRender>
                <a-table :columns="innerColumns" :data-source="innerData.arr" :pagination="false">
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'action' && record.discard">
                            <div class="button-box">
                                <a-popconfirm title="确定删除该修模记录？" ok-text="是" cancel-text="否" @confirm="deleteRecord(record)"
                                    @cancel="deleteRecordPlanCancel">
                                    <a-button type="primary" danger>删除</a-button>
                                </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </template>
        </a-table>
        <drawing-box :visible="drawingBoxVisible" @modalCancel="drawingBoxCancel" :drawingData="drawingData"></drawing-box>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { ref, reactive, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { SUCCESS_CODE, LOGIN_CODE } from '@/constant/index';
import SearchBox from '@/components/searchBox.vue';
import DrawingBox from '@/components/DrawingBox.vue';
import BasicHeader from './components/BasicHeader.vue';

import { apiChalkList, apiChalkRecord, apiRecordDelete, apiDrawingData } from '@/api/chalk';

import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 列表
let current = ref(1);
let total = ref(0);
let pageCount = ref(10);
let loading = ref(false);
const paginationProps = reactive({
    current,
    total,
    pageSize: pageCount,
    onChange: (page, pageSize) => changeSearch(page, pageSize),
    showSizeChanger: true,
    showTotal: count => `共 ${count} 条`
});

let dataSource = reactive([]);

const stateList = ['未提交', '已提交'];

const columns = computed(() => {

    return [{
        title: '模型id',
        dataIndex: 'modelId',
        key: 'modelId'
    },
    {
        title: '模型版本',
        dataIndex: 'modelVersion',
        key: 'modelVersion',
    },
    {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
    },
    // {
    //     title: '状态',
    //     dataIndex: 'state',
    //     key: 'state',
    //     customRender: (state) => {
    //         return stateList[state.value];
    //     },
    // },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        customRender: (val) => {
            return dayjs(val.value).format('YYYY-MM-DD HH:mm:ss');
        },
        sorter: (a, b) => {

            return dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix();
        }
    },
    {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        customRender: (val) => {
            if (val.value) {
                return dayjs(val.value).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    },
    {
        title: '操作',
        key: 'action',
    }];
});

const changeSearch = (page, pageSize) => {
    current.value = page;
    pageCount.value = pageSize;
    queryList();
};

const queryList = (keyword, device) => {
    loading.value = true;
    const queryParams = {
        pageSize: pageCount.value,
        pageNum: current.value,
        keyword: keyword ? keyword.value : '',
        // state: state ? state.join(',') : [],
        deviceType: device ? device.join(',') : []
    };
    apiChalkList(queryParams).then(response => {
        loading.value = false;
        if (response.code === SUCCESS_CODE) {
            total.value = response.data.count;
            dataSource = response.data.rows.map(item => {
                item.key = item.id;
                return item;
            });
        }

        else if (response.code === LOGIN_CODE.SIGN_EXPIRED.code)
            router.push('/login');
        else {
            message.error(response.msg);
        }
    }).catch(() => {
        loading.value = false;
    });
};

/**
 * 选中行高亮
 */
const clickRow = ref('');
const customRow = (record) => {
    const onclickRow = (e) => {
        clickRow.value = record.chalkid;
    };

    return {
        onclick: onclickRow
    };
};
const rowClassChange = (record) => {
    if (record.chalkid === clickRow.value) {
        // return 'hight-light-row'
        return 'ant-table-row-selected';
    }

    return '';
};

/**
 * 删除已废弃的修模记录
 */
const deleteRecord = (row) => {
    const queryParams = {
        modelId: row.modelId,
        chalkId: row.chalkId
    };
    apiRecordDelete(queryParams).then(response => {
        if (response.code === SUCCESS_CODE) {
            const deleteRowIndex = innerData.arr.indexOf(row);
            innerData.arr.splice(deleteRowIndex, 1);
            message.success('删除成功！');
        } else if (response.code === LOGIN_CODE.SIGN_EXPIRED.code)
            router.push('/login');
        else {
            message.error(response.msg);
        }
    });
};
const deleteRecordPlanCancel = () => {
    message.info('取消删除！');
};

/**
 * 反复修模记录
 */
const innerData = reactive({
    arr: []
});
const expandedRowKeys = reactive([]);
const innerColumns = reactive([{
    title: '模型id',
    dataIndex: 'modelId',
    key: 'modelId',
},
{
    title: '修模id',
    dataIndex: 'chalkId',
    key: 'chalkId'
},
{
    title: '状态',
    dataIndex: 'submitState',
    key: 'submitState',
    customRender: (state) => {
        return stateList[state.value];
    }
},
{
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: (val) => {
        return dayjs(val.value).format('YYYY-MM-DD HH:mm:ss');
    }
},
{
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    customRender: (val) => {
        if (val.value) {
            return dayjs(val.value).format('YYYY-MM-DD HH:mm:ss');
        }
    }
},
    // {
    // title: '操作',
    // key: 'action',
    // }
]
);

const expandHandle = (expanded, record) => {
    if (expanded) {
        apiChalkRecord(record.modelId).then(response => {
            if (response.code === SUCCESS_CODE) {
                innerData.arr = response.data.map(element => {
                    element.modelId = record.modelId;
                    return element;
                });
                expandedRowKeys.length = 0;
                expandedRowKeys.push(record.key);
            } else if (response.code === LOGIN_CODE.SIGN_EXPIRED.code)
                router.push('/login');
            else {
                message.error(response.msg);
            }
        });
    } else {
        expandedRowKeys.pop(record.key);
    }
};

//查询详情
let drawingBoxVisible = ref(false);
let drawingData = reactive({});
const detailDrawing = (row) => {
    loading.value = true;
    apiDrawingData(row.modelId).then(response => {
        loading.value = false;
        if (response.code === SUCCESS_CODE) {
            drawingData = reactive(response.data);
            drawingBoxVisible.value = true;
        } else if (response.code === LOGIN_CODE.SIGN_EXPIRED.code)
            router.push('/login');
        else {
            message.error(response.msg);
        }
    });

};
const drawingBoxCancel = () => {
    drawingBoxVisible.value = false;
};

onMounted(() => {
    console.log(route);
    queryList();
});
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    background-color: #ffffff;
}

.button-box .ant-btn {
    margin-right: 8px;
}

.hight-light-row {
    background-color: #108ee9 !important;
    pointer-events: none
}

.editable-cell {
    position: relative;

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        margin-top: 4px;
        display: none;
    }

    .editable-cell-icon-check {
        line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
}

.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}
</style>