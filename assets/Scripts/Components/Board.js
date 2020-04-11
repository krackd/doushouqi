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
        if (this.selected == null) {
            return;
        }

        if (this.map.isGroundCollision(event.getLocationInView())) {
            return;
        }

        if (!this.selected.canSwim && this.map.isWaterCollision(event.getLocationInView())) {
            return;
        }

        var selectedPos = this.map.getPawnPosition(this.selected);
        var tilePos = this.map.getTilePosition(event.getLocationInView());
        if (Utils.isSame(selectedPos, tilePos)) {
            return;
        }

        var target = this.map.getPositionFromTilePosition(tilePos);
        var distance = tilePos.sub(selectedPos).magSqr();

        if (distance <= 2) {
            var pawn = this.selected;
            this.selected = null;

            pawn.moveTo(target);
            pawn.resetBorderColor();
            
            var opponentPawn = this.getOpponent(target);
            if (opponentPawn !== undefined) {
                opponentPawn.destroyPawn();
            }

            // Next player
            this.currentPlayerIndex = ++this.currentPlayerIndex % this.players.length;
            this.currentPlayer = this.players[this.currentPlayerIndex];
        }

    },

    getOpponent(pos) {
        return this.players
            .filter(player => player !== this.currentPlayer)
            .flatMap(player => player.getPawns())
            .find(p =>
                p.node.getPosition().x == pos.x
                && p.node.getPosition().y == pos.y
            );
    },
});
