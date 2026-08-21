/**
 * 文件说明：User.js
 * 1. 这个脚本定义数据模型或文案常量，用于统一业务对象结构与全站显示文本。
 * 2. 该文件位于 src\models 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，应尽量保持字段命名、默认值和导出方式一致，方便全项目复用。
 */
export default class User {
    constructor(
        id,
        username,
        avatar_path,
        gender,
        session,
        classid,
        nickname,
        realname,
        level,
        register_date,
        rate_time,
        email,
        created_at,
        role,
    ) {
        this.id = id;
        this.username = username;
        this.gender = gender;
        this.session = session;
        this.classid = classid;
        this.nickname = nickname;
        this.realname = realname;
        this.level = level;
        this.register_date = register_date;
        this.rate_time = rate_time;
        this.avatar_path = avatar_path;
        this.email = email;
        this.created_at = created_at || register_date || '';
        this.role = role || 'user';
    }
}
