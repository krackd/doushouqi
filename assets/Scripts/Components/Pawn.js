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
            get() {
                return this._border;
            },

            set(value) {
                this._border = value;
            }
        },

        value: 0
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

    start() {
        if (this.player.displayValue) {
            this.makeLabel();
        }
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

    update(dt) {
        
    },

    beats(pawn) {
        return this.value > pawn.value || this.value == 1 && pawn.value == 8;
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

    destroyPawn() {
        this.player.removePawn(this);
        this.node.destroy();
    },

    makeLabel() {
        var valueBorder = cc.instantiate(this.player.valueBorder);
        var labelNode = new cc.Node();

        this.label = labelNode.addComponent(cc.Label);
        this.label.fontFamilty = "Arial Black";
        this.label.fontSize = 10;
        this.label.useSystemFont = true;
        this.label.enableBold = true;
        this.label.string = this.value.toString();

        labelNode.setParent(valueBorder);
        labelNode.color = this.player.valueLabelColor;
        labelNode.setPosition(0, -19.5);

        valueBorder.setParent(this.node);
        valueBorder.setPosition(0, 0);
        valueBorder.setPosition(21, -21);
        valueBorder.color = this.player.color;
    },
});


