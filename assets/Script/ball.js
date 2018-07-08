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
        gravity: -1000,
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        stayPosy : 200,
        direction : 0,
        layerRoot :{
            default:null,
            type:cc.Node
        },
        scoreTxt:{
            default :null,
            type : cc.Label
        },
        startPos:cc.v2(0,320),
        auios: {
            default: [],
            url: cc.AudioClip
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

    onLoad(){
        this.initOnLoad();
    },

    initOnLoad () {
        cc.log("ball onLoad");
        this.touchingNumber = 0;

        this.collisionX = 0;
        this.collisionY = 0;
        this.m_gravityFall = true;
        this.node.position = this.startPos;
        this.prePosition = cc.v2();
        this.m_rotateOnPanel = Math.abs(cc.degreesToRadians(30));

        this.m_stayOnPanel = null;

        this.setBlack(true,true)

        var self = this;
        global.eventlistener.on("changeWhite",function (uid) {
            self.setBlack(false);
        });

        global.eventlistener.on("changeBlack",function (uid) {
            self.setBlack(true);
        });

        this.scoreTxt.string = "0"
        //this.preStep = cc.v2();
    },

    start () {
        //this.node.runAction(cc.moveBy(5,cc.p(0,-1000)));

        
    },

    setBlack (isBlack,isInit) {
        //this.node.runAction(cc.moveBy(5,cc.p(0,-1000)));

        this.m_blackState = isBlack;
        // this.node.color = (isBlack ? cc.Color.BLACK : cc.Color.WHITE);
        if(!isInit){
            var aName = (isBlack ? "w2b" : "b2w");
            this.node.getComponent(cc.Animation).play(aName);
        }
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    adjugeCollision: function (comp) {
        if(this.m_blackState !== comp.tellBlack()){
            cc.log("Game Over");
            global.eventlistener.fire("end_game");
        }
    },

    handleMeetSame : function (comp) {
        var flag = comp.meetSame && this.m_blackState != comp.tellBlack();
        if(flag){
            global.eventlistener.fire("pernatrateSame");
            if(comp.meetSame){
                global.Score += comp.score;
                global.eventlistener.fire("score",comp.score);
                this.scoreTxt.string = global.Score.toString();
                comp.tryHideBrain();
            }
        }

        if(comp.name.match("pass")){
            flag = true;
        }
        return flag;
    },

    onCollisionEnter: function (other, self) {
        // this.node.color = cc.Color.RED;
        var comp = other.node.getComponent('panel');
        if(this.handleMeetSame(comp)){
            cc.audioEngine.playEffect(this.auios[2], false);
            return;
        }

        cc.audioEngine.playEffect(this.auios[0], false);

        this.adjugeCollision(comp);

        this.touchingNumber ++;

        this.m_gravityFall = false;

        

        

        this.direction = (comp.isReverse() ? -1 : 1);//horizen 1:rigth -1:left

        cc.log("other collision stay enter %s",this.direction);

        var speedOnPanel = comp.get_speed();//abs

        var isDown = -1;//comp.isDown;

        var rotateOnPanel = this.m_rotateOnPanel
        // Math.abs(cc.degreesToRadians(other.node.rotation));//>0,<0

        // this.m_rotateOnPanel = rotateOnPanel
        //
        
        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();

        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        //this.speed.x > 0 right < 0 left
        //this.speed.y > 0 


        cc.log("sin & cos %s,%s",Math.sin(rotateOnPanel),Math.cos(rotateOnPanel));
        this.speed = cc.v2(speedOnPanel * Math.cos(rotateOnPanel) * this.direction,speedOnPanel * Math.sin(rotateOnPanel) * isDown);
        cc.log('after set speed (%s,%s)',this.speed.x,this.speed.y);
        cc.log('after set speed %s %s',rotateOnPanel,speedOnPanel);
        cc.log("self(%s,%s) other(%s,%s)",selfPreAabb.xMin,selfPreAabb.xMax,
            otherPreAabb.xMin,otherPreAabb.xMax);
        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            cc.log("selfPreAabb.xMax > otherPreAabb.xMax %s",selfPreAabb.xMax > otherPreAabb.xMax);
            // if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
            if (this.speed.x < 0 ) {
                // this.node.x = otherPreAabb.xMax - this.node.parent.x;
                this.collisionX = -1;
            }
            else if (this.speed.x > 0 ) {//&& (selfPreAabb.xMin < otherPreAabb.xMin)
                // this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                this.collisionX = 1;
            }

            //this.speed.x =  //0;
            other.touchingX = true;
            cc.log("collision on x-axis");
            // return;
        }

        // 3rd step
        // forward y-axis, check whether collision on y-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            cc.log("collision on y-axis");
            if (this.speed.y < 0 ) {//&& (selfPreAabb.yMax > otherPreAabb.yMax
                // this.node.y = otherPreAabb.yMax - this.node.parent.y;
                //this.jumping = false;
                this.collisionY = -1;
            }
            else if (this.speed.y > 0 ) {//&& (selfPreAabb.yMin < otherPreAabb.yMin)
                // this.node.y = otherPreAabb.yMin - selfPreAabb.height - this.node.parent.y;
                this.collisionY = 1;
            }
            
            //this.speed.y = ; //0;
            other.touchingY = true;
        }    
        
    },
    
    onCollisionStay: function (other, self) {
        var comp = other.node.getComponent('panel');

        this.m_stayOnBoard = true;

        if(this.handleMeetSame(comp)){

            cc.audioEngine.playEffect(this.auios[2], false);
            return;
        }

        this.adjugeCollision(comp)

        // cc.log("other collision stay %s",comp.m_testFlag);
        if (this.collisionY === -1) {
            // if (other.node.group === 'floor') {
            //     var motion = other.node.getComponent('panel');
            //     if (motion) {
            //         this.node.x += motion._movedDiff;
            //     }
            // }

            // this.node.y = other.world.aabb.yMax;

            // var offset = cc.v2(other.world.aabb.x - other.world.preAabb.x, 0);
            
            // var temp = cc.affineTransformClone(self.world.transform);
            // temp.tx = temp.ty = 0;
            
            // offset = cc.pointApplyAffineTransform(offset, temp);
            // this.node.x += offset.x;
        }
    },
    
    onCollisionExit: function (other) {
        cc.log("collision exit");
        this.m_gravityFall = true;
        this.touchingNumber --;
        if (this.touchingNumber === 0) {
            // this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        }
        else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            //this.jumping = true;
        }
        if(!other.award){

            this.m_stayOnBoard = false;
            other.award = true;
            var ts = other.node.getComponent('panel').score;
            global.Score += ts
            global.eventlistener.fire("score",ts);
            cc.log("will set scoreTxt %s %s",ts,global.Score);
            this.scoreTxt.string = global.Score.toString();
        }
    },

    isOnBoard : function(){
        return this.m_stayOnBoard;
    },

    set_postion_y: function  (delta_y) {
        var t = this.prePosition.y + delta_y - this.stayPosy;
        // cc.log("set_postion_y %s %s - %s",t,this.prePosition.y + delta_y,this.stayPosy);
        var real_pass = this.stayPosy - this.prePosition.y;

        if(t < 0){
            // cc.log("real_pass is %s",real_pass)
            this.node.y += real_pass;
            this.prePosition.y = this.node.y

            //node.getComponent("Test");

            // cc.log("aaaaaaaaaaaaaaa %s,%s",delta_y,t);
            // this.layerRoot.y -= t;
            this.layerRoot.getComponent('root').set_postionY(this.layerRoot.y - t);

        }else{
            this.node.y += delta_y;
        }

    },

    update (dt) {
        // if(true){
        //     return;
        // }
        if(this.m_pause){
            return
        }

        if(this.m_gravityFall){//this.collisionY === 0
            cc.log("use gravity fall");
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }

            this.m_stayOnBoard = false;

            this.speed.x = 0;
        }

        // if (this.direction === 0) {
        //     if (this.speed.x > 0) {
        //         this.speed.x -= this.drag * dt;
        //         if (this.speed.x <= 0) this.speed.x = 0;
        //     }
        //     else if (this.speed.x < 0) {
        //         this.speed.x += this.drag * dt;
        //         if (this.speed.x >= 0) this.speed.x = 0;
        //     }
        // }
        // else {
            // this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            // if (Math.abs(this.speed.x) > this.maxSpeed.x) {
            //     this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            // }
        // }

        // if (this.speed.x * this.collisionX > 0) {
        //     this.speed.x = 0;
        // }


        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        // this.preStep.x = this.speed.x * dt;
        // this.preStep.y = this.speed.y * dt;
        var dt_y = this.speed.y * dt;
        cc.log("this.speedy %s",this.speed.y);
        if (!this.m_gravityFall)
        {

            this.node.x += this.adjust_X(dt_y);//this.speed.x * dt; //
        }
        // this.node.y += this.speed.y * dt;
        this.set_postion_y(dt_y);

    },

    adjust_X : function (dy_y) {
        var num = Math.abs(dy_y / Math.tan(this.m_rotateOnPanel)) * this.direction;
        cc.log("adjust_X num %s , self.m_rotateOnPanel %s %s %s",num,this.m_rotateOnPanel,dy_y,this.direction);
        return num;
    },
    onDestroy : function (){
        global.eventlistener.off("changeWhite");
        global.eventlistener.off("changeBlack");
    },

    // playSlide : function(){
    //     if(!this.m_hadSlide){
    //         this.m_hadSlide = true;
    //         cc.audioEngine.playEffect(this.auios[0], false);
    //     }

    // },

    setPause : function  (isPause) {
        this.m_pause = isPause;  
    },
});
