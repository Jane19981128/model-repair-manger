import httpRequest from '../request/index';
const qverseUrl = 'http://qverse3-test.3dnest.cn';

export function apiFloorModel(data, token = '') {

    return httpRequest({
        method: 'post',
        url: `${qverseUrl}/api/v1/e100/business/house_plan/model_data/`,
        data: data,
        headers: {
            Authorization: token
        }
    });
};