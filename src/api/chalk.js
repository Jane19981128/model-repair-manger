import httpRequest from '../request/index';
import { store, useUserStore } from '../store/store';
import { storeToRefs } from "pinia";

const userStore = useUserStore(store);

const { getToken } = userStore;
// const { token } = storeToRefs(userStore);

export function apiChalkList(queryParams) {

    return httpRequest({
        method: 'get',
        url: `/manage/model`,
        params: {
            ...queryParams
        },
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiChalkRecord(modelId) {
    return httpRequest({
        method: 'get',
        url: `/manage/model/${modelId}`,
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiRecordDelete(queryParams) {
    const { modelId, chalkId } = queryParams;
    return httpRequest({
        method: 'delete',
        url: `/manage/model/${modelId}/chalk/${chalkId}`,
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiDrawingData(query) {
    return httpRequest({
        method: 'get',
        url: `/manage/model/${query.modelId}/drawing`,
        params: { chalkId: query.chalkId },
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiModelChange(data) {
    return httpRequest({
        method: 'put',
        url: `/manage/model/${data.modelId}`,
        data: data,
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiRecordCancel(queryParams) {
    const { modelId, chalkId } = queryParams;
    return httpRequest({
        method: 'put',
        url: `/manage/model/${modelId}/chalk/${chalkId}`,
        params: {
            submitState: queryParams.submitState
        },
        headers: {
            Authorization: getToken().value
        }
    });
};