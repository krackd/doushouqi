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

const IDLE_OPACITY = 100;
const HOVER_OPACITY = 200;
const MOVE_OPACITY = 255;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.player = this.node.getParent().getComponent("Player");
        this.board = this.player.node.getParent().getComponentInChildren("Board");

        // add keyboard input listener to call turnLeft and turnRight
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);

        this.node.opacity = IDLE_OPACITY;
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onMouseEnter(event) {
        this.node.opacity = HOVER_OPACITY;
    },
    
    onMouseLeave(event) {
        this.node.opacity = IDLE_OPACITY;
    },
    
    onMouseDown(event) {
        this.node.opacity = MOVE_OPACITY;
        this.board.onSelect(this);
    },
    
    onMouseUp(event) {
        this.node.opacity = IDLE_OPACITY;
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.move, this);
        if (this._callback) {
            this._callback();
        }
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
