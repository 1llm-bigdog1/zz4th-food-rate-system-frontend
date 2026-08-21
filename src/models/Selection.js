/**
 * 严选评论模型。
 * @property {Array} position Position[]，同一评论可对应多个购买位置
 * @property {number} rate 评分（用于展示，不在提交弹窗中回写）
 */
export default class Selection {
    constructor(id, user_id, date, comment, price = 0, position = [], rate = 0, follow_comments = [], nickname = '', rate_count = 0) {
        this.id = id;
        this.user_id = user_id;
        this.nickname = nickname;
        this.date = date;
        this.comment = comment;
        this.price = price;
        this.position = position;
        this.rate = rate;
        this.follow_comments = follow_comments;
        this.rate_count = rate_count;
    }
}
