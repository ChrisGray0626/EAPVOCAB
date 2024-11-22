import {handleAccountExpired} from "@/api/permission";
import type {Response} from "@/type";

async function request(options: UniApp.RequestOptions) {
  let token = uni.getStorageSync('token')
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      header: {
        'content-type': "application/json",
        'X-Token': token,
        ...options.header
      },
      success(result) {
        const res = result.data as Response<any>;
        // console.log('res: ', res)
        if (res.code === 20000) {
          const token = result.header['x-token']
          uni.setStorageSync('token', token)
        } else if (result.statusCode === 401) {
          handleAccountExpired()
          return false
        }
        // Handle other exceptions
        else {
          setTimeout(() => {
              uni.showToast({
                title: res.msg,
                icon: 'error',
              })
            },
            1000
          )
          console.error(res.msg)
        }
        resolve(res);
      },
      fail(result) {
        console.warn(result);
        uni.showToast({
          title: 'Network Error',
          icon: 'error',
        })
        reject(result);
      },
      complete(result) {
        uni.hideToast()
      },
    });
  }).catch((error) => {
    console.error(error)
  })
}

export function get(options: UniApp.RequestOptions) {
  options.method = 'GET'
  return request(options)
}

export function post(options: UniApp.RequestOptions) {
  options.method = 'POST'
  return request(options)
}