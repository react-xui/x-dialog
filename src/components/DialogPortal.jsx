/*
 * Created with Visual Studio Code.
 * github: https://github.com/React-Plugin/x-dialog
 * User: 田想兵
 * Date: 2017-05-16
 * Time: 20:00:00
 * Contact: 55342775@qq.com
 */
import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Draggable from 'react-draggable';
// import EleResize from 'jsresize';
let lastDialog = null, dialogList = [];
export default class Dialog extends PureComponent {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    mask: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    zIndex: PropTypes.number,
    height: PropTypes.any,
    buttons: PropTypes.any,
    closeIcon: PropTypes.node,
    maxIcon: PropTypes.node,
    resetIcon: PropTypes.node,
    afterHide: PropTypes.func,
    afterShow: PropTypes.func,
    okCallback: PropTypes.func,
    dragHandle: PropTypes.string,
    draggable: PropTypes.bool,
    maskHide: PropTypes.bool,
    isMax: PropTypes.bool,
    titleClassName: PropTypes.string,
    max: PropTypes.bool,
  };
  static defaultProps = {
    isShow: false,
    mask: true,
    className: "",
    zIndex: 0,
    maskHide: true,
    closeIcon: <button className="dialog-close" ><span>×</span></button>,
    maxIcon: <button className="dialog-max" ><span>☐</span></button>,
    resetIcon: <button className="dialog-reset"><span>❐</span></button>,
    dragHandle: '.dialog-title',
    draggable: false,
    afterHide: () => { },
    afterShow: () => { },
    okCallback: () => { },
    height: 'auto',
    width: 'auto',
    container: document.body,
    isMax: false,
    titleClassName: '',
    max: false,
  };
  container = document.documentElement;
  bounds = 'body';
  constructor(props) {
    super(props);
    this.id = props.id || +new Date();
    this.dialog = null;
    this.state = {
      isShow: props.isShow, defaultPosition: props.defaultPosition || {},
      height: props.height, width: props.width, fixed: props.fixed,
      draggable: props.draggable, status: 'reset',
      mask: props.mask,
    };
    this.keyBind = this.keyBind.bind(this); //方便移除事件绑定.每次bind会生成新的对象

    this.maskWH = {
      width: Math.max(document.documentElement.offsetWidth, document.body.scrollWidth),
      height: Math.max(document.documentElement.offsetHeight, document.body.scrollHeight, document.documentElement.clientHeight)
    }
    //容器配置
    if (document.body != this.props.container && typeof this.props.container === 'string') {
      this.container = document.querySelector(this.props.container);

      this.maskWH = {
        width: this.container.clientWidth,
        height: this.container.clientHeight
      }
      // console.log('position', this.container.style.position)
      // let node = this.container;
      // //container只支持传dom或字符串
      // if (typeof this.container === 'string') {
      //   node = document.querySelector(this.container);
      // }
      // let nodeStyle = window.getComputedStyle(node);
      // console.log(nodeStyle)
      this.bounds = this.props.container;
      // console.log({left: 0, top: 0, right: this.container.clientWidth, bottom: this.container.clientHeight})
      // this.bounds = {left: 0, top: 0, right: this.container.clientWidth, bottom: this.container.clientHeight};
    } else if (document.body == this.props.container) {
      this.container = document.documentElement;
    } else {
      this.container = this.props.container;
      this.maskWH = {
        width: this.container.clientWidth,
        height: this.container.clientHeight
      }
    }
    let position = window.getComputedStyle(this.container).position;
    if (document.body !== this.props.container && (position == 'static' || position == '')) {
      this.container.style.position = 'relative';
    }
    this.setDialogRef = element => {
      this.dialog = element;
    };
    this.dragPosition = { x: 0, y: 0 };
  }
  componentWillReceiveProps(newProps) {
    // console.log(newProps.isShow, this.state.isShow);
    if (newProps.isShow && !this.state.isShow) {
      this.show(newProps);
    } else if (!newProps.isShow && this.state.isShow) {
      this.hide(newProps);
    }
  }
  // shouldComponentUpdate(newProps,nextState){
  //   return newProps.isShow!==this.props.isShow || this.state.isShow!==nextState.isShow ||  JSON.stringify(this.state.defaultPosition) !== JSON.stringify(nextState.defaultPosition);
  // }
  timerHide(newProps) {
    if (newProps.timer) {
      this.clearTimer();
      this.timer = setTimeout(() => {
        this.state.isShow && this.hide();
      }, newProps.timer);
    }
  }
  componentWillUnmount() {
    this.clearTimer();
    // console.log("unmount");
    // lastDialog = null;
    this.destory();
    document.removeEventListener("keydown", this.keyBind);
    // window.removeEventListener('resize', this.computeHeight, false);
    window.cancelAnimationFrame && this.frameId ? window.cancelAnimationFrame(this.frameId) : null;
  }
  //销毁时更新dialogList;
  destory() {
    dialogList.forEach((item, i) => {
      if (item.id === this.id) {
        dialogList.splice(i, 1)
      }
    })
    let maxContainer = this.getMaxContainer();
    maxContainer.className = maxContainer.className.replace('overflowhidden', '');
    this.props.updateList(dialogList);
  }
  componentDidMount() {
    // console.log(this.dialog)
    document.addEventListener("keydown", this.keyBind);
    if (this.props.isShow && this.state.isShow == false) {
      this.show(this.props)
    }
    this.setPosition(this.props)
    if (this.props.max) {
      setTimeout(() => {
        this.maxreset()
      }, 0)
    }
    // lastDialog = this;
    dialogList.push({ instance: this, id: this.id });
    // window.addEventListener('resize', this.computeHeight, false)
    window.requestAnimationFrame ? this.frameId = window.requestAnimationFrame(this.checkPosition) : null;
  }
  // computeHeight=()=>{
  //   if(this.state.status =='max'){
  //     let maxContainer = document.body;
  //     if(typeof this.props.maxContainer === 'string'){
  //       maxContainer = document.querySelector(this.props.maxContainer)
  //     }else if (typeof this.props.maxContainer === 'object') {
  //       maxContainer = this.props.maxContainer;
  //     }
  //     var maxWH = {
  //       width: maxContainer.scrollWidth ,
  //       height: maxContainer.scrollHeight
  //     }
  //     this.setState({...maxWH},()=>{
  //       this.setPosition(this.props);
  //       this.props.resizeCallback && this.props.resizeCallback(this.state.status);
  //     })
  //   }
  // }
  keyBind = (e) => {
    // console.log(e);
    if (e.keyCode === 27) {
      // console.log(this.dialog)
      this.hide();
    }
    // if(e.keyCode ==13){
    //   this.setPosition(this.props);
    // }
  }
  checkPosition = () => {
    let height = this.refs.dialogContent.offsetHeight;
    if (this.oldHeight !== height) {
      this.oldHeight = height;
      let stop = this.container.scrollTop;
      let conHeight = this.container.clientHeight;
      let posY = this.state.defaultPosition.y + height + this.dragPosition.y;
      let buttomY = conHeight + stop;
      // let pos = 
      //判断是否超出底边界
      if (posY > buttomY) {
        let y = buttomY - height - this.dragPosition.y;
        // this.state.defaultPosition.y + this.dragPosition.y + this.refs.dialogContent;
        this.setState({ defaultPosition: { x: this.state.defaultPosition.x, y } }, () => {
          //判断头部是否超出顶边界
          //如果超出，修改内容高度
          try {
            let cs = window.getComputedStyle(this.refs.dialogContent);
            let yy = parseInt(cs.top) + parseInt(cs.getPropertyValue('transform').match(/(\d+)/gi)[5] || 0);
            if (yy < 0) {
              let headHeight = this.refs.dialogHeader ? this.refs.dialogHeader.offsetHeight : 0;
              let footHeight = this.refs.dialogFooter ? this.refs.dialogFooter.offsetHeight : 0;
              let bodyHeight = conHeight - footHeight - headHeight - 2;
              let maxHeight = Math.max(0, bodyHeight)
              this.refs.dialogBody.style.maxHeight = maxHeight + "px";
              this.setState({ defaultPosition: { x: this.state.defaultPosition.x, y: y + (this.refs.dialogBody.scrollHeight - maxHeight) } });
            }
          } catch (ex) {
            console.error(ex);
          }
        });
      }
    }
    window.requestAnimationFrame ? this.frameId = window.requestAnimationFrame(this.checkPosition) : null;
  }
  clearTimer() {
    this.timer && clearTimeout(this.timer);
  }
  setPosition = (newProps) => {
    let _this = this;
    if (!this.dialog || this.props.defaultPosition!==undefined) {
      return;
    }
    _this.dialog.className ? _this.dialog.className += " opacity-animate" : undefined;
    // console.log(this.refs.dialogContent.offsetHeight)
    // console.log(-this.refs.dialogContent.offsetLeft,-this.refs.dialogContent.offsetTop)
    _this.refs.dialogContent.style.height = this.state.height//this.props.height || 'auto';
    _this.refs.dialogBody.style.height = this.props.bodyHeight ? this.props.bodyHeight : 'auto';
    let ch = this.container.clientHeight;
    let dh = _this.refs.dialogContent.offsetHeight
    let stop = this.container.scrollTop;
    let ot = parseInt(_this.refs.dialogContent.offsetTop);
    let sl = this.container.scrollLeft;
    let x = 0, y = 0, x2 = null, y2 = null;
    if (ot < 0) {
      y = 0;
    } else {
      y = Math.max(0, parseInt((ch - dh) / 2)) + stop;
    }
    x = sl + parseInt((this.container.offsetWidth - _this.refs.dialogContent.offsetWidth) / 2);
    //固定显示在四周 [left,right,top,bottom]
    if (this.state.fixed) {
      if (this.state.fixed.indexOf('left') !== -1) {
        x = 0;
        x2 = null;
      }
      if (this.state.fixed.indexOf('right') !== -1) {
        x = null;
        x2 = 0;
      }
      if (this.state.fixed.indexOf('top') !== -1) {
        y = 0;
        y2 = null;
      }
      if (this.state.fixed.indexOf('bottom') !== -1) {
        y = null;
        y2 = 0;
      }
    }
    // console.log(ot,y)
    if (x !== this.state.x || y !== this.state.y || x2 !== this.state.x2 || y2 !== this.state.y2) {
      _this.setState({
        defaultPosition: {
          x,
          y,
          x2,
          y2
        },
      }, () => {
        _this.props.afterShow();
      });
    }
    let height = parseInt(_this.refs.dialogContent.offsetHeight);
    let maxHeight =
      newProps.height === 'auto' || !newProps.height ? parseInt(this.container.clientHeight) : newProps.height;
    let headHeight = _this.refs.dialogHeader ? _this.refs.dialogHeader.offsetHeight : 0;
    let footHeight = _this.refs.dialogFooter ? _this.refs.dialogFooter.offsetHeight : 0;
    let bodyHeight =
      maxHeight -
      headHeight -
      footHeight - 2;
    if (height >= maxHeight) {
      _this.refs.dialogContent.style.height = maxHeight + "px";
      _this.refs.dialogBody.style.height = Math.max(0, bodyHeight) + "px";
      // console.log(bodyHeight);
      // console.log(
      //   maxHeight,
      //   this.refs.dialogHeader.offsetHeight,
      //   this.refs.dialogFooter.offsetHeight,
      //   this.refs.dialogBody.style.height
      // );
    } else {
      _this.refs.dialogBody.style.maxHeight = Math.max(0, bodyHeight) + "px";
    }
    // _this.refs.dialogContent.style.zIndex = _this.props.zIndex;
    // _this.dialog.style.height = _this.refs.dialogBody.clientHeight+'px';
    // _this.dialog.style.width = _this.refs.dialogBody.clientWidth+'px';
  }
  show(newProps) {
    // console.log("show");
    let _this = this;
    this.clearTimer();
    this.setState({ isShow: true }, () => {
      this.setPosition(newProps);
      let st = setTimeout(() => {
        clearTimeout(st);
        this.setPosition(newProps);
      }, 0);
      //这里绑定resize事件进行maxheight值重置
      // EleResize.on(this.refs.dialogContent,()=>{
      //   this.resetMaxHeight(newProps);
      // })
    });
    this.timerHide(newProps);
  }
  resetMaxHeight(newProps) {
    let _this = this;
    let maxHeight = newProps.height || parseInt(this.container.clientHeight);
    let headHeight = _this.refs.dialogHeader ? _this.refs.dialogHeader.offsetHeight : 0;
    let footHeight = _this.refs.dialogFooter ? _this.refs.dialogFooter.offsetHeight : 0;
    let bodyHeight =
      maxHeight -
      headHeight -
      footHeight - 2;
    // debugger
    // let cs = window.getComputedStyle(this.refs.dialogContent);
    // let y = +cs.top + cs.getPropertyValue('transform').match(/(\d+)/gi)[5] || 0;
    this.refs.dialogBody.style.maxHeight = Math.max(0, bodyHeight) + "px";
  }
  hide() {
    // console.log("hide");
    // this._hide();
    if (this.dialog) {
      let cls = this.dialog.className;
      this.dialog.addEventListener('transitionend', this._hide.bind(this));
      this.dialog.className = cls.replace(
        /(opacity-animate)?/,
        " opacity-animate-hide "
      );
      this.destory();
    }
    // this._hide();
    // setTimeout(this._hide.bind(this), 3000);
  }
  _hide() {
    this.setState({ isShow: false }, () => {
      this.props.afterHide(this.id);
    });
  }
  maskHandle = () => {
    this.props.maskHide && this.hide();
  }
  onDragStop = (e, data) => {
    this.dragPosition = data;
  }
  renderHTML() {
    let { local, buttons, okCallback } = this.props;
    if (typeof buttons === "undefined") {
      this.buttons = (
        <div>
          <button className="d-ok" onClick={okCallback.bind(this)}>
            {local.submit}
          </button>
          <button className="d-cancel" onClick={this.hide.bind(this)}>
            {local.cancel}
          </button>
        </div>
      );
    } else if (buttons) {
      this.buttons = buttons;
    } else {
      this.buttons = undefined;
    }
    // console.log(this.buttons);
    // console.log(this.state.bounds)
    let maskStyle = {}
    if (this.container == document.body || this.container == document.documentElement) {
      maskStyle = {
        position: 'fixed'
      }
    } else {
      maskStyle = {
        height: this.container.scrollHeight + 'px'
      }
    }
    if (this.state.isShow) {
      // console.log(this.bounds)
      let position;
      if (!this.state.draggable) {
        position = { x: 0, y: 0 }
      }
      let DD = <Draggable onStop={this.onDragStop} position={position} disabled={!this.state.draggable} handle={this.props.dragHandle || ".dialog-title"} bounds={this.bounds}>{this.renderDialog()}</Draggable>;
      if (this.state.mask) {
        return <div
          className={"x-dialog-continer"
          }
        >
          <div className="x-dialog" id={this.id} ref={this.setDialogRef} style={{ zIndex: this.props.zIndex }}>
            {DD}
            <div style={maskStyle} className="x-dialog-mask" style={{ zIndex: this.props.zIndex - 1, ...this.maskWH }} onClick={this.maskHandle}></div>
          </div>
        </div>
      } else {
        return <div className="x-dialog" id={this.id} ref={this.setDialogRef} style={{ zIndex: this.props.zIndex }}>
          {DD}
        </div>
      }
    } else {
      return null;
    }
    // return this.state.isShow
    //   ? <div
    //     className={
    //       this.props.mask
    //         ? "x-dialog-continer x-dialog-mask"
    //         : "x-dialog-continer"
    //     }
    //     style={{ zIndex: this.props.zIndex }}
    //   >
    //     <div className="x-dialog" ref="dialog">
    //       <Draggable bounds="parent">{this.renderDialog()}</Draggable>
    //     </div>
    //   </div>
    //   : <div />;
  }
  static hide() {
    if (dialogList.length) {
      // lastDialog = dialogList[0];
      // dialogList.forEach(item => {
      //   // console.log(item)
      //   if (lastDialog.instance.zIndex <= item.instance.zIndex) {
      //     lastDialog = item;
      //   }
      // });
      dialogList.sort((a, b) => {
        a.instance.zIndex - b.instance.zIndex;
      })
      // lastDialog.instance.hide();
      dialogList[dialogList.length - 1].instance.hide();
    }
  }
  static hideAll() {
    // dialogList.forEach(item => {
    //   item.instance.hide()
    // });
    for (let l = dialogList.length - 1; l >= 0; l--) {
      dialogList[l].instance.hide();
    }
  }
  onFocus = (e) => {
    // 阻止与原生事件的冒泡
    if (e.target && (e.target.tagName.toLowerCase() == 'button' || e.target.tagName.toLowerCase() == 'a')) {
      return;
    }
    // lastDialog = this;
    this.props.onClick(e);
  }
  getMaxContainer() {
    let maxContainer = document.body;
    if (typeof this.props.maxContainer === 'string') {
      maxContainer = document.querySelector(this.props.maxContainer)
    } else if (typeof this.props.maxContainer === 'object') {
      maxContainer = this.props.maxContainer;
    }
    return maxContainer;
  }
  // status = 'reset';
  //最大化还原
  maxreset = (e) => {
    let maxContainer = this.getMaxContainer();
    if (this.state.status === 'reset') {
      this.oldprops = { width: this.state.width, hegiht: this.state.height, mask: this.state.mask, fixed: this.state.fixed, draggable: this.state.draggable, defaultPosition: this.state.defaultPosition }
      var maxWH = {
        fixed: ["left", "top", "right", "bottom"],
        defaultPosition: { x: 0, x2: 0, y: 0, y2: 0 },
        width: 'auto',
        height: 'auto',
        draggable: false,
        // mask:false
      }
      maxContainer.scrollTo(0, 0);
      if (maxContainer == document.body) {
        window.scrollTo(0, 0);
      }
      maxContainer.className += ' overflowhidden';
      this.setState({ status: 'max', ...maxWH }, () => {
        // this.setPosition(this.props);
        this.props.resizeCallback && this.props.resizeCallback(this.state.status);
      })
    } else {
      this.status = 'reset';
      maxContainer.className = maxContainer.className.replace('overflowhidden', '');
      this.setState({ status: 'reset', ...this.oldprops }, () => {
        this.setPosition(this.props);
        this.props.resizeCallback && this.props.resizeCallback(this.state.status);
      })
    }
    this.props.maxreset && this.props.maxreset(this.state.status);
  }
  computeWH = () => {
    if (status === 'max') {
      this.setState({ height: document.body.clientHeight, width: document.body.clientWidth })
    }
  }
  renderDialog() {
    //同步zindex至this
    let { local, buttons, okCallback, zIndex } = this.props;
    this.zIndex = zIndex;
    let { x, x2, y, y2 } = this.state.defaultPosition;
    let position = {
      left: x === null ? 'auto' : x,
      right: x2 === null ? 'auto' : x2,
      top: y === null ? 'auto' : y,
      bottom: y2 === null ? 'auto' : y2
    }
    return <div
      className={"dialog-content " + this.props.className}
      ref="dialogContent"
      style={{
        width: this.state.width || "auto",
        height: this.state.height,
        zIndex: zIndex,
        ...position
      }}
    >
      {this.props.title
        ? <div className={"dialog-title " + this.props.titleClassName} ref="dialogHeader">
          <h4>{this.props.title}</h4>
          <div
            onClick={this.hide.bind(this)}
            className="dialog-close-con"
          >
            {this.props.closeIcon}
          </div>
          {this.props.isMax ?
            <div onClick={this.maxreset} className="dailog-resetmax">
              {this.state.status === 'max' ? this.props.resetIcon : this.props.maxIcon}
            </div>
            : undefined
          }
        </div>
        : undefined}
      <div className="dialog-body" ref="dialogBody" onClick={this.onFocus}>
        {this.props.children}
      </div>
      <div ref="dialogFooter">
        {this.buttons
          ? <div className="dialog-action">{this.buttons}</div>
          : undefined}
      </div>
    </div>
  }
  render() {
    return this.renderHTML();
  }
}
