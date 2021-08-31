"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDraggable = require("react-draggable");

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created with Visual Studio Code.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * github: https://github.com/React-Plugin/x-dialog
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * User: 田想兵
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Date: 2017-05-16
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Time: 20:00:00
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Contact: 55342775@qq.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


// import EleResize from 'jsresize';
var lastDialog = null,
    dialogList = [];

var Dialog = function (_PureComponent) {
  _inherits(Dialog, _PureComponent);

  function Dialog(props) {
    _classCallCheck(this, Dialog);

    var _this2 = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, props));

    _this2.container = document.documentElement;
    _this2.bounds = 'body';

    _this2.keyBind = function (e) {
      // console.log(e);
      if (e.keyCode === 27) {
        // console.log(this.dialog)
        _this2.hide();
      }
      // if(e.keyCode ==13){
      //   this.setPosition(this.props);
      // }
    };

    _this2.checkPosition = function () {
      var height = _this2.refs.dialogContent.offsetHeight;
      if (_this2.oldHeight !== height) {
        _this2.oldHeight = height;
        var stop = _this2.container.scrollTop;
        var conHeight = _this2.container.clientHeight;
        var posY = _this2.state.defaultPosition.y + height + _this2.dragPosition.y;
        var buttomY = conHeight + stop;
        // let pos = 
        //判断是否超出底边界
        if (posY > buttomY) {
          var y = buttomY - height - _this2.dragPosition.y;
          // this.state.defaultPosition.y + this.dragPosition.y + this.refs.dialogContent;
          _this2.setState({ defaultPosition: { x: _this2.state.defaultPosition.x, y: y } }, function () {
            //判断头部是否超出顶边界
            //如果超出，修改内容高度
            try {
              var cs = window.getComputedStyle(_this2.refs.dialogContent);
              var yy = parseInt(cs.top) + parseInt(cs.getPropertyValue('transform').match(/(\d+)/gi)[5] || 0);
              if (yy < 0) {
                var headHeight = _this2.refs.dialogHeader ? _this2.refs.dialogHeader.offsetHeight : 0;
                var footHeight = _this2.refs.dialogFooter ? _this2.refs.dialogFooter.offsetHeight : 0;
                var bodyHeight = conHeight - footHeight - headHeight - 2;
                var maxHeight = Math.max(0, bodyHeight);
                _this2.refs.dialogBody.style.maxHeight = maxHeight + "px";
                _this2.setState({ defaultPosition: { x: _this2.state.defaultPosition.x, y: y + (_this2.refs.dialogBody.scrollHeight - maxHeight) } });
              }
            } catch (ex) {
              console.error(ex);
            }
          });
        }
      }
      window.requestAnimationFrame ? _this2.frameId = window.requestAnimationFrame(_this2.checkPosition) : null;
    };

    _this2.setPosition = function (newProps) {
      newProps = newProps || _this2.props;
      var _this = _this2;
      if (!_this2.dialog || _this2.props.defaultPosition !== undefined) {
        return;
      }
      _this.dialog.className ? _this.dialog.className += " opacity-animate" : undefined;
      // console.log(this.refs.dialogContent.offsetHeight)
      // console.log(-this.refs.dialogContent.offsetLeft,-this.refs.dialogContent.offsetTop)
      _this.refs.dialogContent.style.height = _this2.state.height; //this.props.height || 'auto';
      _this.refs.dialogBody.style.height = _this2.props.bodyHeight ? _this2.props.bodyHeight : 'auto';
      var ch = _this2.container.clientHeight;
      var dh = _this.refs.dialogContent.offsetHeight;
      var stop = _this2.container.scrollTop;
      var ot = parseInt(_this.refs.dialogContent.offsetTop);
      var sl = _this2.container.scrollLeft;
      var x = 0,
          y = 0,
          x2 = null,
          y2 = null;
      if (ot < 0) {
        y = 0;
      } else {
        y = Math.max(0, parseInt((ch - dh) / 2)) + stop;
      }
      x = sl + parseInt((_this2.container.offsetWidth - _this.refs.dialogContent.offsetWidth) / 2);
      //固定显示在四周 [left,right,top,bottom]
      if (_this2.state.fixed) {
        if (_this2.state.fixed.indexOf('left') !== -1) {
          x = 0;
          x2 = null;
        }
        if (_this2.state.fixed.indexOf('right') !== -1) {
          x = null;
          x2 = 0;
        }
        if (_this2.state.fixed.indexOf('top') !== -1) {
          y = 0;
          y2 = null;
        }
        if (_this2.state.fixed.indexOf('bottom') !== -1) {
          y = null;
          y2 = 0;
        }
      }
      // console.log(ot,y)
      if (x !== _this2.state.x || y !== _this2.state.y || x2 !== _this2.state.x2 || y2 !== _this2.state.y2) {
        _this.setState({
          defaultPosition: {
            x: x,
            y: y,
            x2: x2,
            y2: y2
          }
        }, function () {
          _this.props.afterShow();
        });
      }
      var height = parseInt(_this.refs.dialogContent.offsetHeight);
      var maxHeight = newProps.height === 'auto' || !newProps.height ? parseInt(_this2.container.clientHeight) : newProps.height;
      var headHeight = _this.refs.dialogHeader ? _this.refs.dialogHeader.offsetHeight : 0;
      var footHeight = _this.refs.dialogFooter ? _this.refs.dialogFooter.offsetHeight : 0;
      var bodyHeight = maxHeight - headHeight - footHeight - 2;
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
    };

    _this2.maskHandle = function () {
      _this2.props.maskHide && _this2.hide();
    };

    _this2.onDragStop = function (e, data) {
      _this2.dragPosition = data;
    };

    _this2.onFocus = function (e) {
      // 阻止与原生事件的冒泡
      if (e.target && (e.target.tagName.toLowerCase() == 'button' || e.target.tagName.toLowerCase() == 'a')) {
        return;
      }
      // lastDialog = this;
      _this2.props.onClick(e);
    };

    _this2.maxreset = function (e) {
      var maxContainer = _this2.getMaxContainer();
      if (_this2.state.status === 'reset') {
        _this2.oldprops = { width: _this2.state.width, hegiht: _this2.state.height, mask: _this2.state.mask, fixed: _this2.state.fixed, draggable: _this2.state.draggable, defaultPosition: _this2.state.defaultPosition };
        var maxWH = {
          fixed: ["left", "top", "right", "bottom"],
          defaultPosition: { x: 0, x2: 0, y: 0, y2: 0 },
          width: 'auto',
          height: 'auto',
          draggable: false
          // mask:false
        };
        maxContainer.scrollTo(0, 0);
        if (maxContainer == document.body) {
          window.scrollTo(0, 0);
        }
        maxContainer.className += ' overflowhidden';
        _this2.setState(_extends({ status: 'max' }, maxWH), function () {
          // this.setPosition(this.props);
          _this2.props.resizeCallback && _this2.props.resizeCallback(_this2.state.status);
        });
      } else {
        _this2.status = 'reset';
        maxContainer.className = maxContainer.className.replace('overflowhidden', '');
        _this2.setState(_extends({ status: 'reset' }, _this2.oldprops), function () {
          _this2.setPosition(_this2.props);
          _this2.props.resizeCallback && _this2.props.resizeCallback(_this2.state.status);
        });
      }
      _this2.props.maxreset && _this2.props.maxreset(_this2.state.status);
    };

    _this2.computeWH = function () {
      if (status === 'max') {
        _this2.setState({ height: document.body.clientHeight, width: document.body.clientWidth });
      }
    };

    _this2.id = props.id || +new Date();
    _this2.dialog = null;
    _this2.state = {
      isShow: props.isShow, defaultPosition: props.defaultPosition || {},
      height: props.height, width: props.width, fixed: props.fixed,
      draggable: props.draggable, status: 'reset',
      mask: props.mask
    };
    _this2.keyBind = _this2.keyBind.bind(_this2); //方便移除事件绑定.每次bind会生成新的对象

    _this2.maskWH = {
      width: Math.max(document.documentElement.offsetWidth, document.body.scrollWidth),
      height: Math.max(document.documentElement.offsetHeight, document.body.scrollHeight, document.documentElement.clientHeight)
      //容器配置
    };if (document.body != _this2.props.container && typeof _this2.props.container === 'string') {
      _this2.container = document.querySelector(_this2.props.container);

      _this2.maskWH = {
        width: _this2.container.clientWidth,
        height: _this2.container.clientHeight
        // console.log('position', this.container.style.position)
        // let node = this.container;
        // //container只支持传dom或字符串
        // if (typeof this.container === 'string') {
        //   node = document.querySelector(this.container);
        // }
        // let nodeStyle = window.getComputedStyle(node);
        // console.log(nodeStyle)
      };_this2.bounds = _this2.props.container;
      // console.log({left: 0, top: 0, right: this.container.clientWidth, bottom: this.container.clientHeight})
      // this.bounds = {left: 0, top: 0, right: this.container.clientWidth, bottom: this.container.clientHeight};
    } else if (document.body == _this2.props.container) {
      _this2.container = document.documentElement;
    } else {
      _this2.container = _this2.props.container;
      _this2.maskWH = {
        width: _this2.container.clientWidth,
        height: _this2.container.clientHeight
      };
    }
    var position = window.getComputedStyle(_this2.container).position;
    if (document.body !== _this2.props.container && (position == 'static' || position == '')) {
      _this2.container.style.position = 'relative';
    }
    _this2.setDialogRef = function (element) {
      _this2.dialog = element;
    };
    _this2.dragPosition = { x: 0, y: 0 };
    return _this2;
  }

  _createClass(Dialog, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
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

  }, {
    key: "timerHide",
    value: function timerHide(newProps) {
      var _this3 = this;

      if (newProps.timer) {
        this.clearTimer();
        this.timer = setTimeout(function () {
          _this3.state.isShow && _this3.hide();
        }, newProps.timer);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.clearTimer();
      // console.log("unmount");
      // lastDialog = null;
      this.destory();
      document.removeEventListener("keydown", this.keyBind);
      // window.removeEventListener('resize', this.computeHeight, false);
      window.cancelAnimationFrame && this.frameId ? window.cancelAnimationFrame(this.frameId) : null;
    }
    //销毁时更新dialogList;

  }, {
    key: "destory",
    value: function destory() {
      var _this4 = this;

      dialogList.forEach(function (item, i) {
        if (item.id === _this4.id) {
          dialogList.splice(i, 1);
        }
      });
      var maxContainer = this.getMaxContainer();
      maxContainer.className = maxContainer.className.replace('overflowhidden', '');
      this.props.updateList(dialogList);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this5 = this;

      // console.log(this.dialog)
      document.addEventListener("keydown", this.keyBind);
      if (this.props.isShow && this.state.isShow == false) {
        this.show(this.props);
      }
      this.setPosition(this.props);
      if (this.props.max) {
        setTimeout(function () {
          _this5.maxreset();
        }, 0);
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

  }, {
    key: "clearTimer",
    value: function clearTimer() {
      this.timer && clearTimeout(this.timer);
    }
  }, {
    key: "show",
    value: function show(newProps) {
      var _this6 = this;

      // console.log("show");
      var _this = this;
      this.clearTimer();
      this.setState({ isShow: true }, function () {
        _this6.setPosition(newProps);
        var st = setTimeout(function () {
          clearTimeout(st);
          _this6.setPosition(newProps);
        }, 0);
        //这里绑定resize事件进行maxheight值重置
        // EleResize.on(this.refs.dialogContent,()=>{
        //   this.resetMaxHeight(newProps);
        // })
      });
      this.timerHide(newProps);
    }
  }, {
    key: "resetMaxHeight",
    value: function resetMaxHeight(newProps) {
      var _this = this;
      var maxHeight = newProps.height || parseInt(this.container.clientHeight);
      var headHeight = _this.refs.dialogHeader ? _this.refs.dialogHeader.offsetHeight : 0;
      var footHeight = _this.refs.dialogFooter ? _this.refs.dialogFooter.offsetHeight : 0;
      var bodyHeight = maxHeight - headHeight - footHeight - 2;
      // debugger
      // let cs = window.getComputedStyle(this.refs.dialogContent);
      // let y = +cs.top + cs.getPropertyValue('transform').match(/(\d+)/gi)[5] || 0;
      this.refs.dialogBody.style.maxHeight = Math.max(0, bodyHeight) + "px";
    }
  }, {
    key: "hide",
    value: function hide() {
      // console.log("hide");
      // this._hide();
      if (this.dialog) {
        var cls = this.dialog.className;
        this.dialog.addEventListener('transitionend', this._hide.bind(this));
        this.dialog.className = cls.replace(/(opacity-animate)?/, " opacity-animate-hide ");
        this.destory();
      }
      // this._hide();
      // setTimeout(this._hide.bind(this), 3000);
    }
  }, {
    key: "_hide",
    value: function _hide() {
      var _this7 = this;

      this.setState({ isShow: false }, function () {
        _this7.props.afterHide(_this7.id);
      });
    }
  }, {
    key: "renderHTML",
    value: function renderHTML() {
      var _props = this.props,
          local = _props.local,
          buttons = _props.buttons,
          okCallback = _props.okCallback;

      if (typeof buttons === "undefined") {
        this.buttons = _react2.default.createElement(
          "div",
          null,
          _react2.default.createElement(
            "button",
            { className: "d-ok", onClick: okCallback.bind(this) },
            local.submit
          ),
          _react2.default.createElement(
            "button",
            { className: "d-cancel", onClick: this.hide.bind(this) },
            local.cancel
          )
        );
      } else if (buttons) {
        this.buttons = buttons;
      } else {
        this.buttons = undefined;
      }
      // console.log(this.buttons);
      // console.log(this.state.bounds)
      var maskStyle = {};
      if (this.container == document.body || this.container == document.documentElement) {
        maskStyle = {
          position: 'fixed'
        };
      } else {
        maskStyle = {
          height: this.container.scrollHeight + 'px'
        };
      }
      if (this.state.isShow) {
        // console.log(this.bounds)
        var position = void 0;
        if (!this.state.draggable) {
          position = { x: 0, y: 0 };
        }
        var DD = _react2.default.createElement(
          _reactDraggable2.default,
          { onStop: this.onDragStop, position: position, disabled: !this.state.draggable, handle: this.props.dragHandle || ".dialog-title", bounds: this.bounds },
          this.renderDialog()
        );
        if (this.state.mask) {
          var _React$createElement;

          return _react2.default.createElement(
            "div",
            {
              className: "x-dialog-continer"
            },
            _react2.default.createElement(
              "div",
              { className: "x-dialog", id: this.id, ref: this.setDialogRef, style: { zIndex: this.props.zIndex } },
              DD,
              _react2.default.createElement("div", (_React$createElement = { style: maskStyle, className: "x-dialog-mask" }, _defineProperty(_React$createElement, "style", _extends({ zIndex: this.props.zIndex - 1 }, this.maskWH)), _defineProperty(_React$createElement, "onClick", this.maskHandle), _React$createElement))
            )
          );
        } else {
          return _react2.default.createElement(
            "div",
            { className: "x-dialog", id: this.id, ref: this.setDialogRef, style: { zIndex: this.props.zIndex } },
            DD
          );
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
  }, {
    key: "getMaxContainer",
    value: function getMaxContainer() {
      var maxContainer = document.body;
      if (typeof this.props.maxContainer === 'string') {
        maxContainer = document.querySelector(this.props.maxContainer);
      } else if (_typeof(this.props.maxContainer) === 'object') {
        maxContainer = this.props.maxContainer;
      }
      return maxContainer;
    }
    // status = 'reset';
    //最大化还原

  }, {
    key: "renderDialog",
    value: function renderDialog() {
      //同步zindex至this
      var _props2 = this.props,
          local = _props2.local,
          buttons = _props2.buttons,
          okCallback = _props2.okCallback,
          zIndex = _props2.zIndex;

      this.zIndex = zIndex;
      var _state$defaultPositio = this.state.defaultPosition,
          x = _state$defaultPositio.x,
          x2 = _state$defaultPositio.x2,
          y = _state$defaultPositio.y,
          y2 = _state$defaultPositio.y2;

      var position = {
        left: x === null ? 'auto' : x,
        right: x2 === null ? 'auto' : x2,
        top: y === null ? 'auto' : y,
        bottom: y2 === null ? 'auto' : y2
      };
      return _react2.default.createElement(
        "div",
        {
          className: "dialog-content " + this.props.className,
          ref: "dialogContent",
          style: _extends({
            width: this.state.width || "auto",
            height: this.state.height,
            zIndex: zIndex
          }, position)
        },
        this.props.title ? _react2.default.createElement(
          "div",
          { className: "dialog-title " + this.props.titleClassName, ref: "dialogHeader" },
          _react2.default.createElement(
            "h4",
            null,
            this.props.title
          ),
          _react2.default.createElement(
            "div",
            {
              onClick: this.hide.bind(this),
              className: "dialog-close-con"
            },
            this.props.closeIcon
          ),
          this.props.isMax ? _react2.default.createElement(
            "div",
            { onClick: this.maxreset, className: "dailog-resetmax" },
            this.state.status === 'max' ? this.props.resetIcon : this.props.maxIcon
          ) : undefined
        ) : undefined,
        _react2.default.createElement(
          "div",
          { className: "dialog-body", ref: "dialogBody", onClick: this.onFocus },
          this.props.children
        ),
        _react2.default.createElement(
          "div",
          { ref: "dialogFooter" },
          this.buttons ? _react2.default.createElement(
            "div",
            { className: "dialog-action" },
            this.buttons
          ) : undefined
        )
      );
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderHTML();
    }
  }], [{
    key: "hide",
    value: function hide() {
      if (dialogList.length) {
        // lastDialog = dialogList[0];
        // dialogList.forEach(item => {
        //   // console.log(item)
        //   if (lastDialog.instance.zIndex <= item.instance.zIndex) {
        //     lastDialog = item;
        //   }
        // });
        dialogList.sort(function (a, b) {
          a.instance.zIndex - b.instance.zIndex;
        });
        // lastDialog.instance.hide();
        dialogList[dialogList.length - 1].instance.hide();
      }
    }
  }, {
    key: "hideAll",
    value: function hideAll() {
      // dialogList.forEach(item => {
      //   item.instance.hide()
      // });
      for (var l = dialogList.length - 1; l >= 0; l--) {
        dialogList[l].instance.hide();
      }
    }
  }]);

  return Dialog;
}(_react.PureComponent);

Dialog.propTypes = {
  isShow: _propTypes2.default.bool.isRequired,
  mask: _propTypes2.default.bool,
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  zIndex: _propTypes2.default.number,
  height: _propTypes2.default.any,
  buttons: _propTypes2.default.any,
  closeIcon: _propTypes2.default.node,
  maxIcon: _propTypes2.default.node,
  resetIcon: _propTypes2.default.node,
  afterHide: _propTypes2.default.func,
  afterShow: _propTypes2.default.func,
  okCallback: _propTypes2.default.func,
  dragHandle: _propTypes2.default.string,
  draggable: _propTypes2.default.bool,
  maskHide: _propTypes2.default.bool,
  isMax: _propTypes2.default.bool,
  titleClassName: _propTypes2.default.string,
  max: _propTypes2.default.bool
};
Dialog.defaultProps = {
  isShow: false,
  mask: true,
  className: "",
  zIndex: 0,
  maskHide: true,
  closeIcon: _react2.default.createElement(
    "button",
    { className: "dialog-close" },
    _react2.default.createElement(
      "span",
      null,
      "\xD7"
    )
  ),
  maxIcon: _react2.default.createElement(
    "button",
    { className: "dialog-max" },
    _react2.default.createElement(
      "span",
      null,
      "\u2610"
    )
  ),
  resetIcon: _react2.default.createElement(
    "button",
    { className: "dialog-reset" },
    _react2.default.createElement(
      "span",
      null,
      "\u2750"
    )
  ),
  dragHandle: '.dialog-title',
  draggable: false,
  afterHide: function afterHide() {},
  afterShow: function afterShow() {},
  okCallback: function okCallback() {},
  height: 'auto',
  width: 'auto',
  container: document.body,
  isMax: false,
  titleClassName: '',
  max: false
};
exports.default = Dialog;