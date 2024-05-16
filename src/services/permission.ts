export function handlePermission() {
    handleRequestPermission()
    handleRoutePermission()
}

function handleRequestPermission() {
    uni.addInterceptor('request', {
        success(res) {
            if (res.data.code === 20000) {
                const token = res.header['x-token']
                uni.setStorageSync('token', token)
                // console.log('set token: ', token)
            }
            else if (res.statusCode === 401 || res.data.code === 0) {
                uni.removeStorageSync('token')
                uni.showModal({
                    title: 'Warning',
                    content: 'Account Expired, Please Login',
                    success: async (res) => {
                        if (res.confirm) {
                            await uni.navigateTo({
                                url: '/pages/login/index'
                            })
                        }
                    }
                });
                return false
            }
        },
    })
}

const whiteList = [
    '/pages/login/index',
    '/pages/register/index',
    '/pages/index/index',
    '/pages/discover/index',
    '/pages/personal/index',
]

const routeTypes = ["navigateTo", "redirectTo"]

function handleRoutePermission() {
    routeTypes.forEach(item => {
        uni.addInterceptor(item, {
            invoke(e) {
                const token = uni.getStorageSync('token');
                // console.log('get token: ', token)
                const url = e.url;
                let isMatch = isMatchAnyStartWith(url, whiteList)
                if (!isMatch && !token) {
                    uni.removeStorageSync('token')
                    uni.showModal({
                        title: 'Warning',
                        content: 'Account Expired, Please Login',
                        success: async (res) => {
                            if (res.confirm) {
                                await uni.navigateTo({
                                    url: '/pages/login/index'
                                })
                            }
                        }
                    });
                    return false
                }
            },
        })
    })
}

function isMatchAnyStartWith(s: string, ss: string[]) {
    return ss.some(item => {
        return s.startsWith(item)
    })
}