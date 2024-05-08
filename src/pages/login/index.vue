<template>
  <view class='content'>
    <view class='title'>
      Welcome!
    </view>
    <u--form :modelValue="userInfo">
      <view class='inputBox'>
        <view class='inputLabel'>Email</view>
        <u-form-item borderBottom="true">
          <u--input
              placeholder="Please Input Your Email"
              v-model="userInfo.email"
              border="none"
          />
        </u-form-item>
      </view>
      <view class='inputBox'>
        <text class='inputLabel'>Password</text>
        <u-form-item borderBottom="true">
          <u--input
              placeholder="Please Input Your Password"
              v-model="userInfo.password"
              border="none"
          />
        </u-form-item>
      </view>
      <u-button type='primary' class='SignInButton' @click="login">Sign in</u-button>
      <u-button type='primary' plain="true" class='SignUpButton' @click="goToRegister">Sign up</u-button>
      <uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">底部弹出 Popup 自定义圆角</uni-popup>
    </u--form>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

// import {handleLogin} from "../../services/index"

export default defineComponent({
  data() {
    return {
      userInfo: {} as {
        email: string;
        password: string;
      },
      username: 'Chris'
    };
  },
  computed: {},
  methods: {
    login() {
      // TODO Login API
      this.gotoIndex()
    },
    gotoIndex() {
      uni.redirectTo({
        url: '/pages/index/index?username=' + this.username
      })
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/index'
      })
    }
  }
});
</script>