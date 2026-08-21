/**
 * 菜品模型。
 * position 结构：{ stair: number, window: number }
 */
export default class Dish {
    constructor(id, name, position, image, rate, price, rate_count = 0) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.image = image;
        this.rate = rate;
        this.price = price;
        this.rate_count = rate_count;
    }
}
