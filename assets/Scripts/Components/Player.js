cc.Class({
    extends: cc.Component,

    properties: {
        // All animal prefabs
        elephant: {
            default: null,
            type: cc.Prefab
        },

        tiger: {
            default: null,
            type: cc.Prefab
        },

        lion: {
            default: null,
            type: cc.Prefab
        },

        leopard: {
            default: null,
            type: cc.Prefab
        },

        dog: {
            default: null,
            type: cc.Prefab
        },

        wolf: {
            default: null,
            type: cc.Prefab
        },

        cat: {
            default: null,
            type: cc.Prefab
        },

        rat: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.map = this.node.getParent().getComponentInChildren("Map");
    },

    start() {
        this.initBoard();
        this.pawns = this.node.getComponentsInChildren("Pawn");
    },

    hasPawn(pawn) {
        return this.pawns.includes(pawn);
    },

    initBoard() {
        this.spawn(this.elephant, cc.v2(3,9));
        this.spawn(this.tiger, cc.v2(3,10));
    },

    spawn(prefab, pos) {
        var pawn = cc.instantiate(prefab);
        pawn.setParent(this.node);
        pawn.setPosition(this.map.getPositionFromTilePosition(pos));
        return pawn;
    }

    // update (dt) {},
});
