/**
 * 菜品模型。
 * position 结构：{ stair: number, window: number }
 */
export default class Dish {
    constructor(id, name, position, image, rate, price) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.image = image;
        this.rate = rate;
        this.price = price;
    }
}
