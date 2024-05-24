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
        width="40vw"
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
        <view class='inputBox'>
          <text class='inputLabel'>Explanation</text>
          <uni-easyinput type="textarea"
                         v-model="addedExplanation"
                         placeholder="Please input the explanation"
          />
        </view>
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
        width="40vw"
    >
      <view class='inputBox'>
        <u-form>
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
          <uni-data-checkbox mode="button" multiple v-model="isChecks" :localdata="checkBoxRanges"></uni-data-checkbox>
        </u-form>
      </view>

    </u-modal>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'

import {fetchVocabularyBank, fetchWordsInSection, addWordItem, fetchWordsFromPassage, addWords} from '@/services'

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
      const data = {
        voc_sec_id: this.voc_sec_id,
        word: this.addedWord,
        explanation: this.addedExplanation,
      }
      addWordItem(data).then((res: any) => {
        if (res.data.code === 20000) {
          this.closeAddWordModal()
          uni.showToast({title: "Add successfully!", icon: 'success'})
          this.loadWords()
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
      // 加载中
      uni.showLoading({title: "Generating words..."})
      const data = {
        passage: this.passage,
      }
      console.log("data", data)
      fetchWordsFromPassage(data).then((res: any) => {
        // 加载完成
        uni.hideLoading()
        if (res.data.code === 20000) {
          this.initAddWordFromPassageModal()
          this.candidateWords = res.data.data.words
          this.loadCheckBox()
        } else {
          uni.showToast({title: "Failed to generate words. Please try again!", icon: 'error'})
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
          uni.showToast({title: "Add successfully!", icon: 'success'})
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
