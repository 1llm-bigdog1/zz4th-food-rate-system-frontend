export default class Advice {
    constructor(id, user_id, date, comment, like = 0,follow_comments = []) {
        this.id = id;
        this.user_id = user_id;
        this.date = date;
        this.comment = comment;
        this.like = like;
        this.follow_comments = follow_comments;
    }
}