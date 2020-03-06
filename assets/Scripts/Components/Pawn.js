// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const MOVE_DURATION = 0.01;
const CELL_SIZE = 64;
const MAP_HALF_HEIGHT = 4;
const MAP_HALF_WIDTH = 3;

cc.Class({
    extends: cc.Component,

    properties: {
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

    onLoad() {
        //add keyboard input listener to call turnLeft and turnRight
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown(event) {
        var macro = cc.macro;
        switch (event.keyCode) {
            case macro.KEY.q:
                this.moveLeft();
                break;
            case macro.KEY.d:
                this.moveRight();
                break;
            case macro.KEY.z:
                this.moveUp();
                break;
            case macro.KEY.s:
                this.moveDown();
                break;
            
        }
    },

    start () {

    },

    update (dt) {
        
    },

    moveRight() {
        // FIXME check collisions instead of checking positions
        // TODO should check target position instead
        if (this.node.x < MAP_HALF_WIDTH * CELL_SIZE) {
            this.node.runAction(cc.moveBy(MOVE_DURATION, cc.v2(CELL_SIZE, 0)));
        }
    },
    
    moveLeft() {
        if (this.node.x > -MAP_HALF_WIDTH * CELL_SIZE) {
            this.node.runAction(cc.moveBy(MOVE_DURATION, cc.v2(-CELL_SIZE, 0)));
        }
    },
    
    moveUp() {
        if (this.node.y < MAP_HALF_HEIGHT * CELL_SIZE) {
            this.node.runAction(cc.moveBy(MOVE_DURATION, cc.v2(0, CELL_SIZE)));
        }
    },
    
    moveDown() {
        if (this.node.y > -MAP_HALF_HEIGHT * CELL_SIZE) {
            this.node.runAction(cc.moveBy(MOVE_DURATION, cc.v2(0, -CELL_SIZE)));
        }
    }
});
