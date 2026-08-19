/**
 * 静态选项构造器（楼层/窗口号属于前端展示配置，不属于后端数据）。
 */
export const buildFloorOptions = (maxFloor = 2, floorLabel = '\u697c') =>
    Array.from({ length: maxFloor }, (_, i) => i + 1).map((v) => ({
        label: `${v}${floorLabel}`,
        value: v,
    }));

export const buildWindowOptions = (count = 8, windowLabel = '\u53f7\u7a97\u53e3') =>
    Array.from({ length: count }, (_, i) => i + 1).map((v) => ({
        label: `${v}${windowLabel}`,
        value: v,
    }));
