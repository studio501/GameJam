// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        sprite_frames :{
            default:null,
            type:cc.SpriteAtlas
        }
        // tarNode:
        // {
        //     type:cc.Node,
        //     default:null
        // }
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
        // cc.rect(0, 0, 960, 640)
        // var followAction = cc.follow(this.tarNode,cc.rect(0, 0, 2000, 2000));
        // this.node.runAction(followAction);
        // this.getComponent(cc.Sprite).spriteFrame = this.sprite_frames.getSpriteFrame("bg-01");
        this.showBg("bg-01");
    },

    start () {

    },

    showBg(nameStr){
        this.getComponent(cc.Sprite).spriteFrame = this.sprite_frames.getSpriteFrame(nameStr);
    },
    showBg1(s1){
        this.getComponent(cc.Sprite).spriteFrame = this.sprite_frames.getSpriteFrame("bg-"+s1);
    },
    showBg2(s1,s2){
        this.getComponent(cc.Sprite).spriteFrame = this.sprite_frames.getSpriteFrame("bg-"+s1+s2);
    },


    // update (dt) {},
});
