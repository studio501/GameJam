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
        layerHeight : 1600,
        bgIns:{
            default:null,
            type:cc.Prefab,

        },

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
        this.initUsePosBg = 960;
        this.totalLayersH = 0;
        // this.m_layers.push(this.m_currentLayer);
        // this.m_layers.push(this.m_nextLayer);
        this.push_layer(this.m_currentLayer,true);
        this.push_layer(this.m_nextLayer);

        this.m_bgLayers = [];
        this.m_currentBg = this.getABg();
        this.push_bg(this.m_currentBg);
        // this.m_currentBg.getComponent('bg');
    },

    getABg(curLevel,nextLevel){
        var res = cc.instantiate(this.bgIns);
        return res;
    },

    push_bg : function  (tLayer) {
        this.m_bgLayers.push(tLayer);
        var th = tLayer.height;
        var tp = cc.v2(0,this.initUsePosBg);;//cc.v2(0,this.initUsePos - th);
        cc.log("will push onto %j",tp);
        tLayer.parent = this.node;
        tLayer.x = tp.x;
        tLayer.y = tp.y;

        tLayer.active = true;
        this.initUsePosBg -= th;
    },

    push_layer : function  (tLayer,isInit) {
        this.m_layers.push(tLayer);
        var th = tLayer.height;
        var tp = cc.v2(0,this.initUsePos);;//cc.v2(0,this.initUsePos - th);
        cc.log("will push onto %j",tp);
        tLayer.parent = this.node;
        tLayer.x = tp.x;
        tLayer.y = tp.y;

        tLayer.active = true;
        this.initUsePos -= th;
        this.totalLayersH+=th;

        if(!isInit){
            var nextBg = this.getABg();
        }
    },

    getALayer(options){
        var ins_len = this.mInslayers.length;
        var randIndex = Math.floor(cc.random0To1() * ins_len);
        cc.log("randIndex is %s %s",randIndex,ins_len);
        var res  = cc.instantiate(this.mInslayers[randIndex]);
        cc.log("getALayer %s",res.name);
        if(!res){
            cc.log("error,no res return in getALayer");
        }
        return res;
    },

    set_postionY : function  (posY) {
        this.node.y = posY;
        //(960 - this.initUsePos)
        cc.log("hhhhh %s %s",posY + 960,- this.initUsePos);
        if(posY + 960 > ( - this.initUsePos) - this.m_layers[this.m_layers.length -1].height * 1/100)
        {
            var tl
            if(this.m_layers.length > 2 ){
                tl = this.m_layers.shift();
                tl.removeFromParent();
            }

            this.m_currentLayer = this.m_layers[0];
            this.m_nextLayer = this.getALayer();
            this.push_layer(this.m_nextLayer);

            var nowName = this.m_currentLayer.name;
            var nextName = this.m_nextLayer.name;

            var nowNameArr = nowName.split(" ");
            var nextNameArr = nextName.split(" ");
            nowName = nowNameArr[nowNameArr.length - 1];
            nextName = nextNameArr[nextNameArr.length - 1];
            
            var tbg = this.getABg();
            this.push_bg(tbg);
            tbg.getComponent('bg').showBg2(nowName,nextName);

            if(this.m_bgLayers.length > 2){
                tl = this.m_bgLayers.shift();
                tl.removeFromParent();
            }
            // cc.director.pause();
        }
    },

    start () {
        // this.addTouchEvent();
    },

    buttonClick:function (event,cd) {
        console.log("button click = " + event.type);
    },



    // update (dt) {},
});
