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
  fetchVocabularyBank,
  fetchWordsInSection,
  addWordItem,
  fetchWordsFromPassage,
  addWords,
  deleteWordItem, fetchExplanationFromWord
} from '@/services'

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
          success: (res) => {
            if (res.confirm) {
              deleteWordItem(data).then((res: any) => {
                if (res.data.code === 20000) {
                  uni.showToast({title: "Delete successfully!", icon: "success"})
                  this.loadWords()
                } else {
                  uni.showToast({title: "Failed to delete. Please try again!", icon: "error"})
                  console.error(res.data.msg)
                }
              })
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
    handleAddWordItem() {
      uni.showLoading()
      // 获取单词释义
      let data = {
        word: this.addedWord,
      }
      // TODO fetchExplanationFromWord
      fetchExplanationFromWord(data).then((res: any) => {
        uni.hideLoading()
        if (res.data.code === 20000) {
          // 释义处理，一词多义、前缀等
          this.addedExplanation = res.data.data.match_word.explanation.split(";")[0]
          this.addedExplanation = this.addedExplanation.replace("1. ", "")
          // 添加单词
          let data = {
            voc_sec_id: this.voc_sec_id,
            word: this.addedWord,
            explanation: this.addedExplanation,
          }
          addWordItem(data).then((res: any) => {
            if (res.data.code === 20000) {
              this.closeAddWordModal()
              uni.showToast({title: "Add successfully!", icon: "success"})
              this.loadWords()
            } else {
              uni.showToast({title: "Failed to add. Please try again!", icon: "error"})
              console.error(res.data.msg)
            }
          })
        } else {
          uni.showToast({title: "Failed to add. Please try again!", icon: "error"})
          console.error(res.data.msg)
        }
      })
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
    getWordsFromPassage() {
      // 生成单词中
      uni.showLoading({title: "Generating words..."})
      const data = {
        passage: this.passage,
      }
      console.log("data", data)
      fetchWordsFromPassage(data).then((res: any) => {
        // 生成完成
        uni.hideLoading()
        if (res.data.code === 20000) {
          this.initAddWordFromPassageModal()
          this.candidateWords = res.data.data.words
          this.loadCheckBox()
        } else {
          uni.showToast({title: "Failed to generate words. Please try again!", icon: "error"})
          console.log(res.data.msg)
        }
      })
    },
    loadCheckBox() {
      const n = this.candidateWords.length
      for (let i = 0; i < n; i++) {
        this.isChecks.push(i)
        this.checkBoxRanges.push({value: i, text: this.candidateWords[i].word})
      }
    },
    handleAddWordFromPassage() {
      // 获取选中的单词
      const selectedWords = this.isChecks.map((index) => {
        return this.candidateWords[index]
      })
      const data = {
        voc_sec_id: this.voc_sec_id,
        words: selectedWords,
      }
      addWords(data).then((res: any) => {
        if (res.data.code === 20000) {
          this.closeAddWordFromPassageModal()
          uni.showToast({title: "Add successfully!", icon: "success"})
          // 刷新单词列表
          this.loadWords()
        }
      })
    }
  },
})
</script>
<style lang="less" scoped>
@import './index.less';
</style>
