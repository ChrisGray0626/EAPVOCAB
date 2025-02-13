import {get, post} from "@/api/request";

const baseURL= "http://114.55.87.45:8001/"

/**
 * 获取用户信息
 */
export function fetchUserInfo() {
    return get({
        url: baseURL + "user/get_user_info",
    })
}

/**
 * 设置当前词汇库
 * @param data
 */
export function setCurrentVocLib(data: any) {
    return post({
        url: baseURL + "user/set_cur_lib",
        data: data,
    })
}

/**
 * 获取词汇库学习计划
 */
export function fetchVocLibLearningPlan(data: any) {
    return post({
        url: baseURL + "get_word_per_day",
        data: data,
    })
}

/**
 * 设置词汇库学习计划
 */
export function setVocLibLearningPlan(data: any) {
    return post({
        url: baseURL + "update_word_per_day",
        data: data,
    })
}

/**
 * 获取 Word Bank
 */
export function fetchVocabularyBank() {
    return get({
        url: baseURL + "get_vocabulary_bank",
    })
}

/**
 * 获取词汇库的词汇列表
 */
export function fetchWordsInSection(data: any) {
    return get({
        url: baseURL + "get_words_in_section?voc_lib_id=" + data.voc_lib_id + "&voc_sec_id=" + data.voc_sec_id,
    })
}

/**
 * 添加单个单词
 */
export function addWordItem(data: any) {
    return post({
        url: baseURL + "upload_one_word",
        data: data,
    })
}

/**
 * 添加多个单词
 */
export function addWords(data: any) {
    return post({
        url: baseURL + "upload_words_by_dict",
        data: data,
    })
}

/**
 * 根据单词获取释义
 */
export function fetchExplanationFromWord(data: any) {
    return get({
        url: baseURL + "search_word?key=" + data.word,
    })
}

/**
 * 根据段落获取单词
 */
export function fetchWordsFromPassage(data: any) {
    return post({
        url: baseURL + "ai/get_important_words_for_passage",
        data: data,
    })
}

/**
 * 删除单个单词
 */
export function deleteWordItem(data: any) {
    return post({
        url: baseURL + "delete_one_word",
        data: data,
    })

}

/**
 * 获取所有词库
 */
export function fetchUserVocLibs() {
    return get({
        url: baseURL + "get_vocabulary_lib",
    })
}


/**
 * 获取词库的单元
 */
export function fetchVocSection(data: any) {
    return get({
        url: baseURL + "get_vocabulary_sections?id=" + data.id,
    })
}

/**
 * 根据单词返回 AI 生成的问题
 */
export function fetchSelfQuiz(data: any) {
    return get({
        url: baseURL + "ai/get_ai_quiz?voc_lib_id=" + data.voc_lib_id,
    })
}

/**
 * 自测单词通过
 */
export function setWordQuizPass(data: any) {
    return post({
        url: baseURL + "pass_word",
        data: data,
    })
}

/**
 * 获取 In-class Quiz
 */
export function fetchInClassQuiz(data: any) {
    return post({
        url: baseURL + "in_class_quiz/get_in_class_quiz",
        data: data,
    })
}

/**
 * 设置 In-class Quiz 结果
 */
export function setInClassQuizResult(data: any) {
    return post({
        url: baseURL + "in_class_quiz/set_in_class_quiz_result",
        data: data,
    })

}

/**
 * 发送登录请求
 */
export function handleLogin(data: any) {
    return post({
        url: baseURL + "user/login",
        data: data,
    })
}

/**
 * 发送登出请求
 */
 
 export function handleLogout() {
    return post({
        url: baseURL + "user/logout",
    })
}

/**
 * 发送注册请求
 */
export function handleRegister(data: any) {
    return post({
        url: baseURL + "user/register",
        data: data,
    })
}

/**
 * 发送重设密码请求
 */
export function handleResetPassword(data: any) {
    return post({
        url: baseURL + "user/reset_pw",
        data: data,
    }) 
}

/**
 * 发送注册验证码（重设密码版）
 */
export function sendResetCaptcha(data: any) {
    return post({
        url: baseURL + "user/reset_pw_captcha",
        data: data,
    }) 
}



/**
 * 发送注册验证码
 */
export function sendCaptcha(data: any) {
    return post({
        url: baseURL + "user/send_captcha",
        data: data,
    })
}

/**
 * 获取连续学习天数
 */
export function fetchConsecutiveDayNum() {
    return get({
        url: baseURL + "user/get_consecutive_days"
    })
}

/**
 * 获取已学过的单词总数
 */
export function fetchLearnedWordTotalNum() {
    return get({
        url: baseURL + "user/words_learned"
    })
}