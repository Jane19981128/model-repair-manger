import httpRequest from '../request/index';

export function apiChalkList(queryParams) {
    return httpRequest({
        method: 'get',
        url: `/manage/chalk`,
        params: {
            ...queryParams
        },
    });
};

export function apiChalkRecord(chalkid) {
    return httpRequest({
        method: 'get',
        url: `/manage/chalk/${chalkid}`
    });
};

export function apiRecordDelete(queryParams) {
    const { chalkid, recordId } = queryParams;
    return httpRequest({
        method: 'delete',
        url: `/manage/chalk/${chalkid}/record/${recordId}`
    });
};

export function apiDrawingData(chalkid) {
    return httpRequest({
        method: 'get',
        url: `/manage/chalk/${chalkid}/drawing`
    });
};