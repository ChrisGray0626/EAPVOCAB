<template>
  <view class='content'>
    <view class='title'>
      <text>Welcome!</text>
    </view>
    <u-form>
      <view class='inputBox'>
        <view class='inputLabel'>Email</view>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please input your email"
              @change="changeEmail"
              border="none"
          />

          <view @click="showActionSheet" class="suffix-button">
            <view> {{ msg }} </view>
            <u-icon name="arrow-right" size="13" />
          </view>
          <u-action-sheet
            :show="actionSheetVisible"
            :actions="emailSuffixOptions"
            @cancel="actionSheetVisible = false"
            @select="selectSuffix"
          />
        </u-form-item>

      </view>
      <view class='inputBox'>
        <text class='inputLabel'>Password</text>
        <u-form-item borderBottom="true" class="password">
          <u-input
              placeholder="Please input your password"
              @change="changePassword"
              border="none"
              password
          />
          <!-- 忘记密码？ -->
          <view class="passwordForget"> 
            <text class='forgotPassword' @click="goToResetPassword">Forgot password?</text>
          </view>
        </u-form-item>
      </view>
      <u-button type='primary' class='SignInButton' @click.stop="login">Sign in</u-button>
      <u-button type='primary' :plain="true" class='SignUpButton' @click.stop="goToRegister">Sign up</u-button>
    </u-form>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

import {fetchUserInfo, handleLogin} from "@/api"
import {checkEmail, checkFieldIsEmpty} from "@/util/fieldUtil";
import type {Response} from "@/type";

export default defineComponent({
  data() {
    return {
      email: '',
      msg:'Select email suffix',
      password: '',
      emailSuffix:'',
      type:'select',
      suffixShow: false,
      actionSheetVisible: false,
      emailSuffixOptions: [
        { name: '@student.xjtlu.edu.cn', value: '@student.xjtlu.edu.cn' },
        { name: '@xjtlu.edu.cn', value: '@xjtlu.edu.cn' },
      ],
    };
  },
  computed: {
    fullEmail() {
      return this.email + this.emailSuffix;
    }
  },
  methods: {
    login: async function () {
      // Check email
      if (!checkEmail(this.fullEmail)) {
        return;
      }
      // Check password
      if (checkFieldIsEmpty(this.password, 'password')) {
        return;
      }
      let data = {
        email: this.fullEmail,
        password: this.password
      }
      let res = await handleLogin(data) as Response<any>;
      if (res.code === 0) {
        uni.showToast({title: "Login failed. Please check your email and password!", icon: 'error'})
        return
      }
      if (res.code != 20000) {
        return
      }
      res = await fetchUserInfo() as Response<any>;
      if (res.code != 20000) {
        return
      }
      uni.setStorageSync('userInfo', res.data)
      uni.showToast({title: "Login successfully!", icon: 'success'})
      this.gotoIndex()
    },
    gotoIndex() {
      uni.switchTab({
        url: '/pages/index/index',
      })
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/index'
      })
    },

    goToResetPassword() {
      uni.navigateTo({
        url: '/pages/resetpw/index'
      })
    },

    changeEmail(value: string) {
      this.email = value
    },
    changePassword(value: string) {
      this.password = value
    },
    showActionSheet() {
      this.actionSheetVisible = true; 
    },
    selectSuffix(action: any) {
      this.emailSuffix = action.value; // 选择邮箱后缀
      this.msg = this.emailSuffix;
      this.actionSheetVisible = false; // 关闭 Action Sheet
    }
  }
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>