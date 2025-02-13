<template>
    <view class="content">
      <view class="title">
        <text>Reset Password</text>
      </view>
      <u-form>
        <!-- New PW -->
        <view class="inputBox">
          <view class="inputLabel"> New Password</view>
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

        <!-- XJTLU Email -->
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

        <!-- Verification Code -->
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
        <u-button type='primary' @click="resetPW">Submit</u-button>
      </u-form>
    </view>
  </template>
  <script lang="ts">
  import {defineComponent} from 'vue'
  
  import {handleResetPassword, sendResetCaptcha} from "@/api"
  import {checkEmail, checkFieldIsEmpty} from "@/util/fieldUtil";
  import type {Response} from "@/type";
  
  export default defineComponent({
    data() {
      return {
        password: '',
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
        let res = await sendResetCaptcha(data) as Response<any>;
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
      async resetPW() {
        // Check password
        if (checkFieldIsEmpty(this.password, 'password')) {
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
          password: this.password,
          email: this.email,
          captcha: this.captcha,
        };
        let res = await handleResetPassword(data) as Response<any>;
        if (res.code != 20000) {
            uni.showToast({
            title: "Invalid verification code or email",
            icon: 'error',
            })
          return
        }
        uni.showToast({
          title: "Reset Password Successful!",
          icon: 'success',
        })
        this.goToLogin();
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

      changePassword(value: string) {
        this.password = value
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