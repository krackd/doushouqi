cc.Class({
    extends: cc.Component,

    properties: {
        color: {
            default: cc.color(0,0,0,255)
        },
        
        border: {
            default: null,
            type: cc.Prefab
        }
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
        this.pawns.forEach(pawn => this.initPawn(pawn));
    },

    initPawn(pawn) {
        // Snapped position
        var pos = this.map.getPositionFromTilePosition(
            this.map.getTilePositionFromPosition(
                pawn.node.getPosition()
            )
        );
        // Creating the border
        pawn.border = cc.instantiate(this.border);
        pawn.border.setPosition(cc.v2(0, 0));
        pawn.border.setParent(pawn.node);
        pawn.border.color = this.color;
        // Snapping pawn and adding the border
        pawn.node.setPosition(pos);
    }

    // update (dt) {},
});
