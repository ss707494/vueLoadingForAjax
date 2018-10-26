# vue-loading-for-ajax
在vue中添加全局状态，监听请求发送及完成情况，便于在组件中添加loading或disabled状态

## Usage

```bash
npm i vue-loading-for-ajax --save
```
在vue中加入
```javascript
import Vur from 'vue'
import vueLoadingForAjax from 'vue-loading-for-ajax'
Vue.use(vueLoadingForAjax)
```
在请求中监听
```javascript
import vueLoadingForAjax from 'vue-loading-for-ajax'
// in ajax request (mabey in global)
let config
function beforeAjax() {
  config = vueLoadingForAjax.startAjax({url: '...'}) // this config has a id , it will use when stop 
}
function afterAjax() {
  vueLoadingForAjax.stopAjax(config)
}
```
在axios可以不用添加监听事件,插件中已经添加如下代码
```javascript
    axios.interceptors.request.use(config => {
      return loadingData.startAjax(config)
    })
    axios.interceptors.response.use(response => {
      loadingData.stopAjax(response.config)
      return response
    })
```
在vue组件中,每一实例都有一个isLoadingForUrl方法,用来判断该url是否正在发送请求
```vue
  isLoadingForUrl('getData') 
  // 在ele ui中button组件可以这样使用
  <el-button :loading="isLoadingForUrl('getData')">提交</el-button>
```

#### isLoadingForUrl 
##### 参数
url:判断该url是否在请求中
可以传字符串（可以是部分匹配），多个可以传数组或逗号(,)拼接


