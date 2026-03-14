export default class Advice_Comment {
    constructor(id, user_id, date, advice_id, reply, parent_id = null,likes = 0) {
        this.id = id;
        this.user_id = user_id;
        this.date = date;
        this.advice_id = advice_id;
        this.parent_id = parent_id;
        this.likes = likes;
        this.reply = reply;
    }
}