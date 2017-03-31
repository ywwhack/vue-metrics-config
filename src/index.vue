<template>
  <el-dialog
    class="mc"
    v-model="visible"
    v-loading="loading"
    :title="title"
    :top="top"
    :size="size"
    @close="handleCancel">
    <div>
      <div class="mc-title">
        <div>已关注指标</div>
        <div v-if="maxSelectCount" style="color: #a2b1c5;">注：最多关注 {{ maxSelectCount }} 个指标</div>
      </div>
      <div class="mc-content mc-selected-content">
        <dt-selected-list
          v-if="localSelectedList.length"
          :data="localSelectedList"
          @deselect-metrics="handleDeselectMetrics"
          @reorder-list="handleReorderList">
        </dt-selected-list>
        <span v-else class="mc-placeholder">暂无关注指标，请点击下列指标关注</span>
      </div>
    </div>
    <div>
      <div class="mc-title">
        <div>所有指标</div>
        <el-input
          v-if="searchable"
          size="small"
          placeholder="请输入关键字进行搜索"
          style="width: 200px;"
          icon="search"
          v-model="searchText">
        </el-input>
      </div>
      <ul class="mc-content mc-groups-content">
        <transition-group name="mc-fade">
          <dt-group
            v-for="group in filteredGroups"
            :key="group.name"
            :max-name-length="maxNameLength"
            :data="group"
            :selected-list="localSelectedList"
            @change="handleMetricsChange">
          </dt-group>
        </transition-group>
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
import { Dialog, Loading, Button, Input } from 'element-ui'
import DtGroup from './Group'
import DtSelectedList from './SelectedList'

[Dialog, Loading, Button, Input].forEach(component => Vue.use(component))

export default {
  name: 'dt-metrics-config',

  components: {
    DtGroup,
    DtSelectedList
  },

  props: {
    value: Boolean,

    searchable: Boolean,

    maxSelectCount: Number,

    size: {
      type: String,
      default: 'small'
    },

    top: {
      type: String,
      default: '50px'
    },

    title: {
      type: String,
      default: '指标配置'
    },
 
    selectedList: {
      type: Array,
      default () {
        return []
      }
    },

    groups: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      visible: false,
      loading: false,
      searchText: '',
      // 使用组件内部状态来跟踪，是因为 Dialog 按取消的时候，原来选中的 list 是不需要变的
      // 只有在按确定按钮的时候，才需要将内部的 localSelectedList 与外部 selectedMetrics 同步
      localSelectedList: [ ...this.selectedList ],
      metricsGroups: this.groups
    }
  },

  computed: {
    maxNameLength () {
      return this.metricsGroups.reduce((max, cur) => {
        return Math.max(max, cur.name.length + 1)
      }, 0)
    },

    filteredGroups () {
      const { searchText, metricsGroups } = this
      if (!searchText) return metricsGroups

      let result = []
      metricsGroups.forEach(group => {
        let g = JSON.parse(JSON.stringify(group))
        g.items = group.items.filter(i => i.name.indexOf(searchText) > -1)
        if (g.items.length) {
          result.push(g)
        }
      })
      return result
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
      const { maxSelectCount, localSelectedList } = this
      let newSelectedList = []
      if (selected) {
        // 如果达到了能关注指标的最大值，就不再添加
        if (maxSelectCount && localSelectedList.length >= maxSelectCount) {
          newSelectedList = localSelectedList
        } else {
          newSelectedList = [ ...localSelectedList, metrics ]
        }
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
    },

    overrideTitleStyle () {
      const elDialog = document.querySelector('.mc .el-dialog')
      const elHeader = elDialog.querySelector('.el-dialog__header')
      const elTitle = elDialog.querySelector('.el-dialog__title')

      elDialog.style['margin-bottom'] = '0'

      elHeader.style.backgroundColor = '#1f2d3d'
      elHeader.style.padding = '17px 25px'

      elTitle.style.color = '#fff'
    }
  },

  mounted () {
    this.overrideTitleStyle()
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mc-content {
  padding: 10px 0;
  overflow: auto;
}
.mc-selected-content {
  height: 75px;
}
.mc-groups-content {
  min-height: 85px;
  max-height: 250px;
}
.mc-placeholder {
  font-size: 13px;  
  color: #98a8be;
}
.mc-footer {
  text-align: right;
}

.mc-fade-enter-active, .mc-fade-leave-active {
  transition: opacity .5s
}
.mc-fade-enter, .mc-fade-leave-active {
  opacity: 0
}
</style>
