<template>
  <view class="content">
      <uni-collapse v-for="lib in vocLibs" :key="lib.id" accordion>
        <uni-collapse-item :title="lib.name" icon="bookmark-fill">
          <uni-list>
            <uni-list-item v-for="section in lib.sections" :key="section.id">
              <template v-slot:body>
                <view class="item">
                  <text>{{ section.sec_name }}</text>
                </view>
              </template>
              <text>{{ section.sec_name }}</text>
              <uni-icons type="right" size="14"></uni-icons>
            </uni-list-item>
          </uni-list>
        </uni-collapse-item>
      </uni-collapse>
  </view>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {fetchUserVocLibs, fetchVocSection} from "@/services";

export default defineComponent({
  data() {
    return {
      vocLibs: [] as VocLib[],
    };
  },

  mounted() {
    this.getVocLib();
  },

  methods: {
    getVocLib() {
      fetchUserVocLibs().then((res) => {
        if (res.data.code == 20000) {
          this.vocLibs = res.data.data;
          this.vocLibs.forEach((item) => {
            const data = {
              id: item.id
            }
            fetchVocSection(data).then((res) => {
              if (res.data.code == 20000) {
                item.sections = res.data.data;
              }
            });
          });
        }
      });
    },
  },
});

interface VocLib {
  id: number;
  name: string;
  total_word_count: number;
  "progress": 0,
  sections: Section[];
}

interface Section {
  id: number;
  sec_name: string;
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>