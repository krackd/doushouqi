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
    },

    // onLoad () {},

    start () {
        this.tilemap = this.node.getComponent(cc.TiledMap);
    },

    // update (dt) {},

    isGroundCollision(locationInView) {
        return this.isCollision(
            this.tilemap
                .getLayer("Collisions")
                .getTileGIDAt(this.getTilePosition(locationInView)));
    },

    isWaterCollision(locationInView) {
        return this.isCollision(
            this.tilemap
                .getLayer("WaterCollisions")
                .getTileGIDAt(this.getTilePosition(locationInView)));
    },

    getTilePosition(locationInView) {
        var tilePos = new cc.Vec2(0,0);
        tilePos.x = Math.floor(locationInView.x / this.tilemap.getTileSize().width); 
        tilePos.y = Math.floor(locationInView.y / this.tilemap.getTileSize().height);
        return tilePos;
    },
    
    getTilePositionFromPosition(position) {
        var halfSize = this.getMapHalfSize();
        var tilePos = new cc.Vec2(0,0);
        tilePos.x = Math.floor(position.x / this.tilemap.getTileSize().width) + halfSize.x;
        tilePos.y = halfSize.y - Math.floor(position.y / this.tilemap.getTileSize().height);
        return tilePos;
    },

    getPositionFromTilePosition(tilePos) {
        var halfSize = this.getMapHalfSize();
        var pos = new cc.Vec2(0,0);
        pos.x = (tilePos.x - halfSize.x) * this.tilemap.getTileSize().width;
        pos.y = (halfSize.y - tilePos.y) * this.tilemap.getTileSize().height;
        return pos;
    },

    getPawnPosition(pawn) {
        return this.getTilePositionFromPosition(pawn.getPositionVec2());
    },
    
    getMapHalfSize() {
        var size = this.tilemap.getMapSize();
        return new cc.Vec2(
            Math.floor(size.width / 2),
            Math.floor(size.height / 2)
        );
    },

    isCollision(gid) {
        return gid != 0;
    }
});
