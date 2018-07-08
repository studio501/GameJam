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
        // main_world_prefab :{
        //     default : null,
        //     type : cc.Prefab
        // },
        game :{
            default:null,
            type:cc.Prefab
        },
        login :{
            default:null,
            type:cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.log("platform is "+ cc.sys.platform);

        global.eventlistener = EventListener({});

        var self = this;
        global.eventlistener.on("into_game",function (uid) {
            console.log("button click uid = "+uid);
            //global.socket.emit("login",uid);
            // self.enterGameWorld();
        });


        
        // this.enterLoginWorld();
    } ,

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
