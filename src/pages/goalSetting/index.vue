<template>
  <view class="content">
    <view class="bookCard">
      <!-- 单词表的图片 -->
      <view class="bookImage"></view>
      <!-- 单词表的描述 -->
      <view class="bookDetails">
        <view class="bookName">
          <text>{{ curLibName }}</text>
          <navigator hover-class="none" url="/pages/moduleChange/index">
            <view class="changeModule">
              <text>Change Module</text>
              <uni-icons color="#C0C0C0" size="18" style="margin-left: 5px;" type="refreshempty"/>

            </view>
          </navigator>
        </view>
        <view class="schedule">
          <text>{{ studiedWords }} / {{ remainWords }}</text>
        </view>
        <view class="progress">
          <u-line-progress
              :percentage="studiedPercentage"
              :showText="false"
              activeColor="#78A4F4"
          />
        </view>
      </view>
    </view>
    <u-divider/>

    <view class="goalPicker">
      <view class="selectedPlan" @click="show">
        <text>Your Study Plan: {{ selectedDailyWordNum }} words {{selectedDayNum}} days</text>
      </view>
      <view>
        <picker-view :value="pickerIdx" @change="pickerChange">
          <picker-view-column>
            <view class="item" v-for="(item, index) in dailyWordNums" :key="index">{{ item }} words</view>
          </picker-view-column>
          <picker-view-column>
            <view class="item" v-for="(item, index) in dayNums" :key="index">{{ item }} days</view>
          </picker-view-column>
        </picker-view>
      </view>
    </view>
    <view class="saveBtn">
      <u-button shape="circle" type="primary" @click.stop="savePlan">Save Plan</u-button>
    </view>

  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import {fetchUserInfo} from "@/services";

export default defineComponent({
  data() {
    return {
      curLibName: "",
      isShow: true,
      remainWords: 3272,
      studiedWords: 666,
      alternativePlans: [] as string[][],
      selectedPlan: "",
      dailyWordNums: [] as Number[],
      dayNums: [] as Number[],
      pickerIdx: [0, 0]
    }
  },
  created() {
    this.initAlternativePlans()
  },
  onShow() {
    this.getCurLib()
  },
  computed: {
    studiedPercentage(): number {
      return this.studiedWords / this.remainWords * 100
    },
    selectedDailyWordNum() {
      return this.dailyWordNums[this.pickerIdx[0]]
    },
    selectedDayNum() {
      return this.dayNums[this.pickerIdx[1]]
    },
    pickerValue() {
      return [this.pickerIdx, this.pickerIdx]
    }
  },

  methods: {
    initAlternativePlans() {
      let ll = []
      for (let i = 1; i <= this.remainWords / 5; i++) {
        const dailyWordNum = i * 5
        const dayNum = Math.ceil(this.remainWords / dailyWordNum)
        if (this.dayNums.slice(-1)[0] === dayNum) {
          continue
        }
        this.dailyWordNums.push(dailyWordNum)
        this.dayNums.push(dayNum)
        ll.push(`${dailyWordNum} Words ${dayNum} Days`)
      }
      this.alternativePlans.push(ll)
      this.selectedPlan = this.alternativePlans[0][0]
    },
    getCurLib() {
      const token = uni.getStorageSync('token')
      if (token != '') {
        fetchUserInfo().then((res: any) => {
          const userInfo = res.data.data
          this.curLibName = userInfo.cur_lib_name
        })
      }
    },
    pickerChange(e: any) {
      // console.log(e)
      // 分别比较两个值，如果一个有变化则同步更新另一个
      const changedValues = e.detail.value
      let updatedValue = -1
      if (changedValues[0] !== this.pickerIdx[0]) {
        updatedValue = changedValues[0]
      }
      else if (changedValues[1] !== this.pickerIdx[1]) {
        updatedValue = changedValues[1]
      }
      this.pickerIdx = [updatedValue, updatedValue]
    },
    confirm(e: any) {
      this.isShow = false
      this.selectedPlan = e.value[0]
    },
    cancel() {
      this.isShow = false
    },
    show() {
      this.isShow = true
    },
    savePlan() {
      // TODO Save Plan
      uni.showToast({title: "Save successfully!", icon: 'success'})
      this.goBack();
    },
    goBack() {
      uni.navigateBack()
    }
  },
})
</script>
<style lang="less" scoped>
@import './index.less';
</style>