<template>
  <view class="content">
    <view class="title">
      <text>Sign Up</text>
    </view>
    <u-form>
      <view class="inputBox">
        <view class="inputLabel">Nickname</view>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please input your nickname"
              v-model="nickname"
              @change="changeNickname"
              border="none"
          />
        </u-form-item>
      </view>
      <view class="inputBox">
        <view class="inputLabel">Password</view>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please input your password"
              v-model="password"
              @change="changePassword"
              border="none"
              password
          />
        </u-form-item>
      </view>
      <view class="inputBox">
        <view class="inputLabel">Module</view>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please input your module"
              v-model="module"
              @change="changeModule"
              border="none"
          />
        </u-form-item>
      </view>
      <view class="inputBox">
        <view class="inputLabel">XJTLU Email</view>
        <u-form-item borderBottom="true">
          <u-input
              placeholder="Please input your email"
              v-model="email"
              border="none"
              @change="changeEmail"
          />
        </u-form-item>
      </view>
      <view class="inputBox">
        <view class="inputLabel">Verification Code</view>
        <view class="formContent">
          <u-form-item borderBottom="true">
            <u-input
                placeholder="Verification Code"
                v-model="captcha"
                @change="changeCaptcha"
                border="none"
            />
          </u-form-item>
          <u-button type='primary' class="sendCodeButton" @click.stop="sendCode">
            {{
              isSending ? 'Sending..' : countDown > 0 ? 'Try again in ' + countDown + ' seconds' : 'Send Verification Code'
            }}
          </u-button>
        </view>
      </view>
      <view class="userAgreementBox">
        <text>By continuing, you agree to our</text>
        <text class="userAgreementText" @click="goToUserAgreement">user agreement</text>
        <text>.</text>
      </view>
      <u-button type='primary' @click="signUp">Submit</u-button>
    </u-form>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

import {handleRegister, sendCaptcha} from "@/api"
import {checkEmail, checkFieldIsEmpty} from "@/util/fieldUtil";
import type {Response} from "@/type";


export default defineComponent({
  data() {
    return {
      nickname: '',
      password: '',
      module: '',
      email: '',
      captcha: '',
      isSending: false,
      countDown: 0,
    }
  },
  methods: {
    async sendCode() {
      // 检查邮箱填写情况
      if (checkFieldIsEmpty(this.email, 'email')) {
        return;
      }
      // 检查验证码发送情况
      if (this.countDown > 0 || this.isSending) {
        return;
      }
      // 设置验证码发送状态
      this.isSending = true;
      // 发送验证码
      let data = {
        email: this.email,
      };
      let res = await sendCaptcha(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      uni.showToast({
        title: "Please check your email",
        icon: 'success',
      })
      // 初始化倒计时
      this.initCountDown();
      // 设置验证码发送状态
      this.isSending = false;
    },
    async signUp() {
      // Check nickname
      if (checkFieldIsEmpty(this.nickname, 'nickname')) {
        return;
      }
      // Check password
      if (checkFieldIsEmpty(this.password, 'password')) {
        return;
      }
      // Check module
      if (checkFieldIsEmpty(this.module, 'module')) {
        return;
      }
      // Check email
      if (!checkEmail(this.email)) {
        return;
      }
      // Check captcha
      if (checkFieldIsEmpty(this.captcha, 'captcha')) {
        return;
      }
      const data = {
        username: this.nickname,
        password: this.password,
        module: this.module,
        email: this.email,
        captcha: this.captcha,
      };
      let res = await handleRegister(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      uni.showToast({
        title: "Registration successful!",
        icon: 'success',
      })
      this.goToLogin();
    },
    goToUserAgreement() {
      uni.navigateTo({
        url: '/pages/userAgreement/index'
      })
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    },
    initCountDown() {
      this.countDown = 60;
      const timer = setInterval(() => {
        this.countDown--;
        if (this.countDown === 0) {
          clearInterval(timer);
          this.isSending = false;
        }
      }, 1000);
    },
    changeNickname(value: string) {
      this.nickname = value
    },
    changePassword(value: string) {
      this.password = value
    },
    changeModule(value: string) {
      this.module = value
    },
    changeEmail(value: string) {
      this.email = value
    },
    changeCaptcha(value: string) {
      this.captcha = value
    }
  }
});
</script>
<style lang="less" scoped>
@import './index.less';
</style>