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
          v-if="selectedMetricsList.length"
          :metrics-list="selectedMetricsList"
          @deselect-metrics="handleDeselectMetrics"
          @reorder-metrics-ids="handleReorderMetricsIds">
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
          :selected-ids="localSelectedMetricsIds"
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
import { expandMetricsGroups } from './util'

[Dialog, Loading, Button].forEach(component => Vue.use(component))

export default {
  name: 'metrics-config',

  components: {
    YGroup,
    YSelectedList
  },

  props: {
    value: Boolean,
 
    selectedMetricsIds: {
      type: Array,
      default () {
        return []
      }
    },

    // 10000 - 仪表盘
    // 20000 - 商户实时数据
    // 30000 - 物流实时数据
    // This field is specific to Warboard
    pageId: String,

    groups: Array
  },

  data () {
    return {
      visible: false,
      loading: false,
      // 使用组件内部状态来跟踪，是因为Dialog按取消的时候，原来选中的ids是不需要变的
      // 只有在按确定按钮的时候，才需要将内部的localSelectedMetricsIds与外部selectedMetricsIds同步
      localSelectedMetricsIds: [ ...this.selectedMetricsIds ],
      metricsGroups: this.groups || []
    }
  },

  computed: {
    selectedMetricsList () {
      const { metricsGroups, localSelectedMetricsIds } = this

      // 如果没有选中的指标，提前返回一个空数组
      if (!localSelectedMetricsIds.length || !metricsGroups.length) return []

      // 这里将所有的metricsGroup展开成一个obejct, 对象key为metrics id, 值为metrics name
      // 之所以展开成这种形式，是为了在下一步中的id => metrics映射中避免每次都遍历一遍整个metrics数组
      const allMetrics = expandMetricsGroups(metricsGroups)

      return localSelectedMetricsIds.map(id => ({id, name: allMetrics[id]}))
    },

    maxNameLength () {
      return this.metricsGroups.reduce((max, cur) => {
        return Math.max(max, cur.name.length + 1)
      }, 0)
    },
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
    filterMetrics (id) {
      return this.localSelectedMetricsIds.filter(metricsId => metricsId !== id)
    },

    handleMetricsChange ({id, selected}) {
      let newSelectedMetricsIds = []
      if (selected) {
        newSelectedMetricsIds = [ ...this.localSelectedMetricsIds, id ]
      } else {
        newSelectedMetricsIds = this.filterMetrics(id)
      }
      this.localSelectedMetricsIds = newSelectedMetricsIds
    },

    handleDeselectMetrics (id) {
      this.localSelectedMetricsIds = this.filterMetrics(id)
    },

    handleReorderMetricsIds (reorderedIds) {
      this.localSelectedMetricsIds = reorderedIds
    },

    handleCancel () {
      this.visible = false
      // 重置本地选中的ids
      this.localSelectedMetricsIds = this.selectedMetricsIds
    },

    handleConfirm () {
      this.visible = false
      // 触发父级事件，将在本地选中的ids向外传递
      this.$emit('change', this.selectedMetricsList)
    }

    // requestForMetricsGroups () {
    //   const { pageId } = this
    //   this.loading = true
    //   axios.get('/quotaConfig/config', {
    //     params: {
    //       quotaCategory: 1,
    //       pageId
    //     }
    //   })
    //     .then(data => {
    //       this.loading = false
    //       if (data) {
    //         this.metricsGroups = data
    //         this.$emit('groups-fetched', data)
    //       }
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    // }
  },

  // created () {
  //   const { pageId, metricsGroups } = this
  //   // 如果提供了 pageId，并且没有请求过指标数据
  //   if (pageId && !metricsGroups.length) {
  //     this.requestForMetricsGroups()
  //   }
  // }
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
