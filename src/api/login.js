import httpRequest from '../request/index';

export function apiLogin(data) {
    return httpRequest({
        method: 'post',
        url: `/manage/permit`,
        data: {
            ...data
        }
    });
};