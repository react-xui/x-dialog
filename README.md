<!--
 * @Descripttion: 
 * @Author: tianxiangbing
 * @Date: 2018-11-21 15:36:18
 * @LastEditTime: 2021-08-12 18:09:45
 * @github: https://github.com/tianxiangbing
 -->
# x-dialog

> reactjs的弹窗浮层组件 

![](https://react-plugin.github.io/x-dialog/demo-1.jpg)
![](https://react-plugin.github.io/x-dialog/demo-2.jpg)

我认为，每一个组件都应该有他自带的样式和属性事件回调配置。所以我会给x-dialog默认一套简单的样式，和各种默认的配置项。

演示地址： [x-dialog各种案例演示](https://react-plugin.github.io/x-dialog/)

源文件地址：[https://github.com/react-plugin/x-dialog](https://github.com/react-plugin/x-dialog)

## npm安装 

使用 [npm](https://www.npmjs.com/package/x-dialog) 安装, 运行

```bash
$ npm install x-dialog --save-dev
```
## 调用方式
```js
import Dialog from 'x-dialog';
import 'x-dialog/lib/index.css';
<Dialog 
      isShow={true}
      title="这是一个例子"
      className="myClass"
      timer=2000
      width=300
      height=300
      buttons=<div><button className="d-ok" onClick={this.hide.bind(this)}>我知道了</button><button className="d-cancel" onClick={this.hide.bind(this)}>关闭</button></div>
      afterShow:()=>alert('我显示出来了')
      afterHide:()=>alert('我又隐藏了')
        >
    <div>这里是弹窗的内容区域</div>
</Dialog>
```
或者js函数方式调用，返回`Dialog`的实例
```
let ref = Dialog.show({title:'标题',children:'寒梅著花未感动中国械fd',afterHide:()=>alert('我又隐藏了')});
setTimeout(()=>{
  ref.hide();
},4000)
Dialog.hideAll();//关闭所有
Dialog.hide();//关闭当前
```
## 属性方法
### `isShow` :bool类型
    控制弹窗的显示隐藏的.
### `title`:string类型
    为空时，不显示标题.
### `className`:string类型
    弹窗的样式类
### `timer`:number类型
    定时关闭，可不传。
### `width`:number类型
    弹窗宽度，不足时，内容区域出现上下滚动
### `height`:number类型
    弹窗宽度，不足时，内容区域出现上下滚动
### `buttons`:node类型
    自定义操作区域的按钮,为false类型时不显示操作区域，不传时默认显示 `确定、取消`
### `okCallback`:func类型
    当默认按钮的情况下时，点击`确定`时的回调方法，点`取消`时直接隐藏，如果需要定制更多的方法，建议传递`buttons`属性。
### `afterShow`:func类型
    显示的回调方法
### `afterHide`:func类型
    关闭隐藏时的回调方法
### `local`:object
    国际化语言配置,默认中文，可以传递x-i18n中的其他语言包
### `draggable`:bool
    是否可以拖动
### `dragHandle`:string
    可拖动的handle，只有在`draggable`为`true`时有效，默认为`.dialog-title`
### `maskHide`:bool
    是否点击背景关闭弹窗，仅在`mask`为`true`时有效，默认值`true`
## 全局方法
    全局方法是Dialog的静态调用方法，方便于js函数的形式使用
## show:config
    显示弹窗,参数为Dialog的组件的props,content对应其内容
## hide
    关闭获取焦点的窗口，如果无，则关闭最后一个打开的窗口
## hideAll
    关闭所有显示的窗口
## zIndex 
    zIndex值，默认1000
## isMax 
    是否显示最大化、还原按钮
## maxContainer
    最大化的容器dom，默认为body
## max :bool
    是否最大化显示,与maxCotainer相结合
### 关于作者
[https://github.com/tianxiangbing](https://github.com/tianxiangbing)