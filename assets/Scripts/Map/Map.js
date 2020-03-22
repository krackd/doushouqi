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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.tilemap = this.node.getComponent(cc.TiledMap);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    },

    // update (dt) {},

    onMouseDown(event) {
        var tilePos = new cc.Vec2(0,0);
        tilePos.x = Math.floor(event.getLocationInView().x / this.tilemap.getTileSize().width); 
        tilePos.y = Math.floor(event.getLocationInView().y / this.tilemap.getTileSize().height); 

        var collisionsLayer = this.tilemap.getLayer("Collisions");
        cc.log("pos: " + tilePos);

        var tile = collisionsLayer.getTiledTileAt(tilePos);
        cc.log(tile);
    }
});
