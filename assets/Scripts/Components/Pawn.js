// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const MOVE_DURATION = 0.1;
const CELL_SIZE = 64;

const IDLE_OPACITY = 255;
const HOVER_OPACITY = 100;
const MOVE_OPACITY = 100;

cc.Class({
    extends: cc.Component,

    properties: {
        canSwim: false,

        border: {
            get () {
                return this._border;
            },

            set (value) {
                this._border = value;
            }
        }
    },

    onLoad() {
        this.player = this.node.getParent().getComponent("Player");
        this.board = this.player.node.getParent().getComponentInChildren("Board");

        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);

        this.node.opacity = IDLE_OPACITY;
    },
    
    start () {

    },

    onDestroy() {
        this.node.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
        this.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
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
        if (this._callback) {
            this._callback();
        }
    },

    update (dt) {
        
    },

    getPositionVec2() {
        var pawnPos3d = this.node.getPosition();
        var pawnPos2d = new cc.Vec2(pawnPos3d.x, pawnPos3d.y);
        return pawnPos2d;
    },

    moveTo(target) {
        this.node.runAction(cc.moveTo(MOVE_DURATION, target));
    },

    setBorderColor(color) {
        this.border.color = color;
    },

    resetBorderColor() {
        this.border.color = this.player.color;
    },

});
