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
      <u-button shape="circle" type="primary" @click="getAIQuiz">
        <text>AI-Generated Question</text>
      </u-button>
    </view>
    <view>
      <!--      TODO Add Word-->
      <uni-fab
          ref="fab"
          horizontal="right"
          vertical="bottom"
      />
    </view>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

import {fetchVocabularyBank, fetchWordsInSection, getAiQs} from '@/services'

export default defineComponent({
  data() {
    return {
      voc_lib_id: "",
      voc_sec_id: "",
      words: [] as {
        id: string,
        word: string,
        explanation: string,
      }[],
    };
  },
  mounted() {
    this.getWords()
  },
  computed: {
    isWordListEmpty() {
      return this.words.length === 0;
    },
  },
  methods: {
    getWords() {
      fetchVocabularyBank().then((res: any) => {
        let data = res.data.data
        this.voc_lib_id = data.voc_lib_id
        this.voc_sec_id = data.voc_sec_id
        data = {
          voc_lib_id: this.voc_lib_id,
          voc_sec_id: this.voc_sec_id,
        }
        fetchWordsInSection(data).then((res: any) => {
          this.words = res.data.data
        })
      })
    },
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

