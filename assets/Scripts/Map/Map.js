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
        var tilePos = new cc.Vec2(0,0);
        tilePos.x = Math.floor(position.x / this.tilemap.getTileSize().width);
        tilePos.y = Math.floor(position.y / this.tilemap.getTileSize().height);
        // tilePos.x += this.getMapSize().x / 2;
        // tilePos.y += this.getMapSize().y / 2;
        return tilePos;
    },

    getMapSize() {
        return this.tilemap.getMapSize();
    },

    isCollision(gid) {
        return gid != 0;
    }
});
