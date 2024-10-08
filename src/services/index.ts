import httpService from "./baseRequest";

const baseURL= "http://114.55.87.45:8001/"
// const baseURL = "api/"

/**
 * 获取用户信息
 */
export function fetchUserInfo() {
    return httpService.get({
        url: baseURL + "user/get_user_info",
    })
}

/**
 * 设置用户当前词汇库
 * @param data
 */
export function setCurrentVocLib(data: any) {
    return httpService.post({
        url: baseURL + "user/set_cur_lib",
        data: data,
    })
}

/**
 * 获取词汇库学习计划
 */
export function fetchVocLibStudyPlan(data: any) {
    return httpService.get({
        url: baseURL + "get_word_per_day?voc_lib_id=data.voc_lib_id",
    })
}

/**
 * 设置词汇库学习计划
 */
export function setVocLibStudyPlan(data: any) {
    return httpService.post({
        url: baseURL + "vocabulary/update_word_per_day?voc_lib_id=" + data.voc_lib_id + "&new_word_per_day=" + data.new_word_per_day,
        data: data,
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
 *  // ?voc_lib_id=" + 1 + "&voc_sec_id=" + 1,
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
 * 添加多个单词
 */
export function addWords(data: any) {
    return httpService.post({
        url: baseURL + "upload_words_by_dict",
        data: data,
    })
}

/**
 * 根据单词获取释义
 */
export function fetchExplanationFromWord(data: any) {
    return httpService.get({
        url: baseURL + "search_word?key=" + data.word,
    })
}

/**
 * 根据段落获取单词
 */
export function fetchWordsFromPassage(data: any) {
    return httpService.post({
        url: baseURL + "ai/get_important_words_for_passage",
        data: data,
    })
}

/**
 * 删除单个单词
 */
export function deleteWordItem(data: any) {
    return httpService.post({
        url: baseURL + "delete_one_word",
        data: data,
    })

}

/**
 * 获取用户的所有词库
 */
export function fetchUserVocLibs() {
    return httpService.get({
        url: baseURL + "get_vocabulary_lib",
    })
}


/**
 * 获取词库的单元
 */
export function fetchVocSection(data: any) {
    return httpService.get({
        url: baseURL + "get_vocabulary_sections?id=" + data.id,
    })
}

/**
 * 根据单词返回ai生成的问题
 */
export function fetchSelfQuiz(data: any) {
    return httpService.get({
        url: baseURL + "ai/get_ai_quiz?voc_lib_id=" + data.voc_lib_id,
    })
}

/**
 * 自测单词通过
 */
export function setWordQuizPass(data: any) {
    return httpService.post({
        url: baseURL + "pass_word",
        data: data,
    })
}

export function fetchInClassQuiz(data: any) {
    return httpService.post({
        url: baseURL + "in_class_quiz/get_in_class_quiz",
        data: data,
    })
}

export function setInClassQuizResult(data: any) {
    return httpService.post({
        url: baseURL + "in_class_quiz/set_in_class_quiz_result",
        data: data,
    })

}

/** 登录  */
export function handleLogin(data: any) {
    return httpService.post({
        url: baseURL + "user/login",
        data: data,
    })
}

/**
 * 发送注册请求
 */
export function handleRegister(data: any) {
    return httpService.post({
        url: baseURL + "user/register",
        data: data,
    })
}

/**
 * 发送注册验证码
 */
export function sendCaptcha(data: any) {
    return httpService.post({
        url: baseURL + "user/send_captcha",
        data: data,
    })
}