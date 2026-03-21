/**
 * 文件说明：AdviceComment.js
 * 1. 这个脚本定义数据模型或文案常量，用于统一业务对象结构与全站显示文本。
 * 2. 该文件位于 src\models 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，应尽量保持字段命名、默认值和导出方式一致，方便全项目复用。
 */
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