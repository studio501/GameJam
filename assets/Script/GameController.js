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
var global = require("./global")
cc.Class({
    extends: cc.Component,

    properties: {
        ball:{
            default :null,
            type : cc.Node
        },
        startui:{
            default :null,
            type :cc.Node
        },
        gameover : {
            default :null,
            type : cc.Node
        },
        root : {
            default : null,
            type : cc.Node
        },
        bgMusic: {
            default: null,
            url: cc.AudioClip
        },
        // main_world_prefab :{
        //     default : null,
        //     type : cc.Prefab
        // },
        // game :{
        //     default:null,
        //     type:cc.Prefab
        // },
        // login :{
        //     default:null,
        //     type:cc.Prefab
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.log("platform is "+ cc.sys.platform);

        global.eventlistener = EventListener({});
        global.Score = 0;
        var self = this;
        global.eventlistener.on("start_game",function (uid) {
            
            self.showPlayGame(true);
        });

        global.eventlistener.on("end_game",function (uid) {
            
            self.showEndGame();
        });

        global.eventlistener.on("restart_game",function (uid) {
            cc.log("restart_game...")
            self.showPlayGame();
        });

        this.showStartGame();
        
    } ,

    showStartGame : function  () {
        this.ball.getComponent('ball').setPause(true);
        this.startui.active = true;
        this.gameover.active = false;
        if(this.m_bgId)
            cc.audioEngine.stop(this.m_bgId);
        this.m_bgId = cc.audioEngine.playEffect(this.bgMusic, true);
    },

    showEndGame : function  () {
        this.ball.getComponent('ball').setPause(true);
        this.startui.active = false;
        this.gameover.active = true;
        this.gameover.getComponent('gameover').showGameEnd(global.Score);
        if(this.m_bgId)
            cc.audioEngine.stop(this.m_bgId);

        cc.audioEngine.stopAll();

        global.Score = 0;
    },

    showPlayGame : function(isInit){
        this.startui.active = false;
        this.gameover.active = false;

        var ballcomp = this.ball.getComponent('ball');
        if(!isInit){
            if(this.m_bgId)
            cc.audioEngine.stop(this.m_bgId);
            this.m_bgId = cc.audioEngine.playEffect(this.bgMusic, true);
            var rootComp = this.root.getComponent('root');
            rootComp.initOnLoad();
            ballcomp.initOnLoad();

        }
        ballcomp.setPause(false);
    },

    enterLoginWorld : function () {
        // console.log("enter MainWorld");
        if(this.runningWorld != undefined){
            this.runningWorld.removeFromParent(true);
        }
        this.runningWorld = cc.instantiate(this.login);
        this.runningWorld.parent = this.node;
    },

    enterGameWorld : function (data) {
        console.log("enter GameWorld");
        global.Score = 0;
        if(this.runningWorld != undefined){
            this.runningWorld.removeFromParent(true);
        }
        this.runningWorld = cc.instantiate(this.game);
        this.runningWorld.position = cc.p(-320,-480);
        this.runningWorld.parent = this.node;
    }


    // update (dt) {},
});
