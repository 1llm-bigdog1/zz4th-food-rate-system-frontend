/**
 * 严选分享评论模型。
 */
export default class Selection_Comment {
    constructor(id, user_id, date, detail, selection_id, reply = null, nickname = '') {
        this.id = id;
        this.user_id = user_id;
        this.nickname = nickname;
        this.date = date;
        this.detail = detail;
        this.selection_id = selection_id;
        this.reply = reply;
    }
}
