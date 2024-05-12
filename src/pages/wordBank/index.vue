<template>
  <view class="content">
    <view v-if="!isWordListEmpty">
      <view v-for="(item, index) in words" :key="index" class="myWord">
        <!-- 单词 -->
        <text class="words">{{ item.word }}</text>
        <!-- 单词翻译 -->
        <text class="wordTrans">{{ item.explanation }}</text>
        <u-divider/>
      </view>
    </view>
    <view v-else class="empty">
      <image src="/static/images/empty.png"></image>
      <text>No Words In The Bank</text>
    </view>
    <view class="saveBtn">
      <u-button type="primary" @click="getAIQuiz">
        <text>AI-Generated Question</text>
      </u-button>
    </view>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

import {getAiQs, getVocabularyLib} from '../../services'

export default defineComponent({
  data() {
    return {
      words: [
        {
          word: 'apple',
          explanation: '苹果',
        },
        {
          word: 'banana',
          explanation: '香蕉',
        },
        {
          word: 'orange',
          explanation: '橙子',
        },
      ],
    };
  },
  mounted() {
    // TODO getVocabularyLib
    getVocabularyLib().then(res => {
      console.log(res.data.data)
    })
  },
  computed: {
    isWordListEmpty() {
      // return true;
      return this.words.length === 0;
    },
  },
  methods: {
    getAIQuiz() {
      let queryParams = {word: "test"}
      getAiQs(queryParams).then(response => {
        // TODO getAiQs
        console.log(response)
      })
    },
  },
})
</script>

