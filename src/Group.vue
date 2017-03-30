<template>
  <div class="mc-group">
    <div class="name" :style="nameStyle">{{ data.name }}：</div>
    <ul class="metrics" :style="metricsStyle">
      <li
        v-for="metrics in data.items"
        :key="metrics.id"
        :class="['metrics-item', { ['metrics-selected']: isMetricsSelected(metrics.id) }]"
        @click="toggleSelect(metrics.id)">
        {{ metrics.name }}
      </li>
    </ul>
  </div>
</template>

<script>
const FONT_FACTOR = 16

export default {
  name: 'y-group',

  props: {
    maxNameLength: Number,
    
    data: {
      type: Object,
      required: true
    },

    selectedIds: {
      type: Array,
      default () {
        return []
      }
    }
  },

  computed: {
    nameStyle () {
      return { width: `${FONT_FACTOR * this.maxNameLength}px` }
    },

    metricsStyle () {
      return { width: `calc(100% - ${FONT_FACTOR * this.maxNameLength}px)` }
    }
  },

  methods: {
    isMetricsSelected (id) {
      return this.selectedIds.indexOf(id) > -1
    },

    toggleSelect (id) {
      const selected = this.isMetricsSelected(id)
      // 向父级触发事件的时候，需要将选中状态取反
      this.$emit('change', {
        id,
        selected: !selected
      })
    }
  }
}
</script>

<style>
.mc-group {
  display: flex;
  margin-top: 16px;
  color: #475669;
}
.mc-group .name {
  margin-right: 10px;
  font-size: 14px;
}
.mc-group .metrics {
  display: flex;
  flex-wrap: wrap;
}
.mc-group .metrics-item {
  padding: 4px;
  margin: 0 8px 6px 0;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
.mc-group .metrics-selected {
  background-color: rgba(32, 159, 255, 0.1);
  border-color: rgba(32, 159, 255, 0.2);
  color: #20a0ff;
}
</style>
