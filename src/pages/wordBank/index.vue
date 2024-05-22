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
      <u-image src="/static/images/empty.png"></u-image>
      <text>No Words In The Bank</text>
    </view>
    <view class="saveBtn">
      <u-button shape="circle" type="primary" @click="getAIQuiz">
        <text>AI-Generated Question</text>
      </u-button>
    </view>
  </view>
  <!--  悬浮按钮-->
  <view>
    <uni-fab
        ref="fab"
        horizontal="right"
        vertical="bottom"
        direction="vertical"
        :content="fabContent"
        @trigger="triggerFab"
    />
  </view>
  <!--  添加单词弹窗-->
  <view>
    <u-modal
        :show="isAddWordShowed"
        confirmText="Confirm"
        cancelText="Cancel"
        :showCancelButton="true"
        @confirm="confirmAddWordModal"
        @cancel="cancelAddWordModal"
        width="300px"
    >
      <u-form>
        <view class='inputBox'>
          <view class='inputLabel'>Word</view>
          <u-form-item borderBottom="true">
            <input
                v-model="word"
                placeholder="Please input the word"
            />
          </u-form-item>
        </view>
        <view class='inputBox'>
          <text class='inputLabel'>Explanation</text>
          <uni-easyinput type="textarea"
                         v-model="explanation"
                         placeholder="Please input the explanation"
          />
        </view>
      </u-form>
    </u-modal>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

import {fetchVocabularyBank, fetchWordsInSection, fetchAIQuestion4Word, addWordItem} from '@/services'

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
      fabContent: [
        {
          iconPath: "/src/static/images/input.svg",
          text: "Input",
        },
        // {
        //   iconPath: "/src/static/images/file.svg",
        //   text: "File",
        // },
      ],
      isAddWordShowed: false,
      word: '',
      explanation: "",
    };
  },
  mounted() {
    this.loadWords()
  },
  computed: {
    isWordListEmpty() {
      return this.words.length === 0;
    },
  },
  methods: {
    loadWords() {
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
    // TODO getAiQs
    getAIQuiz() {
      uni.showLoading({
        title: 'Loading'
      });
      const data = {word: "fantasy"}
      fetchAIQuestion4Word(data).then(response => {
        console.log(response)
        uni.hideLoading()
      })
    },
    triggerFab(e: any) {
      const index = e.index
      if (index == 0) {
        this.showAddWordModal()
      } else {
        // TODO file
      }
    },
    confirmAddWordModal() {
      this.closeAddWordModal()
      this.handleAddWordItem()
    },
    cancelAddWordModal() {
      this.closeAddWordModal()
    },
    showAddWordModal() {
      this.isAddWordShowed = true
    },
    closeAddWordModal() {
      this.isAddWordShowed = false
    },
    handleAddWordItem() {
      const data = {
        voc_sec_id: this.voc_sec_id,
        word: this.word,
        explanation: this.explanation,
      }
      addWordItem(data).then((res: any) => {
        if (res.data.code === 20000) {
          uni.showToast({title: "Add successfully!", icon: 'success'})
          this.loadWords()
        }
      })
    },
  },
})
</script>
<style lang="less" scoped>
@import './index.less';
</style>
