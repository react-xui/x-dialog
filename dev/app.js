import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from '../src/index';
import '../src/_index.scss';
import en from 'x-i18n/lib/components/en';
let local= en.Dialog;
var appElement = document.getElementById('example');
Dialog.zIndex = 999;
window.Dialog = Dialog;
class Test extends React.Component{
  constructor(props){
    super(props);
    console.log('constructor.....')
    this.state={text:'',height:''}
  }
  componentDidMount(){
    // this.setState({text:Math.random()})
    console.log('componentDidMount.....'+this.state.text);
  }
  onclick(){
    this.setState({text:Math.random(),height:300})
  }
  render(){
    console.log('render.....')
    return <div style={{height:this.state.height||'auto'}}>test......{this.state.text} <button onClick={this.onclick.bind(this)}>click</button></div>
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dialog:{ isShow: false },isShowDialog2:false,content:'我是内容'};
  }
  noAction() {
    // this.setState({ isShow:true });
    // this.replaceState()
    let state ={isShow:true,title:"我是标题啊",mask:false,defaultPosition:{
      x:200,y:100,x2:10,y2:20
    }} ;
    this.setState({"dialog":state});
  }
  defaultDialog(){
    let state ={isShow:true,max:true,title:"我是标题啊",zIndex:999, draggable:true,mask:false,local:local,okCallback:()=>{
      alert('我点了确定')
    },afterHide:()=>{
      this.state.dialog.isShow = false;
      this.setState(this.state)
    }};    
    this.setState({"dialog":state});
  }
  noheadfoottimer(){
    let state = {isShow:true,timer:2000,buttons:false};
    this.setState({"dialog":state});
  }
  setWH(){
    let state = {isShow:true,title:'固定宽高的浮层',height:150,width:300};
    this.setState({"dialog":state});
  }
  showCallback(){
    let state ={isShow:true,title:"这是一个显示的回调例子",draggable:true, afterShow:()=>alert('我显示出来了')};
    this.setState({"dialog":state});
  }
  hideCallback(){
    let state ={isShow:true,title:"这是一个隐藏的回调例子",afterHide:()=>alert('我又隐藏了')};
    this.setState({"dialog":state});
  }
  open(e){
    e.stopPropagation();
    Dialog.show({content:'adfs'})
  }
  showButtons(){
    let state ={isShow:true,width:500,title:"这是一个自定义按钮的例子",buttons: <div><button className="d-ok" onClick={this.open.bind(this)}>我知道了</button><button className="d-cancel" onClick={this.hide.bind(this)}>关闭</button></div>};
    this.setState({"dialog":state});
  }
  hide(){
    this.setState({"dialog":{isShow:false}});
  }
  
  showClassName() {
    let state = {
      isShow: true,
      title: "这是一个传递样式的例子1",
      className:"myClass",
      zIndex:888,
      width:500
    };
    this.setState({dialog:state});
  }
  funcDialog(){
    let ref = Dialog.show({title:'标题',mask:false,draggable:true,children:'寒梅著花未感动中国械fd',afterHide:()=>alert('我又隐藏了')});
  }
  hideAll=()=>{
    Dialog.hideAll();
  }
  showCatainer(){
    Dialog.show({isMax:true,maxContainer:'#container', 
    mask:true,
    container:'#container', title:'标题',draggable:true,
    children:<Test/>,
    max:true,
    afterHide:()=>alert('我又隐藏了')})(f=>{
      setTimeout(()=>{
        // f.hide();
        // Dialog.hide();
      },10000)
    })
    // setTimeout(()=>{
      // f.hide();
      // // Dialog.hide();
      // let str = this.state.content;
      // for(let i = 0 ;i <10;i++){
      //   str+=str;
      // }
      // document.getElementsByClassName('dialog-body')[0].innerHTML=str;
    // },2000)
  }
  reopen(e){
    e.stopPropagation();
    Dialog.show({mask:true, title:<button>标题</button>,draggable:true,children:'寒梅著花未感动中国械fd',afterHide:()=>alert('我又隐藏了')})(f=>{
    })
    this.setState({ext:123})
  }
  render() {
    console.log( {...this.state.dialog})
    return (
      <div>
        <button onClick={this.hideAll}>隐藏所有弹窗</button>
        <button onClick={this.funcDialog.bind(this)}>js调用</button>
        <button onClick={this.defaultDialog.bind(this)}>默认弹窗</button>
        <button onClick={this.noAction.bind(this)}>不带按钮</button>
        <button onClick={this.noheadfoottimer.bind(this)}>没有头尾定时关闭</button>
        <button onClick={this.setWH.bind(this)}>固定宽高的弹窗</button>
        <button onClick={this.showCallback.bind(this)}>显示的回调方式</button>
        <button onClick={this.hideCallback.bind(this)}>隐藏的回调方式</button>
        <button onClick={this.showButtons.bind(this)}>自定义按钮</button>
        <button onClick={this.showClassName.bind(this)}>传递样式名称</button>
        <button onClick={this.showCatainer.bind(this)}>弹在指定区域</button>
        <div className="container" style={{backgroundColor:'#cccccc',height:'300px',overflow:'auto'}} id="container"></div>
        <Dialog 
        {...this.state.dialog}
        >
          <div style={{background:"red"}}>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <button onClick={this.reopen.bind(this)}>再弹一个</button>
          <button onClick={()=>{
            this.setState({ext:333})
          }}>test</button>
          {this.state.ext}
          <a className="x-dialog-close">close1</a>
          <a className="x-dialog-close">close2</a>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <div>You're looking at an example modal in the dashboard theme.</div>
          <button onClick={()=>{this.setState({higher:!this.state.higher})}}>点我升高</button>
          {this.state.higher &&<div style={{height:400}}></div>}
          </div>
        </Dialog>
        <button onClick={e=>{
          this.setState({isShowDialog2:true})
        }}>第二弹窗</button>
        
      </div>
    )
  }
}
ReactDOM.render(<App />, appElement);