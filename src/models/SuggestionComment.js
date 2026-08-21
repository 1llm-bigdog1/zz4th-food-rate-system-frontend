/**
 * 文件说明：SuggestionComment.js
 * 1. 这个脚本定义数据模型或文案常量，用于统一业务对象结构与全站显示文本。
 * 2. 该文件位于 src\models 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，应尽量保持字段命名、默认值和导出方式一致，方便全项目复用。
 */
export default class Suggestion_Comment {
    constructor(id, user_id, date, suggestion_id, reply, parent_id = null, likes = 0, liked = false, nickname = '') {
        this.id = id;
        this.user_id = user_id;
        this.nickname = nickname;
        this.date = date;
        this.suggestion_id = suggestion_id;
        this.parent_id = parent_id;
        this.likes = likes;
        this.reply = reply;
        this.liked = liked;
    }
}
