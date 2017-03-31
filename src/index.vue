<template>
  <el-dialog
    title="指标配置"
    class="mc"
    v-model="visible"
    v-loading="loading"
    @close="handleCancel">
    <div>
      <div class="mc-title">已关注指标</div>
      <div class="mc-content">
        <y-selected-list
          v-if="localSelectedList.length"
          :data="localSelectedList"
          @deselect-metrics="handleDeselectMetrics"
          @reorder-list="handleReorderList">
        </y-selected-list>
        <span v-else class="mc-placeholder">暂无关注指标，请点击下列指标关注</span>
      </div>
    </div>
    <div>
      <div class="mc-title">所有指标</div>
      <ul class="mc-content">
        <y-group
          v-for="group in metricsGroups"
          :key="group.name"
          :max-name-length="maxNameLength"
          :data="group"
          :selected-list="localSelectedList"
          @change="handleMetricsChange">
        </y-group>
      </ul>
    </div>
    <div slot="footer" :class="['dialog-footer', 'mc-footer']">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { Dialog, Loading, Button } from 'element-ui'
import YGroup from './Group'
import YSelectedList from './SelectedList'

[Dialog, Loading, Button].forEach(component => Vue.use(component))

export default {
  name: 'metrics-config',

  components: {
    YGroup,
    YSelectedList
  },

  props: {
    value: Boolean,
 
    selectedList: {
      type: Array,
      default () {
        return []
      }
    },

    groups: Array
  },

  data () {
    return {
      visible: false,
      loading: false,
      // 使用组件内部状态来跟踪，是因为 Dialog 按取消的时候，原来选中的 list 是不需要变的
      // 只有在按确定按钮的时候，才需要将内部的 localSelectedList 与外部 selectedMetrics 同步
      localSelectedList: [ ...this.selectedList ],
      metricsGroups: this.groups || []
    }
  },

  computed: {
    maxNameLength () {
      return this.metricsGroups.reduce((max, cur) => {
        return Math.max(max, cur.name.length + 1)
      }, 0)
    }
  },

  watch: {
    value (val) {
      this.visible = val
    },

    visible (val) {
      this.$emit('input', val)
    },

    groups (newGroups) {
      this.metricsGroups = newGroups
    }
  },

  methods: {
    filterMetrics (metrics) {
      return this.localSelectedList.filter(i => i.name !== metrics.name)
    },

    handleMetricsChange ({ metrics, selected }) {
      let newSelectedList = []
      if (selected) {
        newSelectedList = [ ...this.localSelectedList, metrics ]
      } else {
        newSelectedList = this.filterMetrics(metrics)
      }
      this.localSelectedList = newSelectedList
    },

    handleDeselectMetrics (metrics) {
      this.localSelectedList = this.filterMetrics(metrics)
    },

    handleReorderList (reorderedList) {
      this.localSelectedList = reorderedList
    },

    handleCancel () {
      this.visible = false
      // 重置本地选中的 list
      this.localSelectedList = this.selectedList
    },

    handleConfirm () {
      this.visible = false
      // 触发父级事件，将在本地选中的ids向外传递
      this.$emit('change', this.localSelectedList)
    }
  }
}
</script>

<style>
.mc, .mc * {
  box-sizing: border-box;
}
.mc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.mc-title {
  padding-bottom: 6px;
  border-bottom: 1px solid #e0e6ed;
  font-size: 14px;
  color: #475669;
}
.mc-content {
  padding: 10px 0;
  min-height: 85px;
}
.mc-placeholder {
  font-size: 13px;  
  color: #98a8be;
}
.mc-footer {
  text-align: right;
}
</style>
