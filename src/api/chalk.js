import httpRequest from '../request/index';
import { store, useUserStore } from '../store/store';
import { storeToRefs } from "pinia";

const userStore = useUserStore(store);

const { getToken } = userStore;
// const { token } = storeToRefs(userStore);

export function apiChalkList(queryParams) {

    return httpRequest({
        method: 'get',
        url: `/manage/chalk`,
        params: {
            ...queryParams
        },
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiChalkRecord(chalkid) {
    return httpRequest({
        method: 'get',
        url: `/manage/chalk/${chalkid}`,
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiRecordDelete(queryParams) {
    const { chalkid, recordId } = queryParams;
    return httpRequest({
        method: 'delete',
        url: `/manage/chalk/${chalkid}/record/${recordId}`,
        headers: {
            Authorization: getToken().value
        }
    });
};

export function apiDrawingData(chalkid) {
    return httpRequest({
        method: 'get',
        url: `/manage/chalk/${chalkid}/drawing`,
        headers: {
            Authorization: getToken().value
        }
    });
};