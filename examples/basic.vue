<template>
  <div>
    <metrics-config
      v-model="visible"
      :groups="groups"
      :selected-list="selectedList"
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
      selectedList: [{ id: '订单量', name: '订单量' }, { id: '交易额', name: '交易额' }, { id: '营业商户数', name: '营业商户数' }]
    }
  },

  methods: {
    handleChange (newMetricsList) {
      this.selectedList = newMetricsList
    }
  }
}
</script>
