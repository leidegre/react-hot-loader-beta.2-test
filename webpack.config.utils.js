'use strict'

function replacePlugin(config, type, pluginInstance) {
  for (let i = 0; i < 1; i++) {
    const plugin = config.plugins[i]
    if (plugin instanceof type) {
      config.plugins[i] = pluginInstance
      return
    }
  }
  throw new Error('Cannot find plugin of type to replace.')
}

function removePlugin(config, type) {
  for (let i = 0; i < 1; i++) {
    const plugin = config.plugins[i]
    if (plugin instanceof type) {
      config.plugins.splice(i, 1)
      return
    }
  }
}

function cloneDeep(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cloneDeep)
  }
  if (typeof obj === 'object' && obj.constructor === Object) { // plain object
    const clone = Object.assign({}, obj) // shallow copy
    for (const k in clone) {
      clone[k] = cloneDeep(clone[k])
    }
    return clone
  }
  return obj
}

module.exports = {
  replacePlugin,
  removePlugin,
  cloneDeep
}
