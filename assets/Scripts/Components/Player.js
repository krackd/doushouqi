cc.Class({
    extends: cc.Component,

    properties: {
        playerIndex: 0,

        color: {
            default: cc.color(0, 0, 0, 255)
        },

        border: {
            default: null,
            type: cc.Prefab
        },

        displayValue: true,

        valueBorder: {
            default: null,
            type: cc.Prefab
        },

        valueLabelColor: cc.Color.WHITE,
        
        shadow: {
            default: null,
            type: cc.Prefab
        },

        pawnOffset: cc.v2(0, 0.1),  // in tile position units (0..1)
        flip: false,                // true if should flip sprite horizontally
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.map = this.node.getParent().getComponentInChildren("Map");
    },

    start() {
        this.pawns = this.node.getComponentsInChildren("Pawn");
        this.initPawns();
    },

    hasPawn(pawn) {
        return this.pawns.includes(pawn);
    },

    snapPawns(pawn) {
        // Snapped position
        var pos = this.map.getPositionFromTilePosition(
            this.map.getTilePositionFromPosition(
                pawn.node.getPosition()
            )
        );
        pawn.node.setPosition(pos);
        var sprite = pawn.node.getChildByName("Sprite");
        sprite.setPosition(this.pawnOffset.mul(64));
    },

    initPawns() {
        this.pawns.forEach(pawn => this.initPawn(pawn));
    },

    initPawn(pawn) {
        this.snapPawns(pawn);
        this.makeShadow(pawn);
        this.makeBorder(pawn);

        if (this.flip) {
            var sprite = pawn.node.getChildByName("Sprite");
            sprite.scaleX *= -1;
        }
    },

    getPawns() {
        return this.pawns;
    },

    removePawn(pawn) {
        var index = this.pawns.indexOf(pawn);
        if (index > -1) {
            this.pawns.splice(index, 1);
        }
    },

    makeBorder(pawn) {
        // Creating the border
        pawn.border = cc.instantiate(this.border);
        pawn.border.setPosition(cc.v2(0, 0));
        pawn.border.color = this.color;
        pawn.node.insertChild(pawn.border, 0);
    },

    makeShadow(pawn) {
        // Creating the border
        pawn.border = cc.instantiate(this.shadow);
        var pos = this.pawnOffset.mul(64);
        pos.y -= 32;
        pawn.border.setPosition(pos);
        pawn.node.insertChild(pawn.border, 0);
    }

    // update (dt) {},
});
