<template>
  <draggable
    element="ul"
    class="mc-selected-list"
    :list="localMetricsList"
    @update="handleDragUpdate">
    <li
      class="metrics"
      v-for="metrics in localMetricsList"
      :key="metrics.id">
      {{ metrics.name }}
      <i
        class="el-icon-close"
        @click="deselectMetrics(metrics.id)"></i>
    </li>
  </draggable>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'y-selected-list',

  components: {
    Draggable
  },

  props: {
    metricsList: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      // 拖拽时会改变metricsList数组内部顺序
      // 因此需要用一个组件内部状态localMetricsList跟踪props的metricsList的变化
      localMetricsList: [ ...this.metricsList ]
    }
  },

  watch: {
    metricsList (newMetricsList) {
      this.localMetricsList = [ ...newMetricsList ]
    }
  },

  methods: {
    deselectMetrics (id) {
      this.$emit('deselect-metrics', id)
    },

    handleDragUpdate () {
      this.$emit('reorder-metrics-ids', this.localMetricsList.map(metrics => metrics.id))
    }
  }
}
</script>

<style>
.mc-selected-list {
  display: flex;
  flex-wrap: wrap;
}
.mc-selected-list .metrics {
  padding: 4px;
  margin: 0 0 4px 4px;
  border: 1px solid rgba(32, 159, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
  background-color: rgba(32, 159, 255, 0.1);
  color: #20a0ff;
  cursor: move;
}
.mc-selected-list .metrics i {
  transform: scale(0.6);
  cursor: pointer;
}
</style>
