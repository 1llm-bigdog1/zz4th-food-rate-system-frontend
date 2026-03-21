/**
 * 文件说明：Suggestion.js
 * 1. 这个脚本定义数据模型或文案常量，用于统一业务对象结构与全站显示文本。
 * 2. 该文件位于 src\models 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，应尽量保持字段命名、默认值和导出方式一致，方便全项目复用。
 */
export default class Suggestion {
    constructor(id, user_id, date, comment, like = 0, follow_comments = []) {
        this.id = id;
        this.user_id = user_id;
        this.date = date;
        this.comment = comment;
        this.like = like;
        this.follow_comments = follow_comments;
    }
}
