import {AxiosHelperConfig} from "@itning/axios-helper";

AxiosHelperConfig.errorMsgImpl = {
  showErrorToast(title, data) {
    let msg;
    if (typeof data === "string") {
      msg = data;
    } else {
      msg = data.msg;
    }
    alert(`${title}:${msg}`);
    AxiosHelperConfig.onceMsgFinish();
  }
};
AxiosHelperConfig.axiosInstanceBuilder
  .timeOut(1000 * 12)
  .requestInterceptor({
    onFulfilled: request => {
      let token = window.localStorage.getItem('authorization_token');
      if (token !== undefined) {
        request.headers = {
          "Authorization": token,
          "Accept": "application/json"
        };
      } else {
        request.headers = {"Accept": "application/json"};
      }
      return request;
    },
    onRejected: error => Promise.reject(error)
  })
  .responseInterceptor({
    onFulfilled: response => Promise.resolve(response),
    onRejected: error => {
      if (error.response === undefined) {
        return Promise.reject(error);
      }
      if (error.response.status) {
        switch (error.response.status) {
          case 401:
            window.localStorage.setItem('last_path', window.location.pathname);
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
            break;
          case 403:
            console.warn('权限不足');
            break;
          case 404:
            console.warn('请求URL不存在');
            break;
          case 500:
            console.warn('服务器错误');
            break;
          case 503:
            console.warn('服务器错误');
            break;
          default:
            console.warn(error);
        }
        return Promise.reject(error);
      }
    }
  })
  .build();

