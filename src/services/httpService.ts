// import Taro from '@tarojs/taro'
// import {Router} from 'tarojs-router-next'
// import interceptors from './interceptors';
// TODO Interceptor
//  https://uniapp.dcloud.net.cn/api/interceptor.html
//  https://juejin.cn/post/7140512715453235207
// const interceptor = async function (chain) {
//     const requestParams = chain.requestParams
//
//     const {method, data, url} = requestParams
//     const res = await chain.proceed(requestParams)
//
//     console.log(`http <-- ${url} result:`, res)
//
//     if (res.statusCode === 401 || res.data.code === 0) {
//         Taro.removeStorageSync('Cookies')
//         const {confirm} = await Taro.showModal({
//             title: 'Warning',
//             content: 'Account Expired, Please Login',
//         })
//         if (confirm) {
//             Router.toLogin()
//             return // Prevent further execution
//         }
//     }
//
//     // if (res.data.code === 0) {
//     //   Taro.removeStorageSync('UserProfile')
//     // }
//
//     return res
// }

// uni.addInterceptor(interceptor)


// option: url:string, data:json, header:json
export default {
    request(option: any, method = "GET") {
        let token = uni.getStorageSync('x-token')
        return uni.request({
            ...option,
            method,
            header: {
                'content-type': "multipart/form-data; boundary=<calculated when request is sent>",
                'X-Token': token,
                ...option.header
            },
            success: ((res: any) => {
                if (res.data.code == 20000) {
                    uni.setStorageSync('x-token', res.header['X-Token'])
                }
            }),
        })
    },
    get(option: any) {
        return this.request(option, 'GET')
    },
    post(option: any) {
        return this.request(option, 'POST')
    }

}