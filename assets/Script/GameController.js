// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

//app secret : 11d40290f842b959d3ef2cb6d7a9e018
var EventListener = require("./event_listener");
var global = require("./global")
var Hmac_SHA256 = require("./crypto-js/hmac-sha256");
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
        login : {
            default : null,
            type : cc.Node
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

        global.eventlistener.on("share",function (uid) {
            cc.log("share...")
            if(cc.sys.platform === cc.sys.WECHAT_GAME){
                console.log("in hereeee");
                wx.shareAppMessage({title:"btn good day",imageUrl :  canvas.toTempFilePathSync({
                          destWidth: 500,
                          destHeight: 400
                        })});
            }
        });

        global.eventlistener.on("login_game",function (uid) {
            cc.log("login_game triggerd!!!!!!!!!");
            if(cc.sys.platform === cc.sys.WECHAT_GAME){
                wx.login({
                    success : function (res) {
                        console.log("wx login success... code ",res.code);

                        // wx.code2accessToken({
                        //     appid : "wx41aa7f5862a62678",
                        //     secret : "11d40290f842b959d3ef2cb6d7a9e018",
                        //     js_code : res.code,
                        //     grant_type : "authorization_code"
                        // })

                        let AppId = "11d40290f842b959d3ef2cb6d7a9e018";
                        let tUrl = "https://api.weixin.qq.com/sns/jscode2session?appid={0}&secret={1}&js_code={2}&grant_type=authorization_code".format("wx41aa7f5862a62678",AppId,res.code);
                        console.log("tUrl is",tUrl);
                        wx.request({
                            url : tUrl,
                            method : "GET",
                            data : {
                                code : res.code
                            },
                            success : function (res) {
                                console.log("get openid and session_key",res);
                                global.os_data = res.data;
                                let sKey = res.data.session_key;
                                let opId = res.data.openid;
                                // global.u_oppen_id = res.data.openid;
                                wx.postMessage({
                                    session_key : res.data.session_key,
                                    openid : res.data.openid
                                });

                                let kvDataList = new Array();
                                let tj = {
                                    wxgame : {
                                        score : 16,
                                        update_time : 0
                                    },
                                    other : {
                                        score2 : 100,
                                    }
                                };
                                kvDataList.push({
                                    key : "score",
                                    value : JSON.stringify(tj)//"100"
                                });

                                console.log("kvDataList is ",kvDataList);
                                let signature = Hmac_SHA256(kvDataList,sKey);
                                console.log("signature is ",signature);
                                let tUrl2 = "https://api.weixin.qq.com/wxa/set_user_storage?access_token={0}&signature={1}&openid={2}&sig_method={3}&appid={4}".format(sKey,signature,opId,"hmac_sha256",AppId);
                                console.log("tUrl2 is ",tUrl2);
                                wx.request({
                                    url : "https://api.weixin.qq.com/wxa/set_user_storage?access_token={0}&signature={1}&openid={2}&sig_method={3}&appid={4}".format(sKey,signature,opId,"hmac_sha256",AppId),
                                    method:"POST",
                                    data:{
                                        kv_list:JSON.stringify(kvDataList)
                                    },
                                    success:function (res) {
                                        console.log("hhahahahah success");
                                    },fail:function (res) {
                                        console.log("why the fail ",res.errMsg);
                                    }
                                });

                            },fail :function (res) {
                                console.log("get openid and session_key fail",res.errMsg);
                            }
                        });
                        // console.log("")
                        var fs = wx.getFileSystemManager();
                        var downloadfile = function (url) {
                            wx.downloadFile({url:url,success:function (res) {
                                console.log("downloadfile success... %s",res.tempFilePath)
                                wx.saveFile({tempFilePath:res.tempFilePath,success:function (res) {
                                    console.log("save file in %s",res.savedFilePath);

                                    cc.loader.load(res.savedFilePath,function (err,tex) {
                                        console.log("should load a tex form url "+ (tex instanceof cc.Texture2D));
                                        if(tex instanceof cc.Texture2D){
                                            var sp = self.login.getChildByName('btn_start').getComponent(cc.Sprite);
                                            sp.spriteFrame = new cc.SpriteFrame(tex);
                                            // setTexture(tex,cc.rect(0,0,100,100));
                                        }
                                    });

                                },fail:function (res) {
                                    console.log("save file failed %s",res.errMsg);
                                }})
                            },fail:function (res) {
                                console.log("downloadfile fail... %s",res.errMsg);
                            }});
                        };
                        wx.getUserInfo({
                            success : function (res) {
                                console.log("user info %j",res.userInfo);
                                var checkPath = "./res/myTemp";
                                //downloadfile(res.userInfo.avatarUrl);

                            },
                            fail : function (res) {
                                if(res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1){
                                    console.log("user reject permisson");
                                }
                            }
                        });

                    },
                    fail : function () {
                        console.log("wx login fail...");  
                    },
                    complete : function () {
                        console.log("wx login complete..."); 
                    }
                });
            }
            else{
                cc.log("login_game...")
                self.showStartGame();
            }
            
        });

        // cc.sys.localStorage.setItem("test", 101);

        // this.showStartGame();
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            // wx.authorize({scope:"scope.userInfo",success : function (res) {
            //     console.log("authorize ok.")
            // },fail : function (res) {
            //     if(res.errMsg.indexOf("auth den") > -1){
            //         console.log("authorize failed");
            //     }
            // }});

            wx.showShareMenu({withShareTicket:false,success:function (res) {
                console.log("showShareMenu ok")
            },fail : function (res) {
                console.log("showShareMenu failed %s",res.errMsg);
            }});

            wx.onShareAppMessage(function () {
                return {title : "menu good day",
                        imageUrl :  canvas.toTempFilePathSync({
                          destWidth: 500,
                          destHeight: 400
                        })};
            });


            let button = wx.createUserInfoButton({
                type: 'text',
                text: '获取用户信息',
                style: {
                    left: 10,
                    top: 76,
                    width: 200,
                    height: 40,
                    lineHeight: 40,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            });
            // console.log(button);
            button.onTap((res) => {
                console.log(res);
                button.hide();
            });

            var test_var = cc.sys.localStorage.getItem("test");
            console.log("saved value %s",test_var+1);


        }
        


        // var g_resW = 640;
        // var g_resH = 960;
        // var g_designW = 0;
        // var g_designH = 0;
        // var g_scale_h = 1;
        // var g_scale_w = 1;

        // global.g_scale_resW = 1;


        // var sceneSize = cc.view.getFrameSize();
        // var sceneW = Math.min(sceneSize.width,sceneSize.height);
        // var sceneH = Math.max(sceneSize.width,sceneSize.height);

        // g_scale_w = sceneW / g_resW;
        // g_designH = Math.floor(sceneH / g_scale_w);
        // g_designW = g_resW;
        // g_scale_h = g_designH / g_resH;
        // cc.view.setDesignResolutionSize(g_designW,g_designH,cc.ResolutionPolicy.NO_BORDER);

        this.showLoginGame();
        cc.log("de size ---",cc.view.getDesignResolutionSize(),cc.view.getFrameSize());
    } ,

    showLoginGame : function () {
        this.ball.getComponent('ball').setPause(true);
        this.startui.active = false;
        this.gameover.active = false;
        this.root.active = false;

        this.login.active = true;
    },

    showStartGame : function  () {
        this.ball.getComponent('ball').setPause(true);
        this.startui.active = true;
        this.gameover.active = false;
        this.login.active = false;
        this.root.active = true;
        if(this.m_bgId)
            cc.audioEngine.stop(this.m_bgId);
        this.m_bgId = cc.audioEngine.playEffect(this.bgMusic, true);
    },

    showEndGame : function  () {
        this.ball.getComponent('ball').setPause(true);
        this.startui.active = false;
        this.gameover.active = true;
        this.login.active = false;
        this.gameover.getComponent('gameover').showGameEnd(global.Score);
        if(this.m_bgId)
            cc.audioEngine.stop(this.m_bgId);

        cc.audioEngine.stopAll();

    },

    showPlayGame : function(isInit){
        this.startui.active = false;
        this.gameover.active = false;
        this.login.active = false;

        var ballcomp = this.ball.getComponent('ball');
        if(!isInit){
            if(this.m_bgId)
                cc.audioEngine.stop(this.m_bgId);
            this.m_bgId = cc.audioEngine.playEffect(this.bgMusic, true);

            global.Score = 0;
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
