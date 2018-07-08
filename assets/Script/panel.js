// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        panelType : 0,
        speed : 200,
        isDown : -1,
        isBlack : true,
        meetSame : false,
        meetDiff : 0,
        score:1,
        combo:false,
        pSpeed:100,
        weight:[],
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

    get_speed(){
        return this.isBlack ? 600 : 800;
    },

    tellBlack(){
        return this.isBlack;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.m_testFlag = 100;
        this._isReverse = this.node.rotation < 0;
        cc.log("onLoad,isReverse %s",this._isReverse);

        this.meetSame = !!this.node.getChildByName("score_icon");

        var black = this.node.getChildByName("b");
        var white = this.node.getChildByName("w");
        if(black){
            black.active = this.isBlack;
        }

        if(white){
            white.active = !this.isBlack;
        }
    },

    start () {

    },

    isReverse(){
        cc.log("isReverse %s",this._isReverse);
        return this._isReverse;
    }

    // update (dt) {},
});
