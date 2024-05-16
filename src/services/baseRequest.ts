export default {
    request(options: UniApp.RequestOptions) {
        let token = uni.getStorageSync('token')
        return uni.request({
            ...options,
            // method,
            header: {
                'content-type': "application/json",
                'X-Token': token,
                ...options.header
            },
        })
    },

    get(options: UniApp.RequestOptions) {
        options.method = 'GET'
        return this.request(options)
    },

    post(options: any) {
        options.method = 'POST'
        return this.request(options)
    }

}