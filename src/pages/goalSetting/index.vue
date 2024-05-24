<template>
  <view class="content">
    <view class="bookCard">
      <!-- 单词表的图片 -->
      <view class="bookImage"></view>
      <!-- 单词表的描述 -->
      <view class="bookDetails">
        <view class="bookName">
          <text>EAP033</text>
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
<!--      TODO picker-view-->
      <view class="selectedPlan" @click="show">
        <text>Your Study Plan: {{ selectedPlan }}</text>
      </view>
      <view>
        <u-picker
            :columns="alternativePlans"
            :show="isShow"
            cancelText="Cancel"
            confirmText="Confirm"
            keyName="label"
            title="Study Plan"
            @cancel="cancel"
            @confirm="confirm"
        />
      </view>
    </view>
    <view class="saveBtn">
      <u-button shape="circle" type="primary" @click.stop="savePlan">Save Plan</u-button>
    </view>

  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  data() {
    return {
      isShow: true,
      remainWords: 3272,
      studiedWords: 666,
      alternativePlans: [] as string[][],
      selectedPlan: "",
    }
  },
  created() {
    this.initAlternativePlans()
  },
  computed: {
    studiedPercentage(): number {
      return this.studiedWords / this.remainWords * 100
    }
  },

  methods: {
    initAlternativePlans() {
      let ll = []
      for (let i = 1; i <= 50; i++) {
        const dailyWordNum = i * 5
        const dayNum = Math.ceil(this.remainWords / dailyWordNum)
        ll.push(`${dailyWordNum} Words ${dayNum} Days`)
      }
      this.alternativePlans.push(ll)
      this.selectedPlan = this.alternativePlans[0][0]
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