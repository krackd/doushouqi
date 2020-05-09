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
        var distance = targetTilePos.sub(currentTilePos).magSqr();

        // Orthogonal moves only, one cell at a time
        if (distance > 1) {
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

    getOpponent(pos) {
        var tilePos = this.map.getTilePositionFromPosition(pos);
        return this.players
            .filter(player => player !== this.currentPlayer)
            .flatMap(player => player.getPawns())
            .find(p => {
                var pawnTilePos = this.map.getTilePositionFromPosition(p.node.getPosition());
                return pawnTilePos.x == tilePos.x && pawnTilePos.y == tilePos.y;
            });
    },
});
