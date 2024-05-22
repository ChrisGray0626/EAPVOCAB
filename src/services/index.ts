import httpService from './baseRequest';

const baseURL= 'http://114.55.87.45:8001/'
// const baseURL = 'api/'

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
export function fetchUserInfo() {
    return httpService.get({
        url: baseURL + "user/get_user_info",
    })
}

/**
 * 获取用户的词汇库
 */
export function fetchVocabularyBank() {
    return httpService.get({
        url: baseURL + "get_vocabulary_bank",
    })
}

/**
 * 获取词汇库的词汇列表
 *  // ?voc_lib_id=' + 1 + '&voc_sec_id=' + 1,
 */
export function fetchWordsInSection(data: any) {
    return httpService.get({
        url: baseURL + "get_words_in_section?voc_lib_id=" + data.voc_lib_id + "&voc_sec_id=" + data.voc_sec_id,
    })
}

/**
 * 添加单个单词
 */
export function addWordItem(data: any) {
    return httpService.post({
        url: baseURL + "upload_one_word",
        data: data,
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
 * 根据单词返回ai生成的问题
 */
export function fetchAIQuestion4Word(data: any) {
    return httpService.get({
        url: baseURL + 'ai/get_ai_questions_for_word?word=' + data.word,
    })
}

/** 登录  */
export function handleLogin(data: any) {
    return httpService.post({
        url: baseURL + 'user/login',
        data: data,
        timeout: 100000,
    })
}

/**
 * 发送注册请求
 */
export function handleRegister(data: any) {
    return httpService.post({ // 这里用request
        url: baseURL + 'user/register',
        data: data,
        timeout: 100000,
    })
}

/**
 * 发送注册验证码
 */
export function sendVerificationCode(data: any) {
    return  httpService.post({ // 这里用request
        url: baseURL + 'user/send_captcha',
        data: data,
        timeout: 100000,
    })
}