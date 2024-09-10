<template>
  <view class="content">
    <uni-collapse accordion @change="collapseChange">
      <view v-for="lib in vocLibs" :key="lib.id">
        <uni-collapse-item :title="lib.name">
<!--          TODO lib sections-->
          <uni-list>
            <view v-for="section in lib.sections" :key="section.id">
              <uni-list-item>
                <template v-slot:body>
                  <view class="item">
                    <text>{{ section.sec_name }}</text>
                  </view>
                </template>
                <text>{{ section.sec_name }}</text>
                <uni-icons type="right" size="14"></uni-icons>
              </uni-list-item>
            </view>
          </uni-list>
        </uni-collapse-item>
      </view>
    </uni-collapse>
  </view>
  <!--    设置当前课程弹窗-->
  <view>
    <u-modal
        :show="isSetCurModuleShowed"
        confirmText="Confirm"
        cancelText="Cancel"
        :showCancelButton="true"
        @confirm="confirmSetCurModuleModal"
        @cancel="cancelSetCurModuleModal"
        width="300px"
    >
      <text>Are you sure to set {{curLib.name}} as the current course?</text>
    </u-modal>
  </view>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {fetchUserVocLibs, fetchVocSection, setCurrentVocLib} from "@/services";
export default defineComponent({
  data() {
    return {
      vocLibs: [] as VocLib[],
      curLibIdx: -1,
      isSetCurModuleShowed: false,
    };
  },

  onShow() {
    this.getVocLib();
  },

  computed: {
    curLib(){
      return this.vocLibs[this.curLibIdx]
    }
  },
  methods: {
    getVocLib() {
      fetchUserVocLibs().then((res: any) => {
        if (res.data.code == 20000) {
          this.vocLibs = res.data.data;
          this.vocLibs.forEach((item) => {
            const data = {
              id: item.id
            }
            fetchVocSection(data).then((res: any) => {
              if (res.data.code == 20000) {
                item.sections = res.data.data;
              }
            });
          });
        }
      });
    },
    collapseChange(e: any) {
      this.curLibIdx = e;
      this.showSetCurModuleModal();
    },
    confirmSetCurModuleModal() {
      const data = {
        lib_id: this.curLib.id
      }
      setCurrentVocLib(data).then((res: any) => {
        if (res.data.code == 20000) {
          uni.showToast({
            title: 'Set successfully',
            icon: 'success',
          });
          this.closeSetCurModuleModal();
          this.goBack();
        } else {
          uni.showToast({
            title: 'Set failed',
            icon: 'error',
          });
          console.error(res.data.msg);
        }
      });
    },
    cancelSetCurModuleModal() {
      this.closeSetCurModuleModal();
    },
    showSetCurModuleModal() {
      this.isSetCurModuleShowed = true;
    },
    closeSetCurModuleModal() {
      this.isSetCurModuleShowed = false;
    },
    goBack() {
      uni.navigateBack();
    }
  },
});

interface VocLib {
  id: number;
  name: string;
  total_word_count: number;
  progress: 0,
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