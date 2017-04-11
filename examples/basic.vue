<template>
  <div>
    <dt-metrics-config
      v-model="visible"
      searchable
      :max-select-count="4"
      :groups="groups"
      :selected-list="selectedList"
      @change="selectedList = arguments[0]">
    </dt-metrics-config>
    <button @click="visible = true">打开</button>
  </div>
</template>

<script>
import Vue from 'vue'
import { Dialog, Loading, Button, Input } from 'element-ui'
import DtMetricsConfig from '..'
import GROUPS from './data.json'

[Dialog, Loading, Button, Input].forEach(component => Vue.use(component))

export default {
  name: 'basic',

  components: {
    DtMetricsConfig
  },

  data () {
    this.groups = GROUPS
    return {
      visible: false,
      selectedList: [{ id: '订单量', name: '订单量' }, { id: '交易额', name: '交易额' }, { id: '营业商户数', name: '营业商户数' }]
    }
  }
}
</script>
