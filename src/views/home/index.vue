<template>
    <div class="header">
        <img src="~@/assets/home/logo_zi.png" alt="allfun" />
    </div>
    <div class="container">
        <search-box @searchKey="queryList"></search-box>
        <a-table :dataSource="dataSource" :columns="columns" :pagination="paginationProps" :loading="loading"
            :customRow="customRow" :rowClassName="rowClassChange" bordered @change="handleChange" @expand="expandHandle"
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
import { SUCCESS_CODE } from '@/constant/index';
import SearchBox from '@/components/searchBox.vue';
import { apiChalkList, apiChalkRecord, apiRecordDelete, apiDrawingData } from '@/api/chalk';
import DrawingBox from '@/components/DrawingBox.vue';
import { useUserStore } from '@/store/store';

const user_store = useUserStore();

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

const stateList = ['未制作', '制作种', '制作完成', '制作失败'];
const filters = [{
    text: 'L',
    value: 'L',
}, {
    text: 'N',
    value: 'N',
}, {
    text: 'X',
    value: 'X',
}];
const filteredInfo = ref();
const columns = computed(() => {
    const filtered = filteredInfo.value || {};
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
        filters: filters,
        filteredValue: filtered.deviceType,
        onFilter: (value, record) => record.deviceType.includes(value)
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        customRender: (state) => {
            return stateList[state.value];
        },
        filters: [{
            text: '未制作',
            value: 0,
        }, {
            text: '制作中',
            value: 1,
        }, {
            text: '制作完成',
            value: 2,
        }, {
            text: '制作失败',
            value: 3,
        }],
        filteredValue: filtered.state,
        onFilter: (value, record) => record.state == value
    },
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

const handleChange = (pagination, filters, sorter) => {
    filteredInfo.value = filters;
    console.log(filters, sorter);
};

const changeSearch = (page, pageSize) => {
    current.value = page;
    pageCount.value = pageSize;
    queryList();
};

const queryList = (keyword, state, device) => {
    loading.value = true;
    const queryParams = {
        pageSize: pageCount.value,
        pageNum: current.value,
        keyword: keyword ? keyword.value : '',
        state: state ? state.join(',') : [],
        device: device ? device.join(',') : []
    };
    apiChalkList(queryParams).then(response => {
        if (response.code === SUCCESS_CODE) {
            total.value = response.data.count;
            dataSource = response.data.rows.map(item => {
                item.key = item.id;
                return item;
            });
        }
        loading.value = false;
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
        chalkid: row.chalkid,
        recordId: row.id
    };
    apiRecordDelete(queryParams).then(response => {
        if (response.code === SUCCESS_CODE) {
            const deleteRowIndex = innerData.arr.indexOf(row);
            innerData.arr.splice(deleteRowIndex, 1);
            message.success('删除成功！');
        } else {
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
const discardList = ['正常', '废弃'];
const innerColumns = reactive([{
    title: '模型id',
    dataIndex: 'modelId',
    key: 'modelId',
}, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    customRender: (state) => {
        return stateList[state.value];
    }
}, {
    title: '废弃',
    dataIndex: 'discard',
    key: 'discard',
    customRender: (state) => {
        return discardList[state.value];
    }
}, {
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
}, {
    title: '操作',
    key: 'action',
}]
);

const expandHandle = (expanded, record) => {
    if (expanded) {
        apiChalkRecord(record.chalkid).then(response => {
            if (response.code === SUCCESS_CODE) {
                innerData.arr = response.data.map(element => {
                    element.modelId = record.modelId;
                    return element;
                });
                expandedRowKeys.length = 0;
                expandedRowKeys.push(record.key);
            } else {
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
    apiDrawingData(row.chalkid).then(response => {
        if (response.code === SUCCESS_CODE) {
            drawingData = reactive(response.data);
            drawingBoxVisible.value = true;
        } else {
            message.error(response.msg);
        }
        loading.value = false;
    });

};
const drawingBoxCancel = () => {
    drawingBoxVisible.value = false;
};

onMounted(() => {
    queryList();
});
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
}

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