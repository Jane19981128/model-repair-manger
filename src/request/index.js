import axios from "axios";
import { notification } from "ant-design-vue";

const service = axios.create({
    baseURL: '/api/v1/chalk_line_manage_sevice',
    timeout: 7000,
});
service.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        notification.error({
            message: error.name,
            description: error.message
        });
        return Promise.reject(error);
    }
);
export default service;