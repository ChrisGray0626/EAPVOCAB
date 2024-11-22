/**
 * @Description: Class
 * @Author: Chris
 * @Date: 2024/10/15
 */

export interface Response<T> {
  code: number;
  msg: string;
  data: T;
}

export interface UserInfo {
  username: string;
  email: string,
  role: string,
  cur_lib: number,
  cur_lib_name: string,
}