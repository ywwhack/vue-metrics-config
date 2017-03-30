<template>
  <div>
    <metrics-config
      v-model="visible"
      :groups="groups"
      :selected-metrics-ids="selectedIds"
      @change="handleChange">
    </metrics-config>
    <button @click="visible = true">打开</button>
  </div>
</template>

<script>
import MetricsConfig from '../src'
import GROUPS from './data.json'

export default {
  name: 'basic',

  components: {
    MetricsConfig
  },

  data () {
    this.groups = GROUPS
    return {
      visible: false,
      selectedIds: ['订单量', '交易额', '营业商户数']
    }
  },

  methods: {
    handleChange (newMetricsList) {
      this.selectedIds = newMetricsList.map(metrics => metrics.id)
    }
  }
}
</script>
