export default class Suggestion_Comment {
    constructor(id, user_id, date, suggestion_id, reply, parent_id = null, likes = 0) {
        this.id = id;
        this.user_id = user_id;
        this.date = date;
        this.suggestion_id = suggestion_id;
        this.parent_id = parent_id;
        this.likes = likes;
        this.reply = reply;
    }
}
