cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.map = this.node.getParent().getComponentInChildren("Map");
    },

    start() {
        this.pawns = this.node.getComponentsInChildren("Pawn");
        this.snapPawns();
    },

    hasPawn(pawn) {
        return this.pawns.includes(pawn);
    },

    snapPawns() {
        this.pawns.forEach(pawn => this.snap(pawn));
    },

    snap(pawn) {
        var pos = this.map.getPositionFromTilePosition(
            this.map.getTilePositionFromPosition(
                pawn.node.getPosition()
            )
        );
        pawn.node.setPosition(pos);
    }

    // update (dt) {},
});
