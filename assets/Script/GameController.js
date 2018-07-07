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
        game_world_prefab :{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        console.log("platform is "+ cc.sys.platform);
        // console.log("-------------------------------------CC_JSB is and isNative is %j,%j",CC_JSB,cc.sys.isNative);
        // global.socket = io("localhost:3000");
        //global.socket = window.io.connect("localhost:3000", {"force new connection" : true});

        global.eventlistener = EventListener({});

        global.eventlistener.on("login",function (uid) {
            console.log("button click uid = "+uid);
            //global.socket.emit("login",uid);
        });

        global.eventlistener.on("start_game",()=>{
           console.log("player house manager click start game");
            //global.socket.emit("start_game");
        });

        global.eventlistener.on("look_card",()=>{
            //global.socket.emit("look_card");
        });

        global.eventlistener.on("player_choose_rate",(data)=>{
            //global.socket.emit("player_choose_rate",data);
        });

        global.eventlistener.on("pk_choose_player",(uid)=>{
            //global.socket.emit("pk_choose_player",uid);
        });

        // global.socket.on("sync_data",(data)=>{
        //     console.log("sync_data = "+data);
        //     console.log("sync_data type = "+ typeof data);
        //     data = global.getSocketData(data);
        //     this.enterGameWorld(data);
        // });

        // global.socket.on("player_join",(data)=>{
        //     data = global.getSocketData(data);
        //     global.gameEventListener.fire("player_join",data);
        // });

        // global.socket.on("player_offline",(uid)=>{
        //     console.log("player off line = "+uid);
        //     global.gameEventListener.fire("player_offline",uid);
        // });

        // global.socket.on("change_house_manager",(uid)=>{
        //     console.log("house manager is change "+uid);
        //     global.gameEventListener.fire("change_house_manager",uid);
        // });

        // global.socket.on("push_card",()=>{
        //     console.log("server send message push card");
        //     global.gameEventListener.fire("push_card");
        // });

        // global.socket.on("show_card",(data)=>{
        //     data = global.getSocketData(data);
        //     global.gameEventListener.fire("show_card",data);
        // });

        // global.socket.on("player_choose_rate",(data)=>{
        //     data = global.getSocketData(data);
        //     console.log("player choose rate = %j",data);
        //     global.gameEventListener.fire("player_choose_rate",data);
        // });

        // global.socket.on("turn_player_message",(data)=>{
        //     data = global.getSocketData(data);
        //     console.log("turn_player_message "+JSON.stringify(data));
        //     global.gameEventListener.fire("turn_player_message",data);
        // });

        // global.socket.on("pk_result",(data)=>{
        //     data = global.getSocketData(data);
        //     console.log("pk result %j",data);
        //     global.gameEventListener.fire("pk_result",data);
        // });
        this.enterGameWorld();
    } ,

    enterMainWorld : function () {
        // console.log("enter MainWorld");
        // if(this.runningWorld != undefined){
        //     this.runningWorld.removeFromParent(true);
        // }
        // this.runningWorld = cc.instantiate(this.main_world_prefab);
        // this.runningWorld.parent = this.node;
    },

    enterGameWorld : function (data) {
        console.log("enter GameWorld");
        if(this.runningWorld != undefined){
            this.runningWorld.removeFromParent(true);
        }
        this.runningWorld = cc.instantiate(this.game_world_prefab);
        this.runningWorld.parent = this.node;
        // console.log("type of data is " + typeof data);
        // global.gameEventListener.fire("sync_data",data);
    }


    // update (dt) {},
});
