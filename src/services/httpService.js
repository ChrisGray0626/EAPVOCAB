// import Taro from '@tarojs/taro'
// import {Router} from 'tarojs-router-next'
// import interceptors from './interceptors';

const interceptor = async function (chain) {
  const requestParams = chain.requestParams

  const { method, data, url } = requestParams
  const res = await chain.proceed(requestParams)

  console.log(`http <-- ${url} result:`, res)

  if (res.statusCode === 401 || res.data.code === 0) {
    Taro.removeStorageSync('Cookies')
    const { confirm } = await Taro.showModal({
      title: 'Warning',
      content: 'Account Expired, Please Login',
    })
    if (confirm) {
      Router.toLogin()
      return // Prevent further execution
    }
  }

  // if (res.data.code === 0) {
  //   Taro.removeStorageSync('UserProfile')
  // }

  return res
}

Taro.addInterceptor(interceptor)


// option: url:string, data:json, header:json
export default {
  request(option, method = "GET") {
    return Taro.request({
      ...option,
      method,
      header: {
        'content-type': 'application/json',
        ...option.header
      }
    })
  },
  get(option) {
    return this.request(option, 'GET')
  },
  post(option) {
    return this.request(option, 'POST')
  }

}