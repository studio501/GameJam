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
        mInslayers:{
            default:[],
            type:cc.Prefab,

        },
        layerHeight : 1600
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

    onLoad () {
        this.m_layers = [];
        this.m_currentLayer = this.getALayer();
        this.m_nextLayer = this.getALayer();
        this.initUsePos = 960;
        this.totalLayersH = 0;
        // this.m_layers.push(this.m_currentLayer);
        // this.m_layers.push(this.m_nextLayer);
        this.push_layer(this.m_currentLayer);
        this.push_layer(this.m_nextLayer);
    },

    push_layer : function  (tLayer) {
        this.m_layers.push(tLayer);
        var th = tLayer.height;
        var tp = cc.v2(0,this.initUsePos - th);
        cc.log("will push onto %j",tp);
        tLayer.parent = this.node;
        tLayer.x = tp.x;
        tLayer.y = tp.y;

        tLayer.active = true;
        this.initUsePos -= th;
        this.totalLayersH+=th;
    },

    getALayer(options){
        var ins_len = this.mInslayers.length;
        var randIndex = Math.floor(cc.random0To1() * ins_len);
        cc.log("randIndex is %s %s",randIndex,ins_len);
        var res  = cc.instantiate(this.mInslayers[randIndex]);
        if(!res){
            cc.log("error,no res return in getALayer");
        }
        return res;
    },

    set_postionY : function  (posY) {
        this.node.y = posY;
        if(posY + 960 > (960 - this.initUsePos) - this.m_layers[this.m_layers.length -1].height * 1/3)
        {
            var tl = this.m_layers.shift();
            tl.removeFromParent();
            this.push_layer(this.getALayer());
        }
    },

    start () {

    },

    buttonClick:function (event,cd) {
        console.log("button click = " + event.name);
    }

    // update (dt) {},
});
