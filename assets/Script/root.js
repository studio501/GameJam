// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var layerData = require("./layers")
var global = require("./global")
cc.Class({
    extends: cc.Component,

    properties: {
        mInslayers:{
            default:[],
            type:cc.Prefab,

        },
        layerHeight : 1600,
        bgIns:{
            default:[],
            type:cc.Prefab,
        },
        edgeIns:{
            default:null,
            type:cc.Prefab,
        }

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
        this.m_layerId = 0;
        this.m_curLayerInfo = null;
        this.m_layerRepeat = 0;
        this.bg_interval_micro = 2;
        this.edge_interval_micro = 0.5;

        this.test_layer = null; //null;//405;

        this.m_layers = [];
        this.m_bgLayers = [];
        this.m_edgeLayers = [];
        this.m_currentLayer = this.getALayer()[0];
        this.m_nextLayer = this.getALayer()[0];
        this.initUsePos = 960;
        this.initUsePosBg = 960;
        this.initUseEdge = 960;
        this.totalLayersH = 0;


        // this.m_layers.push(this.m_currentLayer);
        // this.m_layers.push(this.m_nextLayer);
        this.push_layer(this.m_currentLayer,true);
        this.push_layer(this.m_nextLayer);

        
        this.m_currentBg = this.getABg();
        this.push_bg(this.m_currentBg,true);

        for(var i=0;i<6;++i){
            var edge = this.getAnEdge()
            this.push_edge(edge,i == 0);
        }

        // for(var i=0;i<layerData.length;i++){
        //     cc.log("ldddd %j",layerData[i]);
        // }
        // this.m_currentBg.getComponent('bg');
    },

    getAnEdge(){
        var res = cc.instantiate(this.edgeIns);
        return res;
    },

    push_edge : function  (tLayer,isInit) {
        this.m_edgeLayers.push(tLayer);
        var th = tLayer.height;
        // var adj = (!isInit && this.edge_interval_micro) || 0;
        var tp = cc.v2(0,this.initUseEdge );;//cc.v2(0,this.initUsePos - th);
        
        tLayer.parent = this.node;
        tLayer.x = tp.x;
        tLayer.y = tp.y;
        tLayer.setLocalZOrder(2);

        tLayer.active = true;
        this.initUseEdge -= th;
        cc.log("will push push_edge %j %s %s",tp,th,this.initUseEdge);
    },

    getABg(index){
        index = index || 0;
        var res = cc.instantiate(this.bgIns[index]);
        return res;
    },

    push_bg : function  (tLayer,isInit) {
        this.m_bgLayers.push(tLayer);
        // var adj = (!isInit && this.bg_interval_micro) || 0;
        var th = tLayer.height;
        var tp = cc.v2(0,this.initUsePosBg );;//cc.v2(0,this.initUsePos - th);
        cc.log("will push push_bg %j %s",tp,th);
        tLayer.parent = this.node;
        tLayer.x = tp.x;
        tLayer.y = tp.y;
        tLayer.setLocalZOrder(0)

        tLayer.active = true;
        this.initUsePosBg -= th;
    },

    push_layer : function  (tLayer,isInit) {
        this.m_layers.push(tLayer);
        var th = tLayer.height;
        var tp = cc.v2(0,this.initUsePos);;//cc.v2(0,this.initUsePos - th);
        cc.log("will push onto %j %s",tp,th);
        tLayer.parent = this.node;
        tLayer.x = tp.x;
        tLayer.y = tp.y;
        tLayer.setLocalZOrder(1);

        tLayer.active = true;
        this.initUsePos -= th;
        this.totalLayersH+=th;

        if(isInit){
            var nextBg = this.getABg();
            cc.log("nextBg is %s",nextBg);
            this.push_bg(nextBg);
        }
    },

    getLayerIns(layerId){
        var ls = layerId.toString();
        for(var i =0;i<this.mInslayers.length;i++){
            if(this.mInslayers[i].name.match(ls)){
                return this.mInslayers[i];
            }
        }
        cc.log("can't find any layer for %s",layerId)
    },

    getBgIns(name){
        // var ls = layerId.toString();
        for(var i =0;i<this.bgIns.length;i++){
            if(this.bgIns[i].name.match(name)){
                return i;
            }
        }
    },

    getALayer(options){
        var changeBgFlag = false;
        var bgs;
        var oldInfo;

        cc.log("into hereeeeeeeeeeeeeeeeeeeeeeeeeeeee..... %s,%s %s %s",
            this.m_layerRepeat,oldInfo && oldInfo.repeat,
            oldInfo && oldInfo.repeat,oldInfo && oldInfo.difficult); 
        if( (this.m_layerId == 0 && !this.m_curLayerInfo) || 
            (this.m_curLayerInfo.repeat != 0 && this.m_layerRepeat > this.m_curLayerInfo.repeat) ){

            oldInfo = this.m_curLayerInfo;
            this.m_curLayerInfo = layerData[this.m_layerId];
            this.m_layerId = Math.min(layerData.length - 1,this.m_layerId + 1);
            this.m_layerRepeat = 0;
            changeBgFlag = this.m_curLayerInfo.bg_change == "TRUE";
            cc.log("int to threre..... %s %s ---(%s)",changeBgFlag,this.m_curLayerInfo.difficult,this.m_layerId);
        }

        if(changeBgFlag){
            cc.log("oldInfo & newInfo",oldInfo,this.m_curLayerInfo);
            var sHead = (oldInfo && oldInfo.difficult.toString()) || Math.max(this.m_curLayerInfo.difficult - 1,0);
            bgs = sHead.toString() + this.m_curLayerInfo.difficult.toString();
        }
        else{
            bgs = this.m_curLayerInfo.difficult.toString() + this.m_curLayerInfo.difficult.toString();
        }

        var tlyaers = this.m_curLayerInfo.random

        var ins_len = tlyaers.length;
        var randIndex = Math.floor(cc.random0To1() * ins_len);
        cc.log("randIndex is %s %s bgs %s",randIndex,ins_len,bgs);
        //this.mInslayers[randIndex]
        var trIndex = this.test_layer || tlyaers[randIndex];
        var res  = cc.instantiate(this.getLayerIns(trIndex)); 
        cc.log("getALayer %s",res.name);
        if(!res){
            cc.log("error,no res return in getALayer");
        }
        this.m_layerRepeat++;
        this.m_lastBgs = bgs;
        return [res,changeBgFlag,bgs];
    },

    tell_layer_will_end : function (t) {
        var p = t.parent;
        var pos = cc.v2(t.x,t.y - t.height);
        var wp = p.convertToWorldSpace(pos);
        return wp.y > - 200;
    },

    set_postionY : function  (posY) {
        this.node.y = posY;
        //(960 - this.initUsePos)
        // cc.log("hhhhh %s %s",posY + 960,- this.initUsePos);
        // if(posY + 960 > ( - this.initUsePos)  )
        if(this.tell_layer_will_end(this.m_nextLayer))
        {
            var tl
            if(this.m_layers.length > 2 ){
                tl = this.m_layers.shift();
                tl.removeFromParent();
            }

            this.m_currentLayer = this.m_layers[0];
            var ta = this.getALayer();
            this.m_nextLayer = ta[0];
            var changeBgFlag = ta[1];
            var bgs = ta[2];
            var bgIndex = this.getBgIns(bgs)

            this.push_layer(this.m_nextLayer);

            var nh = this.m_nextLayer.height;
            
            while(-this.initUsePosBg < posY + 960+ 600){
                var tbg = this.getABg(bgIndex);
                this.push_bg(tbg);
            }

            var te = 0;

            while(te < nh){              
                var teg = this.getAnEdge();
                this.push_edge(teg);
                te += teg.height;
            }
            

            this.trimLayers(this.m_bgLayers);
            this.trimLayers(this.m_edgeLayers);
        }
    },
    trimLayers (layers) {
        for(var i = layers.length -1;i>=0;i--){
            var t = layers[i];
            var p = t.parent;
            var pos = cc.v2(t.x,t.y - t.height);
            var wp = p.convertToWorldSpace(pos);
            if (wp.y > 960){
                layers.splice(i, 1);
            }
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
