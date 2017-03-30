export function expandMetricsGroups (metricsGroups, reverse = false) {
  const allMetrics = {}

  let keyPropName
  let valuePropName
  if (reverse) {
    keyPropName = 'name'
    valuePropName = 'id'
  } else {
    keyPropName = 'id'
    valuePropName = 'name'
  }

  metricsGroups.forEach(metricsGroup => {
    metricsGroup.items.forEach(metrics => {
      allMetrics[metrics[keyPropName]] = metrics[valuePropName]
    })
  })

  return allMetrics
}
