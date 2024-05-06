<template>
  <view class="content">
    <text class="articleTitle">
      {{ title }}
    </text>
    <view class="contentImage">
    </view>
    <view class="mainContent">
      <text v-for="(word, index) in words" :key="index" :style="getWordStyle(word)">
        {{ word }}
        <text></text>
      </text>
    </view>
  </view>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import './index.less'

export default defineComponent({
  data() {
    return {
      title: "How Can AI Help Create Flavours?",
      text: "Swiss company Firmenich has developed an artificial intelligence system that can predict the taste and texture of meat based on its texture, colour, and the way it responds to cooking and the way it feels in the mouth.",
      redWords: ["Swiss", "texture", 'artificial', 'intelligence'],
    };
  },
  computed: {
    words() {
      // 将传入的文本按照空格分割成单词数组
      return this.text.split(" ");
    }
  },
  methods: {
    getWordStyle(word: string) {
      // 如果单词在红字列表中，则返回相应的样式
      if (this.redWords.includes(word)) {
        return {backgroundColor: "#e1f3d8"};
      }
      // 否则返回空对象，表示不应用特殊样式
      return {};
    }
  }
});
</script>
