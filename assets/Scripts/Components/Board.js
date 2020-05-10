// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        selected: {
            get() {
                return this._selected;
            },

            set(value) {
                this._selected = value;
            }
        },

        selectionColor: {
            default: cc.Color.GREEN
        }
    },

    // onLoad () {},

    onLoad() {
        this.map = this.node.getComponent("Map");
        this.players = this.node.getParent().getComponentsInChildren("Player");
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    // update (dt) {},

    onSelect(pawn) {
        if (this.currentPlayer.hasPawn(pawn)) {
            if (this.selected != null) {
                this.selected.resetBorderColor();
            }

            this.selected = pawn;
            pawn.setBorderColor(this.selectionColor);
        }
    },

    onMouseDown(event) {
        var pawn = this.selected;

        if (pawn == null) {
            return;
        }

        if (this.map.isGroundCollisionView(event.getLocationInView())) {
            return;
        }

        if (!pawn.canSwim && this.map.isWaterCollisionView(event.getLocationInView())) {
            return;
        }

        var currentTilePos = this.map.getPawnPosition(pawn);
        var targetTilePos = this.map.getTilePosition(event.getLocationInView());
        if (Utils.isSame(currentTilePos, targetTilePos)) {
            return;
        }

        var targetPos = this.map.getPositionFromTilePosition(targetTilePos);
        var distance = this.distanceSqr(currentTilePos, targetTilePos);

        // Orthogonal moves only, one cell at a time
        if (distance > 1 && !this.canWaterJump(currentTilePos, targetTilePos, pawn)) {
            return;
        }
        
        var opponentPawn = this.getOpponent(targetPos);
        // If cannot beat the opponent pawn
        if (opponentPawn !== undefined && !pawn.beats(opponentPawn)) {
            return;
        }

        var currentPos = this.map.getPositionFromTilePosition(currentTilePos);
        // If exiting the water and attacking a grounded opponent
        if (opponentPawn !== undefined && pawn.value != opponentPawn.value && this.map.isWaterCollisionWorld(currentPos) && !this.map.isWaterCollisionWorld(targetPos)) {
            return;
        }

        // If entering a trap: reduce the value to 0
        // If exiting a trap: restore the pawn value
        // If entering opponent throne: win

        // Else: can move to selected cell
        this.selected = null;

        pawn.moveTo(targetPos);
        pawn.resetBorderColor();
        
        
        if (opponentPawn !== undefined) {
            cc.log("Removing pawn");
            opponentPawn.destroyPawn();
        }

        // Next player
        this.currentPlayerIndex = ++this.currentPlayerIndex % this.players.length;
        this.currentPlayer = this.players[this.currentPlayerIndex];

    },

    canWaterJump(from, to, pawn) {
        // Only tiger and lion can water jump
        if (pawn.value != 6 && pawn.value != 7) {
            return false;
        }

        // First and last cell must be ground cells
        var isFromToValid =
            (from.x === to.x || from.y === to.y)
            && !this.map.isWaterCollisionTiled(from)
            && !this.map.isWaterCollisionTiled(to)
        ;

        if (!isFromToValid) {
            return false;
        }

        // In between cells must be free of opponent pawn
        var offset = to.sub(from).normalize();
        for (var i = from.add(offset); !Utils.isSame(i, to); i = i.add(offset)) {
            // In between cells must be water cells
            if (!this.map.isWaterCollisionTiled(i) || this.getOpponentTiled(i) !== undefined) {
                return false;
            }
        }
        return true;
    },

    distanceSqr(from, to) {
        return to.sub(from).magSqr();
    },

    getOpponent(pos) {
        return this.getOpponentTiled(this.map.getTilePositionFromPosition(pos));
    },

    getOpponentTiled(tilePos) {
        return this.players
        .filter(player => player !== this.currentPlayer)
        .flatMap(player => player.getPawns())
        .find(p => {
            var pawnTilePos = this.map.getTilePositionFromPosition(p.node.getPosition());
            return pawnTilePos.x == tilePos.x && pawnTilePos.y == tilePos.y;
        });
    },

});
