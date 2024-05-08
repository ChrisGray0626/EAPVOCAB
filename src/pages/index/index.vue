<template>
  <view class="content">
    <view class="studentCard">
      <navigator hover-class="none" url="/pages/wordBank/index">
        <view class="studentInfo">
          <u-avatar
              size="100"
              src="../../static/images/boy_avatar.png"
          />
          <view v-if="userProfile.username">
            <view class="userName">Hi, {{ userProfile.username }}</view>
            <view class="userid">{{ emailUsername }}</view>
          </view>
          <view v-else class="logIn">
            <text>Log In</text>
          </view>
          <view class="calendar">
            <text>Word Bank</text>
            <view class="rightIcon">
              <uni-icons color='#696969' size='20' type="right"></uni-icons>
            </view>
          </view>
        </view>
      </navigator>

      <view class="divider">
        <u-divider/>
      </view>

      <view class="englishContent">
        <view class="bookInfo">
          <view class="bookName">
            <text>EAP033</text>
          </view>
          <view class="edit">
            <navigator hover-class="none" url="/pages/goalSetting/index">
              <text>Change</text>
              <uni-icons color='rgb(195, 195, 195)' size='18' type="right"></uni-icons>
            </navigator>
          </view>
        </view>
        <view class="progress">
          <u-line-progress
              :percentage="studiedPercentage"
              :showText="false"
              activeColor="#78A4F4"
          />
        </view>
        <view class="schedule">
          <view>
            <text>{{ studiedWords }} / {{ remainWords }}</text>
          </view>
          <view class="remainDays">
            <text>{{ remainDayNum }} days remaining</text>
          </view>
        </view>
      </view>
    </view>
    <view class="todayGoal">
      <text class="goalText">- Today Goal -</text>
      <view class="goalContent">
        <view class="newWords">
          <text>15</text>
          <text>New</text>
        </view>
        <view class="newWords">
          <text>10</text>
          <text>Review</text>
        </view>
        <view class="newWords">
          <text>25</text>
          <text>Total</text>
        </view>
      </view>
    </view>
    <view class='startWords'>
      <u-button shape="circle" type='primary'>
        <text>Start Quiz !</text>
      </u-button>
    </view>

  </view>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

export default defineComponent({
  data() {
    return {
      userProfile: {} as { username: string; email: string },
      remainWords: 3272,
      studiedWords: 666,
      remainDayNum: 100,
    };
  },
  computed: {
    emailUsername(): string {
      return this.userProfile.email ? this.userProfile.email.split('@')[0] : '';
    },
    studiedPercentage(): number {
      return this.studiedWords / this.remainWords * 100
    }
  },
});
</script>