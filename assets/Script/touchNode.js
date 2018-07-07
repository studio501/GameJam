// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var EventListener = require("./event_listener");
var global = require("./global");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.addTouchEvent();
    },
    /**
     * 添加事件
     */
    addTouchEvent:function(){

        //父节点监听touch事件（直接子节点必须注册同样的事件方能触发）
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('node TOUCH_START');
            global.eventlistener.fire("changeWhite");
        }, this);
        
        //父节点监听touch事件（直接子节点必须注册同样的事件方能触发）
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('node TOUCH_END');
            global.eventlistener.fire("changeBlack");
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log('node TOUCH_MOVE');
        }, this);
        
        //父节点监听touch事件（直接子节点必须注册同样的事件方能触发）
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            console.log('node TOUCH_CANCEL');
            global.eventlistener.fire("changeBlack");
        }, this);
         
    },

    // update (dt) {},
});
