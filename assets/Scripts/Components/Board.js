// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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

    // onLoad () {},

    start () {
        this.map = this.node.getComponent("Map");
        this.players = this.node.getParent().getComponentsInChildren("Player");
        this.currentPlayer = this.players[0];

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    // update (dt) {},

    onSelect(pawn) {
        if (this.currentPlayer.hasPawn(pawn)) {
            cc.log('pawn pos: ' + this.map.getPawnPosition(pawn));
            this.selected = pawn;
        }
    },

    onMouseDown(event) {
        if (this.selected == null) {
            return;
        }

        var isGroundCollision = this.map.isGroundCollision(event.getLocationInView());
        cc.log('isGroundCollision: ' + isGroundCollision);

        var isWaterCollision = this.map.isWaterCollision(event.getLocationInView());
        cc.log('isWaterCollision: ' + isWaterCollision);


        this.selected = null;
    },
});
