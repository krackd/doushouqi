cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pawns = this.node.getComponentsInChildren("Pawn");
        this.map = this.node.getParent().getComponentInChildren("Map");
    },

    hasPawn(pawn) {
        return this.pawns.includes(pawn);
    }

    // update (dt) {},
});
