<template>
  <view class="content">
    <view v-if="!isWordListEmpty">
      <uni-swipe-action>
        <uni-swipe-action-item
            v-for="item in words" :key="item.id"
            :right-options="options1"
            @click="handleSwipeActionClick($event, item.id)"
        >
          <view class="myWord">
            <!-- 单词 -->
            <text class="words">{{ item.word }}</text>
            <!-- 单词翻译 -->
            <text class="wordTrans">{{ item.explanation }}</text>
          </view>
          <view style="border: 0.1px solid gray; margin-top: 4px;"></view>
        </uni-swipe-action-item>
        <u-divider/>
      </uni-swipe-action>
    </view>
    <view v-else class="empty">
      <u-image src="/static/images/empty.png"></u-image>
      <text>No Words In The Bank</text>
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
        width="60vw"
    >
      <u-form>
        <view class='inputBox'>
          <view class='inputLabel'>Word</view>
          <u-form-item borderBottom="true">
            <input
                v-model="addedWord"
                placeholder="Please input the word"
            />
          </u-form-item>
        </view>
        <!--        <view class='inputBox'>-->
        <!--          <text class='inputLabel'>Explanation</text>-->
        <!--          <uni-easyinput type="textarea"-->
        <!--                         v-model="addedExplanation"-->
        <!--                         placeholder="Please input the explanation"-->
        <!--          />-->
        <!--        </view>-->
      </u-form>
    </u-modal>
  </view>
  <!--  通过句子添加单词弹窗-->
  <view>
    <u-modal
        :show="isAddWordFromPassageShowed"
        confirmText="Confirm"
        cancelText="Cancel"
        :showCancelButton="true"
        @confirm="confirmAddWordFromPassageModal"
        @cancel="cancelAddWordFromPassageModal"
        width="60vw"
    >
      <u-form>
        <view class='inputBox'>
          <text class='inputLabel'>Passage</text>
          <uni-easyinput type="textarea"
                         v-model="passage"
                         placeholder="Please input the passage"
                         maxlength="-1"
          />
          <view class="button">
            <u-button type="primary" @click.stop="getWordsFromPassage">
              <text>Generate</text>
            </u-button>
          </view>
          <uni-data-checkbox mode="button" multiple v-model="isChecks" :localdata="checkBoxRanges"/>
        </view>
      </u-form>
    </u-modal>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

import {
  addWordItem,
  addWords,
  deleteWordItem,
  fetchExplanationFromWord,
  fetchVocabularyBank,
  fetchWordsFromPassage,
  fetchWordsInSection
} from '@/api'
import type {Response} from "@/type";
import {checkFieldIsEmpty} from "@/util/fieldUtil";

export default defineComponent({
  data() {
    return {
      options1: [{
        text: 'Delete',
        style: {
          backgroundColor: '#F56C6C'
        }

      }],
      voc_lib_id: "",
      voc_sec_id: "",
      words: [] as {
        id: string,
        word: string,
        explanation: string,
      }[],
      fabContent: [
        {
          iconPath: "/src/static/images/word.svg",
          text: "Word",
        },
        {
          iconPath: "/src/static/images/passage.svg",
          text: "Passage",
        },
      ],

      isAddWordShowed: false,
      addedWord: "",
      addedExplanation: "",

      isAddWordFromPassageShowed: false,
      passage: "",
      isChecks: [] as Number[],
      candidateWords: [] as {
        word: string,
        explanation: string,
      }[],
      checkBoxRanges: [] as {
        value: number,
        text: string,
      }[]
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
    // 加载单词列表
    async loadWords() {
      let res = await fetchVocabularyBank() as Response<any>;
      if (res.code != 20000) {
        return
      }
      this.voc_lib_id = res.data.voc_lib_id
      this.voc_sec_id = res.data.voc_sec_id
      const data = {
        voc_lib_id: this.voc_lib_id,
        voc_sec_id: this.voc_sec_id,
      }
      res = await fetchWordsInSection(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      this.words = res.data
    },
    // 触发悬浮按钮
    triggerFab(e: any) {
      const index = e.index
      if (index === 0) {
        this.showAddWordModal()
      } else if (index === 1) {
        this.showAddWordFromPassageModal()
      }
    },
    // 滑动操作
    handleSwipeActionClick(event: any, index: string) {
      const data = {
        voc_sec_id: this.voc_sec_id,
        word_id: index,
      }
      if (event.index === 0) {
        uni.showModal({
          title: "Delete",
          content: "Are you sure to delete this word?",
          confirmText: "Confirm",
          cancelText: "Cancel",
          success: async (res) => {
            if (res.confirm) {
              let res = await deleteWordItem(data) as Response<any>;
              if (res.code != 20000) {
                return
              }
              uni.showToast({title: "Delete successfully!", icon: "success"})
              this.loadWords()
            }
          }
        })
      }
    },
    // 添加单词弹窗
    initAddWordModal() {
      this.addedWord = ""
      this.addedExplanation = ""
    },
    confirmAddWordModal() {
      this.handleAddWordItem()
    },
    cancelAddWordModal() {
      this.closeAddWordModal()
    },
    showAddWordModal() {
      this.initAddWordModal()
      this.isAddWordShowed = true
    },
    closeAddWordModal() {
      this.isAddWordShowed = false
    },
    async handleAddWordItem() {
      if (checkFieldIsEmpty(this.addedWord, "word")) {
        return
      }
      let data = {
        word: this.addedWord,
      }
      // 获取单词释义
      uni.showLoading()
      // TODO fetchExplanationFromWord
      let res = await fetchExplanationFromWord(data) as Response<any>;
      uni.hideLoading()
      if (res.code != 20000) {
        return
      }
      // 释义处理，一词多义、前缀等
      this.addedExplanation = res.data.match_word.explanation.split(";")[0]
      this.addedExplanation = this.addedExplanation.replace("1. ", "")
      // 添加单词
      let data1 = {
        voc_sec_id: this.voc_sec_id,
        word: this.addedWord,
        explanation: this.addedExplanation,
      }
      res = await addWordItem(data1) as Response<any>;
      if (res.code != 20000) {
        return
      }
      this.closeAddWordModal()
      uni.showToast({title: "Add successfully!", icon: "success"})
      this.loadWords()
    },
    // 通过句子添加单词弹窗
    initAddWordFromPassageModal() {
      this.passage = ""
      this.isChecks = []
      this.candidateWords = []
      this.checkBoxRanges = []
    },
    confirmAddWordFromPassageModal() {
      this.handleAddWordFromPassage()
    },
    cancelAddWordFromPassageModal() {
      this.closeAddWordFromPassageModal()
    },
    showAddWordFromPassageModal() {
      this.initAddWordFromPassageModal()
      this.isAddWordFromPassageShowed = true
    },
    closeAddWordFromPassageModal() {
      this.isAddWordFromPassageShowed = false
    },
    async getWordsFromPassage() {
      if (checkFieldIsEmpty(this.passage, "passage")) {
        return
      }
      const data = {
        passage: this.passage,
      }
      console.log("data", data)
      // 生成单词中
      uni.showLoading({title: "Generating words..."})
      let res = await fetchWordsFromPassage(data) as Response<any>;
      // 生成完成
      uni.hideLoading()
      if (res.code != 20000) {
        return
      }
      this.initAddWordFromPassageModal()
      this.candidateWords = res.data.words
      this.loadCheckBox()
    },
    loadCheckBox() {
      const n = this.candidateWords.length
      for (let i = 0; i < n; i++) {
        this.isChecks.push(i)
        this.checkBoxRanges.push({value: i, text: this.candidateWords[i].word})
      }
    },
    async handleAddWordFromPassage() {
      // 获取选中的单词
      const selectedWords = this.isChecks.map((value, index, array) => {
        return this.candidateWords[index]
      })
      const data = {
        voc_sec_id: this.voc_sec_id,
        words: selectedWords,
      }
      let res = await addWords(data) as Response<any>;
      if (res.code != 20000) {
        return
      }
      this.closeAddWordFromPassageModal()
      uni.showToast({title: "Add successfully!", icon: "success"})
      // 刷新单词列表
      this.loadWords()
    }
  },
})
</script>
<style lang="less" scoped>
@import './index.less';
</style>
