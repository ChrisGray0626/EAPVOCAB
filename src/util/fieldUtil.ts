/**
 * @Description:
 * @Author: Chris
 * @Date: 2024/9/25
 */

export function checkFieldIsEmpty(fieldValue: string, fieldName: string) {
  if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
    uni.showToast({
      title: 'Please input your ' + fieldName,
      icon: 'error',
    })
    return true
  }
  return false
}

export function checkEmail(email: string) {
  if (checkFieldIsEmpty(email, 'email')) {
    return false
  }
  const reg = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@xjtlu.edu.cn$/;
  if (!reg.test(email)) {
    uni.showToast({
      title: 'Please input your XJTLU email',
      icon: 'error',
    })
    return false
  }
  return true
}