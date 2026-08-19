/**
 * 开发环境测试数据（仅用于 IndexedDB 首次初始化）。
 *
 * 说明：
 * 1. 这些数据与正式业务数据结构完全一致（复用 src/models 下的模型类）。
 * 2. 只在 IndexedDB 数据库首次创建时写入一次；数据库已存在时不会重复初始化。
 * 3. 可通过 src/db/indexedDB.js 导出的 clearTestData() 明确删除，
 *    该函数只删除此处写入的测试记录，不影响用户后续产生的正式数据。
 */
import Dish from '@/models/Dish';
import Position from '@/models/Position';
import Advice from '@/models/Advice';
import Advice_Comment from '@/models/AdviceComment';
import Selection from '@/models/Selection';
import Selection_Comment from '@/models/SelectionComment';
import Suggestion from '@/models/Suggestion';
import Suggestion_Comment from '@/models/SuggestionComment';
import noImage from '@/static/no_image.png';

export const createSeedDishes = () => [
    new Dish(1, '\u7ea2\u70e7\u8089', { stair: 1, window: 1 }, noImage, 4.8, 18),
    new Dish(2, '\u5bab\u4fdd\u9e21\u4e01', { stair: 1, window: 2 }, noImage, 4.6, 16),
    new Dish(3, '\u9c7c\u9999\u8089\u4e1d', { stair: 1, window: 3 }, noImage, 4.5, 15),
    new Dish(4, '\u756a\u8304\u7092\u86cb', { stair: 1, window: 4 }, noImage, 4.2, 12),
    new Dish(5, '\u9752\u6912\u571f\u8c46\u4e1d', { stair: 1, window: 5 }, noImage, 4.1, 10),
    new Dish(6, '\u9ebb\u5a46\u8c46\u8150', { stair: 1, window: 6 }, noImage, 4.7, 14),
    new Dish(7, '\u9178\u83dc\u9c7c', { stair: 1, window: 7 }, noImage, 4.9, 26),
    new Dish(8, '\u53ef\u4e50\u9e21\u7fc5', { stair: 1, window: 8 }, noImage, 4.4, 20),
    new Dish(9, '\u5496\u55b1\u9e21\u5757', { stair: 2, window: 1 }, noImage, 4.3, 19),
    new Dish(10, '\u9999\u83c7\u6cb9\u83dc', { stair: 2, window: 2 }, noImage, 4.0, 11),
    new Dish(11, '\u6c34\u716e\u8089\u7247', { stair: 2, window: 3 }, noImage, 4.8, 24),
    new Dish(12, '\u56de\u9505\u8089', { stair: 2, window: 4 }, noImage, 4.6, 18),
    new Dish(13, '\u7cd6\u918b\u91cc\u810a', { stair: 2, window: 5 }, noImage, 4.5, 21),
    new Dish(14, '\u5730\u4e09\u9c9c', { stair: 2, window: 6 }, noImage, 4.2, 13),
    new Dish(15, '\u897f\u7ea2\u67ff\u70a9\u725b\u8169', { stair: 2, window: 7 }, noImage, 4.7, 28),
];

export const createSeedSelections = () => [
    new Selection(1, '\u7528\u62371', '2026-03-01', '\u8fd9\u4efd\u5957\u9910\u6027\u4ef7\u6bd4\u5f88\u9ad8\uff0c\u4e2d\u5348\u53bb\u4e70\u57fa\u672c\u4e0d\u4f1a\u8e29\u5751\u3002', 12, [new Position(1, 1)], 4.5),
    new Selection(2, '\u7528\u62372', '2026-03-02', '\u53e3\u5473\u6bd4\u8f83\u7a33\u5b9a\uff0c\u7a97\u53e3\u963f\u59e8\u6253\u83dc\u4e5f\u5f88\u5feb\u3002', 14, [new Position(1, 2), new Position(2, 5)], 4.0),
    new Selection(3, '\u7528\u62373', '2026-03-03', '\u5206\u91cf\u8db3\uff0c\u9002\u5408\u4e0b\u5348\u8fd8\u6709\u4f53\u80b2\u8bfe\u7684\u65f6\u5019\u5403\u3002', 15, [new Position(2, 1)], 4.5),
    new Selection(4, '\u7528\u62374', '2026-03-04', '\u5473\u9053\u4e0d\u9519\uff0c\u4f46\u5efa\u8bae\u9519\u5f00\u9ad8\u5cf0\u671f\uff0c\u6392\u961f\u4f1a\u66f4\u8212\u670d\u4e00\u4e9b\u3002', 18, [new Position(1, 6)], 3.5),
    new Selection(5, '\u7528\u62375', '2026-03-05', '\u6211\u8fd9\u5468\u5403\u4e86\u4e24\u6b21\uff0c\u4ef7\u683c\u3001\u53e3\u611f\u3001\u51fa\u9910\u901f\u5ea6\u90fd\u5f88\u7a33\u3002', 20, [new Position(2, 3)], 5.0),
    new Selection(6, '\u7528\u62376', '2026-03-06', '\u9002\u5408\u559c\u6b22\u6e05\u6de1\u4e00\u70b9\u7684\u540c\u5b66\uff0c\u603b\u4f53\u4f53\u9a8c\u8fd8\u53ef\u4ee5\u3002', 11, [new Position(1, 4), new Position(2, 4)], 3.0),
    new Selection(7, '\u7528\u62377', '2026-03-07', '\u8fd9\u4e2a\u7a97\u53e3\u6700\u8fd1\u53e3\u5473\u8fdb\u6b65\u5f88\u5927\uff0c\u503c\u5f97\u518d\u8bd5\u8bd5\u3002', 16, [new Position(2, 2)], 4.0),
    new Selection(8, '\u7528\u62378', '2026-03-08', '\u82e5\u60f3\u5403\u5f97\u66f4\u70ed\u4e4e\uff0c\u5efa\u8bae12\u70b9\u524d\u5c31\u53bb\u6392\u961f\u3002', 22, [new Position(1, 7)], 4.5),
    new Selection(9, '\u7528\u62379', '2026-03-09', '\u8d70\u5e73\u4ef7\u8def\u7ebf\uff0c\u5bf9\u9884\u7b97\u6709\u9650\u7684\u540c\u5b66\u5f88\u53cb\u597d\u3002', 13, [new Position(2, 6)], 3.5),
    new Selection(10, '\u7528\u623710', '2026-03-10', '\u5982\u679c\u5f53\u5929\u83dc\u54c1\u72b6\u6001\u597d\uff0c\u8fd9\u4e2a\u7a97\u53e3\u7684\u4e0a\u9650\u5176\u5b9e\u5f88\u9ad8\u3002', 19, [new Position(1, 8), new Position(2, 8)], 4.5),
];

export const createSeedSelectionComments = () => [
    new Selection_Comment(
        '1-comment-1',
        '\u540c\u5b66A',
        '2026-03-11',
        '\u8fd9\u6761\u5206\u4eab\u5f88\u6709\u53c2\u8003\u4ef7\u503c\uff0c\u6211\u4e0a\u5468\u4e5f\u5728\u8fd9\u4e2a\u7a97\u53e3\u4e70\u8fc7\uff0c\u4ef7\u683c\u548c\u53e3\u5473\u90fd\u6bd4\u8f83\u7a33\u5b9a\u3002',
        1,
    ),
    new Selection_Comment(
        '1-comment-2',
        '\u540c\u5b66B',
        '2026-03-12',
        '\u8865\u5145\u4e00\u4e0b\uff0c\u5982\u679c\u4e2d\u5348\u9ad8\u5cf0\u53bb\u7684\u8bdd\u6392\u961f\u4f1a\u7a0d\u5fae\u4e45\u4e00\u70b9\uff0c\u4e0d\u8fc7\u6574\u4f53\u8fd8\u662f\u503c\u5f97\u63a8\u8350\u3002',
        1,
    ),
    new Selection_Comment(
        '1-comment-3',
        '\u540c\u5b66C',
        '2026-03-13',
        '\u6211\u66f4\u559c\u6b22\u5b83\u521a\u51fa\u9505\u7684\u65f6\u5019\uff0c\u53e3\u611f\u4f1a\u66f4\u597d\uff0c\u4f4d\u7f6e\u6807\u7b7e\u5199\u5f97\u4e5f\u5f88\u6e05\u695a\u3002',
        1,
    ),
    new Selection_Comment(
        '1-comment-4',
        '\u540c\u5b66D',
        '2026-03-13',
        '\u6211\u4e5f\u89c9\u5f97\u8fd9\u6761\u63a8\u8350\u5f88\u51c6\uff0c\u5c24\u5176\u662f\u4ef7\u683c\u90e8\u5206\u5f88\u6709\u53c2\u8003\u4ef7\u503c\u3002',
        1,
        { 'user-id': '\u540c\u5b66A', 'comment-id': '1-comment-1' },
    ),
    new Selection_Comment(
        '1-comment-5',
        '\u540c\u5b66E',
        '2026-03-14',
        '\u6392\u961f\u65f6\u95f4\u8fd9\u70b9\u8bf4\u5f97\u5bf9\uff0c\u6211\u4e00\u822c\u4f1a\u9519\u5f00\u4e2d\u5348\u9ad8\u5cf0\u518d\u53bb\u3002',
        1,
        { 'user-id': '\u540c\u5b66B', 'comment-id': '1-comment-2' },
    ),
    new Selection_Comment(
        '1-comment-6',
        '\u540c\u5b66F',
        '2026-03-14',
        '\u6211\u4e0a\u6b21\u5c31\u662f\u770b\u4e86A\u540c\u5b66\u7684\u8bc4\u8bba\u53bb\u4e70\u7684\uff0c\u786e\u5b9e\u6ca1\u8e29\u5751\u3002',
        1,
        { 'user-id': '\u540c\u5b66D', 'comment-id': '1-comment-4' },
    ),
];

export const createSeedAdvices = () => [
    new Advice(1, '\u540c\u5b661', '2026-03-02', '\u5e0c\u671b\u98df\u5802\u53ef\u4ee5\u589e\u52a0\u4f4e\u8102\u9e21\u80f8\u8089\u6c99\u62c9\u7a97\u53e3\uff0c\u65e9\u4e0a\u6216\u4e2d\u5348\u90fd\u4f1a\u6709\u4e0d\u5c11\u540c\u5b66\u9700\u8981\u3002', 12),
    new Advice(2, '\u540c\u5b662', '2026-03-04', '\u5efa\u8bae\u51fa\u4e00\u4e2a\u8f7b\u98df\u5957\u9910\u533a\uff0c\u6bd4\u5982\u9ea6\u7247\u3001\u6ebf\u6cc9\u86cb\u548c\u6c34\u679c\u676f\u7684\u7ec4\u5408\u3002', 9),
    new Advice(3, '\u540c\u5b663', '2026-03-06', '\u60f3\u5403\u505a\u5f97\u6e05\u723d\u4e00\u70b9\u7684\u51c9\u9762\uff0c\u590f\u5929\u5e94\u8be5\u4f1a\u5f88\u53d7\u6b22\u8fce\u3002', 18),
    new Advice(4, '\u540c\u5b664', '2026-03-08', '\u5e0c\u671b\u80fd\u591a\u4e0a\u4e00\u4e9b\u975e\u6cb9\u70b8\u7c7b\u7684\u5c0f\u5403\uff0c\u6bd4\u5982\u84b8\u997a\u3001\u83dc\u56e2\u5b50\u4e4b\u7c7b\u3002', 7),
    new Advice(5, '\u540c\u5b665', '2026-03-10', '\u5efa\u8bae\u52a0\u4e00\u4e2a\u6bcf\u5468\u9650\u5b9a\u65b0\u54c1\u680f\uff0c\u54ea\u6015\u6bcf\u6b21\u53ea\u4e0a\u4e24\u4e09\u9053\uff0c\u4e5f\u4f1a\u66f4\u6709\u671f\u5f85\u611f\u3002', 15),
];

export const createSeedAdviceComments = () => [
    new Advice_Comment(
        '1-comment-1',
        '\u540c\u5b66A',
        '2026-03-11',
        1,
        '\u8fd9\u4e2a\u5efa\u8bae\u6211\u5f88\u652f\u6301\uff0c\u73b0\u5728\u8f7b\u98df\u9009\u9879\u786e\u5b9e\u504f\u5c11\u3002',
        null,
        6,
    ),
    new Advice_Comment(
        '1-comment-2',
        '\u540c\u5b66B',
        '2026-03-12',
        1,
        '\u5982\u679c\u80fd\u628a\u4ef7\u683c\u63a7\u5236\u572812\u5143\u5de6\u53f3\uff0c\u5e94\u8be5\u4f1a\u6709\u66f4\u591a\u4eba\u8bd5\u3002',
        null,
        4,
    ),
    new Advice_Comment(
        '1-comment-3',
        '\u540c\u5b66C',
        '2026-03-13',
        1,
        '\u6211\u89c9\u5f97\u53ef\u4ee5\u5148\u4ece\u51c9\u9762\u548c\u6c34\u679c\u76c5\u8fd9\u79cd\u7b80\u5355\u7ec4\u5408\u5f00\u59cb\u3002',
        null,
        8,
    ),
    new Advice_Comment(
        '1-comment-4',
        '\u540c\u5b66D',
        '2026-03-13',
        1,
        '\u6211\u4e5f\u8ba4\u540c\uff0c\u5c24\u5176\u662f\u8fd0\u52a8\u540e\u5176\u5b9e\u5f88\u9700\u8981\u8fd9\u79cd\u5957\u9910\u3002',
        '1-comment-1',
        3,
    ),
    new Advice_Comment(
        '1-comment-5',
        '\u540c\u5b66E',
        '2026-03-14',
        1,
        '\u4ef7\u683c\u63a7\u5236\u786e\u5b9e\u5f88\u91cd\u8981\uff0c\u4e0d\u7136\u5b66\u751f\u65e5\u5e38\u4e0d\u4e00\u5b9a\u4f1a\u56de\u8d2d\u3002',
        '1-comment-2',
        2,
    ),
    new Advice_Comment(
        '1-comment-6',
        '\u540c\u5b66F',
        '2026-03-14',
        1,
        '\u8981\u662f\u771f\u7684\u4e0a\u65b0\u4e86\uff0c\u6211\u613f\u610f\u53bb\u505a\u7b2c\u4e00\u6279\u8bd5\u5403\u3002',
        '1-comment-4',
        5,
    ),
];

export const createSeedSuggestions = () => [
    new Suggestion(1, '\u540c\u5b661', '2026-03-03', '\u5efa\u8bae\u98df\u5802\u5348\u9910\u65f6\u6bb5\u589e\u52a0\u70ed\u6c64\u81ea\u52a9\u53f0\uff0c\u5c24\u5176\u662f\u51ac\u5929\u4f1a\u5f88\u5b9e\u7528\u3002', 11),
    new Suggestion(2, '\u540c\u5b662', '2026-03-05', '\u5e0c\u671b\u80fd\u628a\u6392\u961f\u52a8\u7ebf\u505a\u5f97\u66f4\u6e05\u6670\u4e00\u4e9b\uff0c\u9ad8\u5cf0\u671f\u73b0\u5728\u5bb9\u6613\u5835\u5728\u4e00\u8d77\u3002', 8),
    new Suggestion(3, '\u540c\u5b663', '2026-03-07', '\u53ef\u4ee5\u8003\u8651\u52a0\u4e00\u4e9b\u5c0f\u4efd\u83dc\uff0c\u8fd9\u6837\u642d\u914d\u4f1a\u66f4\u81ea\u7531\uff0c\u4e5f\u80fd\u51cf\u5c11\u6d6a\u8d39\u3002', 15),
    new Suggestion(4, '\u540c\u5b664', '2026-03-09', '\u5efa\u8bae\u5728\u6d17\u7897\u533a\u9644\u8fd1\u589e\u52a0\u7eb8\u5dfe\u548c\u514d\u6d17\u6d17\u624b\u6db2\uff0c\u4f53\u9a8c\u4f1a\u66f4\u597d\u3002', 6),
    new Suggestion(5, '\u540c\u5b665', '2026-03-10', '\u5e0c\u671b\u6bcf\u5468\u516c\u5e03\u4e00\u6b21\u98df\u5802\u6539\u8fdb\u8fdb\u5ea6\uff0c\u8ba9\u5927\u5bb6\u80fd\u770b\u5230\u5efa\u8bae\u88ab\u91c7\u7eb3\u7684\u60c5\u51b5\u3002', 19),
];

export const createSeedSuggestionComments = () => [
    new Suggestion_Comment(
        '1-comment-1',
        '\u540c\u5b66A',
        '2026-03-11',
        1,
        '\u70ed\u6c64\u81ea\u52a9\u53f0\u8fd9\u4e2a\u60f3\u6cd5\u771f\u7684\u5f88\u5b9e\u7528\uff0c\u5c24\u5176\u51ac\u5929\u4e0b\u8bfe\u540e\u5f88\u9700\u8981\u3002',
        null,
        5,
    ),
    new Suggestion_Comment(
        '1-comment-2',
        '\u540c\u5b66B',
        '2026-03-12',
        1,
        '\u6211\u66f4\u5173\u6ce8\u6392\u961f\u52a8\u7ebf\u8fd9\u4e2a\u95ee\u9898\uff0c\u9ad8\u5cf0\u671f\u771f\u7684\u5f88\u6324\u3002',
        null,
        7,
    ),
    new Suggestion_Comment(
        '1-comment-3',
        '\u540c\u5b66C',
        '2026-03-13',
        1,
        '\u5c0f\u4efd\u83dc\u8fd9\u4e2a\u5efa\u8bae\u4e5f\u5f88\u597d\uff0c\u80fd\u8ba9\u642d\u914d\u66f4\u7075\u6d3b\u3002',
        null,
        4,
    ),
    new Suggestion_Comment(
        '1-comment-4',
        '\u540c\u5b66D',
        '2026-03-13',
        1,
        '\u800c\u4e14\u70ed\u6c64\u5982\u679c\u80fd\u505a\u5230\u81ea\u52a9\uff0c\u6392\u961f\u538b\u529b\u4e5f\u4f1a\u5c0f\u4e00\u4e9b\u3002',
        '1-comment-1',
        3,
    ),
    new Suggestion_Comment(
        '1-comment-5',
        '\u540c\u5b66E',
        '2026-03-14',
        1,
        '\u5f53\u524d\u52a8\u7ebf\u95ee\u9898\u4e3b\u8981\u662f\u53d6\u9910\u53e3\u548c\u6536\u76d8\u53e3\u592a\u8fd1\u4e86\u3002',
        '1-comment-2',
        2,
    ),
    new Suggestion_Comment(
        '1-comment-6',
        '\u540c\u5b66F',
        '2026-03-14',
        1,
        '\u6bcf\u5468\u516c\u5e03\u6539\u8fdb\u8fdb\u5ea6\u8fd9\u70b9\u4e5f\u5f88\u91cd\u8981\uff0c\u8fd9\u6837\u5927\u5bb6\u4f1a\u66f4\u613f\u610f\u63d0\u610f\u89c1\u3002',
        '1-comment-3',
        6,
    ),
];

export const createSeedAccount = () => ({
    id: 'current',
    username: 'student_2026',
    nickname: '\u98df\u5802\u89c2\u5bdf\u5458',
    gender: '\u4e0d\u613f\u900f\u9732',
    customGender: '',
    gradYear: null,
    className: '',
    realName: '',
    avatar: '',
    registerDate: '2026-01-12',
    level: 3,
    ratingCount: 128,
});
