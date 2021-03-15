import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import requestConfig from '@/utils/config'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: requestConfig.Timeout // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      /* let each request carry token
      ['X-Token'] is a custom headers key
      please modify it according to the actual situation */
      // config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    
    // do something with request error
    console.log(error,'---------------') // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 对响应数据做点什么
    
    const res = response.data
    return res

    /* // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    } */
  },
  error => {
   
    /* if (error && error.response) {
      switch (error.response.status) {
          case 400:
              error.message = '错误请求' ; Message({message: '错误请求', type: 'error'});
              break
          case 401:
              error.message = '未授权，请重新登录' ; Message({message: '未授权，请重新登录', type: 'warning'});
              break
          case 403:
              error.message = '拒绝访问' ; Message({message: '拒绝访问', type: 'warning'});
              break
          case 404:
              error.message = '请求错误,未找到该资源' ; Message({message: '请求错误,未找到该资源', type: 'error'});
              break
          case 405:
              error.message = '请求方法未允许' ; Message({message: '请求方法未允许', type: 'info'});
              break
          case 408:
              error.message = '请求超时' ; Message({message: '请求超时', type: 'info'});
              break
          case 500:
              error.message = '服务器端出错' ; Message({message: '服务器端出错', type: 'error'});
              break
          case 501:
              error.message = '网络未实现' ; Message({message: '网络未实现', type: 'info'});
              break
          case 502:
              error.message = '网络错误' ; Message({message: '网络错误', type: 'error'});
              break
          case 503:
              error.message = '服务不可用' ; Message({message: '服务不可用', type: 'info'});
              break
          case 504:
              error.message = '网络超时' ; Message({message: '网络超时', type: 'warning'});
              break
          case 505:
              error.message = 'http版本不支持该请求' ; Message({message: 'http版本不支持该请求', type: 'warning'});
              break
          default:
              error.message = `连接错误${error.response.status}`  ; Message({message: `'连接错误'${error.response.status}`, type: 'warning'});
      }
    } */
    // console.log(error.response,'---------------') // for debug
    if(!error.response){
      Message({
        message: '网络错误！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject()
    }
    /* Message({
      message: error.response.data,
      type: 'error',
      duration: 5 * 1000
    }) */
    return Promise.reject(error.response.data)
  }
)

export default service
