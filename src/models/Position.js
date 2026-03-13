/**
 * 购买位置模型。
 * @property {number} floor 楼层
 * @property {number} window 窗口号
 */
export default class Position {
    constructor(floor, window) {
        this.floor = floor;
        this.window = window;
    }
}
