//写一个axios请求的封装
import axios, {
	AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import toast from "./toast";

const instance = axios.create({
	baseURL: "http://localhost:4321/api", //TODO: 先这样，后面再处理
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

instance.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 扩展请求配置，支持 toast 选项
interface RequestConfig extends AxiosRequestConfig {
	showSuccessToast?: boolean;
	showErrorToast?: boolean;
	successMessage?: string;
}

const request = <T>(url: string, config?: RequestConfig) => {
	const {
		showSuccessToast = false,
		showErrorToast = true,
		successMessage = "操作成功",
		...axiosConfig
	} = config || {};

	return instance({
		url,
		...axiosConfig,
	})
		.then((response: AxiosResponse) => {
			console.log('-----', response);
			if (response.data.success === false) {
				const errorMessage = response.data.message || "请求失败";
				if (showErrorToast) {
					toast.error(errorMessage);
				}
				return Promise.reject(new Error(errorMessage));
			}
			
			// 显示成功提示
			if (showSuccessToast) {
				toast.success(successMessage);
			}
			
			return response.data.data;
		})
		.catch((error: AxiosError) => {
			let errorMessage = "网络错误，请稍后重试";

			if (error.response) {
				const { status, data } = error.response;
				const errorData = data as { message?: string };
				// 根据状态码处理不同错误
				switch (status) {
					case 401:
						errorMessage = errorData?.message || "未授权，请重新登录";
						// 可以在这里处理登出逻辑
						break;
					case 403:
						errorMessage = errorData?.message || "拒绝访问";
						break;
					case 404:
						errorMessage = errorData?.message || "请求的资源不存在";
						break;
					case 500:
						errorMessage = errorData?.message || "服务器错误";
						break;
					default:
						errorMessage = errorData?.message || `请求错误：${status}`;
				}
			} else if (error.request) {
				errorMessage = "服务器无响应";
			} else {
				errorMessage = error.message;
			}

			// 打印错误信息
			console.error("请求错误:", errorMessage);
			
			// 显示 toast 错误提示
			if (showErrorToast) {
				toast.error(errorMessage, {
					duration: 4000, // 错误信息显示时间稍长一些
					position: 'top-right'
				});
			}

			return Promise.reject(error);
		}) as Promise<T>;
};

export default request;
