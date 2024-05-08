<template>
  <view class="content">
    <view>
      <uni-fab
          ref="fab"
          horizontal="right"
          vertical="bottom"
      />
    </view>
    <view>
      <uni-grid :column="4" :showBorder="false">
        <uni-grid-item v-for="item in items1" :key="item.text">
          <view class="grid-item-box">
            <image :src="item.src" style="width: 100px; height: 100px"/>
            <text>{{ item.text }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>
    <view>
      <uni-grid :column="3" :showBorder="false">
        <uni-grid-item v-for="item in items2" :key="item.text">
          <view class="grid-item-box">
            <image :src="item.src" style="width: 100px; height: 100px"/>
            <text>{{ item.text }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>
    <navigator hover-class="none" open-type="redirect" url="/pages/articleDetail/index">

      <view class="todayReadings">
        <!-- 标题 -->
        <view class="at-row at-row__align--center">
          <view class="at-col">
            <view class="todayReadingsTop">
              <view class="readingTop">
                <text>Daily Reading</text>
              </view>
            </view>
          </view>
          <!-- TODO Read More -->
          <view class="at-col">
            <view class="readingMore">
              <text class="moreText">More</text>
              <uni-icons size="30" type="more"/>
            </view>
          </view>
        </view>
        <!-- 图片 -->
        <view class="contentImage"></view>
        <!-- 文章大致内容 -->
        <view class="mainContent">
          <text>How Can AI Help Create Flavours?</text>
        </view>
        <view class="CNContent">
          <text>食物味道, AI制造!</text>
        </view>
      </view>
    </navigator>

    <!-- 底部信息 -->
    <view class="endMsg">
      <text>一 Done~ 一</text>
    </view>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

export default defineComponent({
  data() {
    return {
      items1: [
        {src: '../../static/images/listen.png', width: '100', height: '100', text: 'Listening'},
        {src: '../../static/images/speak.png', width: '100', height: '100', text: 'Speaking'},
        {src: '../../static/images/read.png', width: '100', height: '100', text: 'Reading'},
        {src: '../../static/images/write.png', width: '100', height: '100', text: 'Writing'}
      ],
      items2: [
        {src: '../../static/images/battle.png', width: '100', height: '100', text: 'Word Battle'},
        {src: '../../static/images/quiz.png', width: '100', height: '100', text: 'Class Quiz'},
        {src: '../../static/images/game.png', width: '100', height: '100', text: 'Class Activity'}
      ]
    };
  },
});
</script>