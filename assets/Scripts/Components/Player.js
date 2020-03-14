cc.Class({
    extends: cc.Component,

    properties: {
        selected: {
            get () {
                return this._selected;
            },

            set (value) {
                this._selected = value;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    onMouseDown(event) {
        if (this.selected == null) {
            return;
        }

        var viewPoint = cc.v2(event.getLocationX(), event.getLocationY());
        var converted = this.node.convertToNodeSpaceAR(viewPoint);
        var gridPos = cc.v2(converted.x / 64, converted.y / 64);
        var gridPosRounded = cc.v2(Math.round(gridPos.x), Math.round(gridPos.y));
        var target = cc.v2(gridPosRounded.x * 64, gridPosRounded.y * 64);

        if (target.x != this.selected.x || target.y != this.selected.y) {
            this.selected.x = target.x;
            this.selected.y = target.y;
            this.selected = null;
        }
    },

    // update (dt) {},
});
