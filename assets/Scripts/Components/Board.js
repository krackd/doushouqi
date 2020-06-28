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
        },

        winMsg: cc.Label,

        moveHighlight: {
            default: null,
            type: cc.Prefab
        },

        lastMovesNode: {
            default: null,
            type: cc.Node
        }
    },

    // onLoad () {},

    onLoad() {
        this.map = this.node.getComponent("Map");
        this.players = this.node.getParent().getComponentsInChildren("Player");
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.gameOver = false;

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    start() {
        this.currentPlayer.beginTurn();
    },

    // update (dt) {},

    onSelect(pawn) {
        if (this.currentPlayer.hasPawn(pawn)) {
            if (this.selected != undefined) {
                this.selected.resetBorderColor();
            }

            this.selected = pawn;
            pawn.setBorderColor(this.selectionColor);
        }
    },

    onMouseDown(event) {
        if (this.gameOver) {
            return;
        }

        var pawn = this.selected;
        if (pawn == undefined) {
            return;
        }

        var targetTilePos = this.map.getTilePosition(event.getLocationInView());
        var context = this.makeContext(targetTilePos, pawn);

        if (!this.canMove(context)) {
            return;
        }

        // If entering a trap: reduce the value to 0
        // If exiting a trap: restore the pawn value
        // If entering opponent throne: win

        // Making move highlighted tiles
        this.clearHighlights();
        this.makeHighlights(this.moveHighlight, context.currentPos, context.targetPos);

        // Else: can move to selected cell
        this.selected = undefined;

        var moveTween = pawn.createMoveTween(context.targetPos);
        pawn.resetBorderColor();
        
        if (context.opponentPawn !== undefined) {
            context.opponentPawn.destroyPawn();
        }

        var trap = this.getOpponentTrap(context.targetPos);
        pawn.setValue(trap !== undefined ? 0 : pawn.getInitialValue());

        var throne = this.getOpponentThrone(context.targetPos);
        if (throne !== undefined) {
            // current player wins
            this.win(this.currentPlayer);
        }

        // Check current player draw
        this.checkDraw(this.currentPlayer);

        if (!this.gameOver) {
            // Next player
            this.currentPlayer.endTurn();
            this.currentPlayerIndex = ++this.currentPlayerIndex % this.players.length;
            this.currentPlayer = this.players[this.currentPlayerIndex];
            this.currentPlayer.beginTurn();
    
            // Check opponent draw after move is done
            moveTween = moveTween.call(() => {
                // wait the end of move tween to check opponent drawness
                this.checkDraw(this.currentPlayer)
            });
        }

        // Start the move
        moveTween.start();
    },

    checkDraw(player) {
        if (this.noMoreMove(player)) {
            // Enemy wins
            // (to be change if more than 2 players, in this case just loose)
            this.draw();
        }
    },

    win(winner) {
        var msg = winner.getName() + " gagne !";
        this.winMsg.string = msg;
        this.winMsg.node.active = true;
        this.winMsg.node.color = winner.color;
        this.gameOver = true;
    },

    draw() {
        var msg = "Match Nul !";
        this.winMsg.string = msg;
        this.winMsg.node.active = true;
        this.winMsg.node.color = cc.Color.WHITE;
        this.gameOver = true;
    },

    makeContext(targetTilePos, pawn) {
        var targetPos = this.map.getPositionFromTilePosition(targetTilePos);
        var currentTilePos = this.map.getPawnPosition(pawn);
        var currentPos = this.map.getPositionFromTilePosition(currentTilePos);
        var distance = this.distanceSqr(currentTilePos, targetTilePos);
        var opponentPawn = this.getOpponentPawnTiled(targetTilePos);

        return {
            pawn: pawn,
            targetTilePos: targetTilePos,
            targetPos: targetPos,
            currentTilePos: currentTilePos,
            currentPos: currentPos,
            distance: distance,
            opponentPawn: opponentPawn,
        };
    },

    canMove(context) {
        // If target is out of board ground cell
        if (this.map.isGroundCollisionTiled(context.targetTilePos)) {
            return false;
        }
        // If target is a water cell and selected pawn cannot swim
        if (!context.pawn.canSwim && this.map.isWaterCollisionTiled(context.targetTilePos)) {
            return false;
        }
        // If clicked the same cell
        if (Utils.isSame(context.currentTilePos, context.targetTilePos)) {
            return false;
        }
        // Orthogonal moves only, one cell at a time, or water jump
        if (context.distance > 1 && !this.canWaterJump(context.currentTilePos, context.targetTilePos, context.pawn)) {
            return false;
        }
        // If cannot beat the opponent pawn
        if (context.opponentPawn !== undefined && !context.pawn.beats(context.opponentPawn)) {
            return false;
        }
        // If exiting the water and attacking a grounded opponent
        if (context.opponentPawn !== undefined && context.pawn.value != context.opponentPawn.value && this.map.isWaterCollisionTiled(context.currentTilePos) && !this.map.isWaterCollisionTiled(context.targetTilePos)) {
            return false;
        }
        // If attempting to move on player throne
        if (this.isPlayerThroneTiled(context.targetTilePos)) {
            return false;
        }

        return true;
    },

    noMoreMove(player) {
        const pawns = player.getPawns();
        for (let i = 0; i < pawns.length; i++) {
            const pawn = pawns[i];
            const moves = this.getMoveTiles(pawn);
            for (let j = 0; j < moves.length; j++) {
                const move = moves[j];
                var context = this.makeContext(move, pawn);
                if (this.canMove(context)) {
                    return false;
                }
            }
        }

        return true;
    },

    getMoveTiles(pawn) {
        var pawnPos = this.map.getTilePositionFromPosition(pawn.getPositionVec2());
        return [pawnPos.add(cc.Vec2.UP), pawnPos.add(cc.Vec2.RIGHT), pawnPos.add(cc.Vec2.RIGHT.mul(-1)), pawnPos.add(cc.Vec2.UP.mul(-1))];
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
            if (!this.map.isWaterCollisionTiled(i) || this.getAnyPawnTiled(i) !== undefined) {
                return false;
            }
        }
        return true;
    },

    distanceSqr(from, to) {
        return to.sub(from).magSqr();
    },

    // Get opponent objects from world position

    getOpponentPawn(pos) {
        return this.getOpponentPawnTiled(this.map.getTilePositionFromPosition(pos));
    },

    getOpponentTrap(pos) {
        return this.getOpponentTrapTiled(this.map.getTilePositionFromPosition(pos));
    },

    getOpponentThrone(pos) {
        return this.getOpponentThroneTiled(this.map.getTilePositionFromPosition(pos));
    },

    // Get opponent objects from tiled position

    getOpponentPawnTiled(tilePos) {
        return this.players
            .filter(player => player !== this.currentPlayer)
            .flatMap(player => player.getPawns())
            .find(p => {
                var pawnTilePos = this.map.getTilePositionFromPosition(p.node.getPosition());
                return pawnTilePos.x == tilePos.x && pawnTilePos.y == tilePos.y;
            });
    },

    getOpponentTrapTiled(tilePos) {
        return this.players
            .filter(player => player !== this.currentPlayer)
            .flatMap(player => player.getTraps())
            .find(t => {
                var trapTilePos = this.map.getTilePositionFromPosition(t.node.getPosition());
                return trapTilePos.x == tilePos.x && trapTilePos.y == tilePos.y;
            });
    },

    getOpponentThroneTiled(tilePos) {
        return this.players
            .filter(player => player !== this.currentPlayer)
            .map(player => player.getThrone())
            .find(t => {
                var throneTilePos = this.map.getTilePositionFromPosition(t.node.getPosition());
                return throneTilePos.x == tilePos.x && throneTilePos.y == tilePos.y;
            });
    },

    // Any objects from tiled position

    getAnyPawnTiled(tilePos) {
        return this.players
            .flatMap(player => player.getPawns())
            .find(p => {
                var pawnTilePos = this.map.getTilePositionFromPosition(p.node.getPosition());
                return pawnTilePos.x == tilePos.x && pawnTilePos.y == tilePos.y;
            });
    },

    // Player objects from tiled position

    isPlayerThroneTiled(tilePos) {
        var throne = this.currentPlayer.getThrone();
        var throneTilePos = this.map.getTilePositionFromPosition(throne.node.getPosition());
        return throneTilePos.x == tilePos.x && throneTilePos.y == tilePos.y;
    },

    // Move highlighted tiles

    makeHighlights(prefab, from, to) {
        this.makeHightlight(prefab, from);
        this.makeHightlight(prefab, to);
    },

    makeHightlight(prefab, pos) {
        var h = cc.instantiate(prefab);
        h.setPosition(pos);
        h.setParent(this.lastMovesNode);
        return h;
    },

    clearHighlights() {
        this.lastMovesNode.children
            .forEach(child => child.destroy());
    }

});
