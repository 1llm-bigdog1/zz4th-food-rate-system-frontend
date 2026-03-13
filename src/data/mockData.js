import Dish from '@/models/Dish';
import Position from '@/models/Position';
import Selection from '@/models/Selection';
import noImage from '@/static/no_image.png';

/**
 * 生成菜品样例数据。
 * 说明：
 * - 返回新数组，避免页面间共享同一引用导致联动修改。
 * - 位置字段沿用项目既有结构：{ stair, window }。
 */
export const createMockDishes = () => [
    new Dish(1, '红烧肉', { stair: 1, window: 1 }, noImage, 4.8, 18),
    new Dish(2, '宫保鸡丁', { stair: 1, window: 2 }, noImage, 4.6, 16),
    new Dish(3, '鱼香肉丝', { stair: 1, window: 3 }, noImage, 4.5, 15),
    new Dish(4, '番茄炒蛋', { stair: 1, window: 4 }, noImage, 4.2, 12),
    new Dish(5, '青椒土豆丝', { stair: 1, window: 5 }, noImage, 4.1, 10),
    new Dish(6, '麻婆豆腐', { stair: 1, window: 6 }, noImage, 4.7, 14),
    new Dish(7, '酸菜鱼', { stair: 1, window: 7 }, noImage, 4.9, 26),
    new Dish(8, '可乐鸡翅', { stair: 1, window: 8 }, noImage, 4.4, 20),
    new Dish(9, '咖喱鸡块', { stair: 1, window: 9 }, noImage, 4.3, 19),
    new Dish(10, '香菇油菜', { stair: 1, window: 10 }, noImage, 4.0, 11),
    new Dish(11, '水煮肉片', { stair: 2, window: 1 }, noImage, 4.8, 24),
    new Dish(12, '回锅肉', { stair: 2, window: 2 }, noImage, 4.6, 18),
    new Dish(13, '糖醋里脊', { stair: 2, window: 3 }, noImage, 4.5, 21),
    new Dish(14, '地三鲜', { stair: 2, window: 4 }, noImage, 4.2, 13),
    new Dish(15, '西红柿牛腩', { stair: 2, window: 5 }, noImage, 4.7, 28),
    new Dish(16, '干锅花菜', { stair: 2, window: 6 }, noImage, 4.3, 16),
    new Dish(17, '黄焖鸡米饭', { stair: 2, window: 7 }, noImage, 4.4, 17),
    new Dish(18, '椒盐排条', { stair: 2, window: 8 }, noImage, 4.1, 22),
    new Dish(19, '手撕包菜', { stair: 2, window: 9 }, noImage, 4.0, 12),
    new Dish(20, '清蒸鲈鱼', { stair: 2, window: 10 }, noImage, 4.9, 32),
    new Dish(21, '孜然牛肉', { stair: 3, window: 1 }, noImage, 4.8, 29),
    new Dish(22, '粉蒸排骨', { stair: 3, window: 2 }, noImage, 4.6, 25),
    new Dish(23, '韭菜鸡蛋', { stair: 3, window: 3 }, noImage, 4.1, 10),
    new Dish(24, '红烧茄子', { stair: 3, window: 4 }, noImage, 4.2, 12),
    new Dish(25, '香辣鸡丁', { stair: 3, window: 5 }, noImage, 4.5, 18),
    new Dish(26, '豆角焖面', { stair: 3, window: 6 }, noImage, 4.3, 14),
    new Dish(27, '虾仁滑蛋', { stair: 3, window: 7 }, noImage, 4.7, 23),
    new Dish(28, '葱爆羊肉', { stair: 3, window: 8 }, noImage, 4.6, 27),
    new Dish(29, '黑椒鸡排', { stair: 3, window: 9 }, noImage, 4.4, 21),
    new Dish(30, '番茄牛肉面', { stair: 3, window: 10 }, noImage, 4.2, 16),
];

/**
 * 生成“老吃家严选”样例数据。
 * 说明：
 * - comment 统一为“示例”，与需求保持一致。
 * - position 使用 Position 类，便于后续统一字段访问。
 */
export const createMockSelections = () => [
    new Selection(1, '用户1', '2026-03-01', '示例', 12, [new Position(1, 1)], 4.5),
    new Selection(2, '用户2', '2026-03-02', '示例', 14, [new Position(1, 2), new Position(2, 5)], 4.0),
    new Selection(3, '用户3', '2026-03-03', '示例', 15, [new Position(2, 1)], 4.5),
    new Selection(4, '用户4', '2026-03-04', '示例', 18, [new Position(1, 6)], 3.5),
    new Selection(5, '用户5', '2026-03-05', '示例', 20, [new Position(2, 3)], 5.0),
    new Selection(6, '用户6', '2026-03-06', '示例', 11, [new Position(1, 4), new Position(2, 4)], 3.0),
    new Selection(7, '用户7', '2026-03-07', '示例', 16, [new Position(2, 2)], 4.0),
    new Selection(8, '用户8', '2026-03-08', '示例', 22, [new Position(1, 7)], 4.5),
    new Selection(9, '用户9', '2026-03-09', '示例', 13, [new Position(2, 6)], 3.5),
    new Selection(10, '用户10', '2026-03-10', '示例', 19, [new Position(1, 8), new Position(2, 8)], 4.5),
];

/**
 * 根据楼层数构建楼层下拉。
 */
export const buildFloorOptions = (maxFloor = 2, floorLabel = '楼') =>
    Array.from({ length: maxFloor }, (_, i) => i + 1).map((v) => ({
        label: `${v}${floorLabel}`,
        value: v,
    }));

/**
 * 根据窗口数构建窗口下拉。
 */
export const buildWindowOptions = (count = 8, windowLabel = '号窗口') =>
    Array.from({ length: count }, (_, i) => i + 1).map((v) => ({
        label: `${v}${windowLabel}`,
        value: v,
    }));
