# vue-metrics-config

> 基于 vue 的指标配置组件

## Install

``` bash
npm i vue-metrics-config
```

## Dependency
```
// 该组件依赖 element-ui，需要先组册 element-ui 相关组件
import { Dialog, Button, Input } from 'element-ui'

[Dialog, Button, Input].forEach(component => Vue.use(component))

// or
import ElementUI from 'element-ui'
Vue.use(ElementUI)
```

## Props

属性 | 类型 | 默认值 | 描述
---- | ---- | ---- | ----
groups | Array | [] | 指标分组
selected-list | Array | [] | 选中的指标
searchable | Boolean | false | 是否可搜索指标，默认不可搜索
max-select-count | Number | 无 | 最多可以选中几个指标，如果不设置，将不限制指标选中的数量
tip | String | 无 | 右上角的提示语
confirm-btn-disabled | Boolean | false | 确认按钮是否可以点击
title | String | 指标配置 | Dialog 标题
size | String | small | Dialog 大小，参见 [element-dialog](http://element.eleme.io/#/zh-CN/component/dialog#attributes)
top | String | 50px | Dialog 距顶部距离

## Evnets
事件名 | 描述 | 回调参数
---- | ---- | ----
change | 点击确认按钮时触发 | selectedList 选中的指标数组
temp-change | 选中项改变时触发（包括拖拽排序），不要在这个事件中改变 `selectedList`, 会导致选中状态不同步，改变 `selectedList` 请在 `change` 事件中，可以在这个事件中对其他状态进行更改，如确定按钮的「可点击」状态 | selectedList 选中的指标数组

## groups && selected-list 结构
```javascript
const selectedList = [{ id: '订单量', name: '订单量' }, { id: '交易额', name: '交易额' }, { id: '营业商户数', name: '营业商户数' }]

const groups = [{
  // group 信息，需要包含 id 和 name
  "id": "交易",
  "name": "交易",
  
  // items 里面每一项都是指标
  // 指标也都包含 id 和 name 属性
  "items": [{
    "id": "订单量",
    "name": "订单量"
  }, {
    "id": "交易额",
    "name": "交易额"
  }, {
    "id": "优惠力度",
    "name": "优惠力度"
  }, {
    "id": "饿了么补贴金额",
    "name": "饿了么补贴金额"
  }, {
    "id": "饿了么补贴力度",
    "name": "饿了么补贴力度"
  }, {
    "id": "商家自营销金额",
    "name": "商家自营销金额"
  }, {
    "id": "商家自营销力度",
    "name": "商家自营销力度"
  }, {
    "id": "单均价",
    "name": "单均价"
  }]
}]
```

## Usage

```javascript
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
import DtMetricsConfig from 'vue-metrics-config'
const GROUPS = [{
  "id": "交易",
  "name": "交易",
  "items": [{
    "id": "订单量",
    "name": "订单量"
  }, {
    "id": "交易额",
    "name": "交易额"
  }]
}, {
  "id": "商户",
  "name": "商户",
  "items": [{
    "id": "营业商户数",
    "name": "营业商户数"
  }, {
    "id": "有交易商户数",
    "name": "有交易商户数"
  }]
}, {
  "id": "流量",
  "name": "流量",
  "items": [{
    "id": "DAU",
    "name": "DAU"
  }, {
    "id": "转化率",
    "name": "转化率"
  }]
}, {
  "id": "用户",
  "name": "用户",
  "items": [{
    "id": "新客数",
    "name": "新客数"
  }, {
    "id": "用户数",
    "name": "用户数"
  }]
}, {
  "id": "物流",
  "name": "物流",
  "items": [{
    "id": "推单数",
    "name": "推单数"
  }, {
    "id": "接单数",
    "name": "接单数"
  }]
}]

export default {
  name: 'basic',

  components: {
    DtMetricsConfig
  },

  data () {
    this.groups = GROUPS
    return {
      visible: false,
      selectedList: [{ id: '订单量', name: '订单量' }, { id: '转化率', name: '转化率' }, { id: '推单数', name: '推单数' }]
    }
  }
}
</script>
```