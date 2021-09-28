import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = Vue => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  axios.interceptors.request.use(config => {
    if (config !== 'login') {
      const AUTH_TOKEN = localStorage.getItem("token");
      if (AUTH_TOKEN) {
        config.headers.Authorization = AUTH_TOKEN
      }
    }
    return config
  }, err => { })
  axios.interceptors.response.use(res => {
    return res
  }, err => console.log('服务器响应失败'))
  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer