<template>
  <draggable
    element="ul"
    class="mc-selected-list"
    :list="localList"
    @update="handleDragUpdate">
    <li
      class="metrics"
      v-for="metrics in localList"
      :key="metrics.name">
      {{ metrics.name }}
      <i
        class="el-icon-close"
        @click="deselectMetrics(metrics)"></i>
    </li>
  </draggable>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'dt-selected-list',

  components: {
    Draggable
  },

  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      localList: [ ...this.data ]
    }
  },

  watch: {
    data (newData) {
      this.localList = [ ...newData ]
    }
  },

  methods: {
    deselectMetrics (metrics) {
      this.$emit('deselect-metrics', metrics)
    },

    handleDragUpdate () {
      this.$emit('reorder-list', this.localList)
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
