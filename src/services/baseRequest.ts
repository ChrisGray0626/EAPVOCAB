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