<template>
  <div>
    <dt-metrics-config
      v-model="visible"
      searchable
      tip="注：需要关注 4 个指标"
      :confirm-btn-disabled="confirmBtnDisabled"
      :groups="groups"
      :selected-list="selectedList"
      @temp-change="handleTempChange"
      @change="selectedList = arguments[0]">
    </dt-metrics-config>
    <button @click="visible = true">打开</button>
  </div>
</template>

<script>
import Vue from 'vue'
import { Dialog, Button, Input } from 'element-ui'
import DtMetricsConfig from '../src'
import GROUPS from './data.json'

[Dialog, Button, Input].forEach(component => Vue.use(component))

export default {
  name: 'advance',

  components: {
    DtMetricsConfig
  },

  data () {
    this.groups = GROUPS
    return {
      visible: false,
      confirmBtnDisabled: true,
      selectedList: []
    }
  },

  methods: {
    handleTempChange (tempSelectedList) {
      this.confirmBtnDisabled = tempSelectedList.length !== 4
    }
  }
}
</script>
