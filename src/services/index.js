import httpService from "./httpService";


// const baseURL= 'http://114.55.87.45:8001/'
const baseURL = 'api/'

/**
 * 获取词汇bank
 */
export function getVocabularyBank() {
    return httpService.get({
        url: baseURL + "get_vocabulary_bank",
    })
}

/**
 * 获取用户信息
 */
export function getUserProfile() {
    return httpService.get({
        url: baseURL + "/user/get_user_info",
    })
}

/**
 * 获取词汇表
 */
export function getVocabularyLib() {
    return httpService.get({
        url: baseURL + 'get_vocabulary_lib',
    })
}


/**
 * 根据lib_id和section_id获取单词列表
 *  // ?voc_lib_id=' + 1 + '&voc_sec_id=' + 1,
 */
export function getWordsInSection(query) {
    return httpService.get({
        url: baseURL + 'get_words_in_section',
        data: query
    })
}

/**
 * 根据单词返回ai生成的问题
 */
export function getAiQs(query) {
    return httpService.get({
        url: baseURL + 'ai/get_ai_questions_for_word',
        data: query
    })
}

/** 登录  */
export function handleLogin(data) {
    return httpService.post({
        url: baseURL + 'user/login',
        data: data,
        timeout: 100000,
    })
}

/**
 * 发送注册请求
 */
export function handleRegister(data, cookie) {
    return httpService.post({ // 这里用request
        url: baseURL + 'user/register',
        data: data,
        timeout: 100000,
    })
}

/**
 * 发送注册验证码
 */
export function sendVerificationCode(data) {
    return  httpService.post({ // 这里用request
        url: baseURL + 'user/send_captcha',
        data: data,
        timeout: 100000,
    })
}