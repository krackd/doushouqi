// Utility methods to manipulate CC Nodes
// export class NodeUtils {

//     static isSame(left, right) {
//         return JSON.stringify(left) === JSON.stringify(g);
//     }
// }

var Utils = cc.Class({
    statics: {

        isSame(left, right) {
            return JSON.stringify(left) === JSON.stringify(right);
        }
    }
});

module.exports = Utils;
