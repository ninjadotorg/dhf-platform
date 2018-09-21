const setStorage = function (key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve()
    })
  })
}

const getStorage = function (key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, result => {
      resolve(result[key])
    })
  })
}

const clearStorage = function () {
  return new Promise((resolve, reject) => {
    chrome.storage.local.clear(() => {
      resolve()
    })
  })
}

module.exports = {
  setStorage,
  getStorage,
  clearStorage
}
