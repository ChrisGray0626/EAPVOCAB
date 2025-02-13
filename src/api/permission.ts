export function handlePermission() {
    handleRoutePermission()
}

const whiteList = [
    '/pages/login/index',
    '/pages/register/index',
    '/pages/index/index',
    '/pages/discover/index',
    '/pages/personal/index',
    '/pages/userAgreement/index',
    '/pages/resetpw/index',
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
                    handleAccountExpired()
                    return false
                }
            },
        })
    })
}

export function handleAccountExpired() {
    uni.clearStorageSync()
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
}

function isMatchAnyStartWith(s: string, ss: string[]) {
    return ss.some(item => {
        return s.startsWith(item)
    })
}