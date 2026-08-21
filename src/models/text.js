/**
 * 文件说明：text.js
 * 1. 这个脚本定义数据模型或文案常量，用于统一业务对象结构与全站显示文本。
 * 2. 该文件位于 src\models 目录下，是当前模块的重要基础脚本之一。
 * 3. 维护这类文件时，应尽量保持字段命名、默认值和导出方式一致，方便全项目复用。
 */
export const sharedText = {
    floor: '\u697c',
    window: '\u53f7\u7a97\u53e3',
    selectFloor: '\u9009\u62e9\u697c\u5c42',
    selectWindow: '\u9009\u62e9\u7a97\u53e3',
    inputPrice: '\u8bf7\u8f93\u5165\u4ef7\u683c',
    submitRating: '\u63d0\u4ea4\u8bc4\u5206',
    submitModify: '\u63d0\u4ea4\u4fee\u6539',
    uploadImage: '\u4e0a\u4f20\u56fe\u7247',
    uploadButton: '\u70b9\u51fb\u4e0a\u4f20',
    modifyPosition: '\u4f4d\u7f6e\u4fee\u6539',
    modifyPrice: '\u4ef7\u683c',
    priceLabel: '\u4ef7\u683c',
    priceSuffix: '\u5143',
    priceWithUnit: '\u4ef7\u683c(\u5143)',
    rate: '\u8bc4\u5206',
    rank: '\u6392\u540d',
    dishName: '\u83dc\u54c1\u540d\u79f0',
    dishPosition: '\u83dc\u54c1\u4f4d\u7f6e',
    action: '\u64cd\u4f5c',
    viewImage: '\u67e5\u770b\u56fe\u7247',
    loadMore: '\u52a0\u8f7d\u66f4\u591a',
};

export const basicLayoutText = {
    schoolName: '\u90d1\u5dde\u5e02\u7b2c\u56db\u9ad8\u7ea7\u4e2d\u5b66',
    systemName: '\u90d1\u5dde\u5e02\u7b2c\u56db\u9ad8\u7ea7\u4e2d\u5b66\u83dc\u54c1\u8bc4\u5206\u7cfb\u7edf',
    privacyPolicy: '\u9690\u79c1\u653f\u7b56',
    termsOfService: '\u670d\u52a1\u6761\u6b3e',
    contactUs: '\u8054\u7cfb\u6211\u4eec',
    disclaimerLine1: '\u6b64\u7cfb\u7edf\u975e\u5b66\u6821\u5b98\u65b9\u5f00\u53d1',
    disclaimerLine2: '\u7531\u5b66\u751f\u5f00\u53d1\uff0c\u4ec5\u4f9b\u53c2\u8003',
    backToTop: 'UP',
};

export const globalHeaderText = {
    brandTitle: '\u90d1\u5dde\u5e02\u7b2c\u56db\u9ad8\u7ea7\u4e2d\u5b66\u83dc\u54c1\u8bc4\u5206\u7cfb\u7edf',
    dishOverview: '\u83dc\u54c1\u8bc4\u5206',
    rating: '\u6211\u8981\u8bc4\u5206',
    rank: '\u8bc4\u5206\u6392\u884c\u699c',
    sponsor: '\u8d5e\u52a9\u6211\u4eec',
    selection: '\u8001\u5403\u5bb6\u4e25\u9009',
    newSuggestion: '\u65b0\u54c1\u5efa\u8bae',
    canteenFeedback: '\u98df\u5802\u610f\u89c1',
    dishManage: '\u7ba1\u7406\u5458\u901a\u9053',
};

export const homePageText = {
    overviewTitle: '\u83dc\u54c1\u603b\u89c8',
    detail: '\u67e5\u770b\u8be6\u60c5',
    moreDishes: '\u67e5\u770b\u66f4\u591a\u83dc\u54c1',
    dailyRank: '\u6bcf\u65e5\u6392\u540d',
    more: '\u67e5\u770b\u66f4\u591a',
};

export const dishesListText = {
    pageTitle: '\u83dc\u54c1\u8bc4\u5206',
    addData: '\u8865\u5145\u4fe1\u606f',
    rateNow: '\u6211\u8981\u8bc4\u5206',
    rateTitlePrefix: '\u5bf9',
    rateTitleSuffix: '\u8fdb\u884c\u8bc4\u5206',
    modifyTitleSuffix: '\u8fdb\u884c\u4fe1\u606f\u4fee\u6539',
    uploadBtn: '\u70b9\u51fb\u4e0a\u4f20',
    modifySuccess: '\u611f\u8c22\u4f60\u7684\u8d21\u732e\uff0c\u4fee\u6539\u540e\u7684\u6570\u636e\u4f1a\u5728\u5ba1\u6838\u540e\u663e\u793a',
};

export const ratingDetailText = {
    standardTitle: '\u6807\u51c6\u6392\u540d',
    weightedTitle: '\u52a0\u6743\u6392\u540d',
    rate: '\u53e3\u5473\u8bc4\u5206',
    weightedScore: '\u7efc\u5408\u8bc4\u5206',
    priceFocus: '\u4fa7\u91cd\u4ef7\u683c',
    tasteFocus: '\u4fa7\u91cd\u53e3\u5473',
};

export const selectionListText = {
    pageTitle: '\u8001\u5403\u5bb6\u4e25\u9009',
    listSubtitle: '\u50cf\u8bc4\u8bba\u533a\u4e00\u6837\u6d4f\u89c8\u5927\u5bb6\u7684\u63a8\u8350\u4e0e\u8bc4\u5206',
    contributeTitle: '\u6211\u8981\u5206\u4eab',
    contributeSubtitle: '\u53d1\u5e03\u4f60\u7684\u63a8\u8350\u3001\u4ef7\u683c\u548c\u8d2d\u4e70\u4f4d\u7f6e',
    reply: '\u56de\u590d',
    rateAction: '\u8bc4\u5206',
    submit: '\u63d0\u4ea4',
    rateTitlePrefix: '\u5bf9',
    rateTitleSuffix: '\u8fdb\u884c\u8bc4\u5206',
    commentTitle: '\u8bc4\u8bba\u5185\u5bb9',
    commentPlaceholder: '\u8bf7\u8f93\u5165\u8bc4\u8bba\u5185\u5bb9',
    priceTitle: '\u4ef7\u683c',
    pricePlaceholder: '\u8bf7\u8f93\u5165\u4ef7\u683c',
    selectPosition: '\u9009\u62e9\u4f4d\u7f6e',
    floorPlaceholder: '\u9009\u62e9\u697c\u5c42',
    windowPlaceholder: '\u9009\u62e9\u7a97\u53e3',
    submitSuccess: '\u611f\u8c22\u4f60\u7684\u8d21\u732e\uff0c\u63d0\u4ea4\u540e\u7684\u6570\u636e\u4f1a\u5728\u5ba1\u6838\u540e\u663e\u793a',
    submitWarning: '\u8bf7\u5b8c\u6574\u586b\u5199\u8bc4\u8bba\u3001\u4ef7\u683c\u548c\u81f3\u5c11\u4e00\u4e2a\u8d2d\u4e70\u4f4d\u7f6e',
    pricePrefix: '\u4ef7\u683c\uff1a',
    purchasePrefix: '\u8d2d\u4e70\u4f4d\u7f6e',
    yuanSymbol: '\u00a5',
    myUserName: '\u6211',
};

export const ratingModalText = {
    submitText: '\u63d0\u4ea4\u8bc4\u5206',
};

export const supplementInfoModalText = {
    uploadImageText: '\u4e0a\u4f20\u56fe\u7247',
    uploadBtnText: '\u70b9\u51fb\u4e0a\u4f20',
    modifyPositionText: '\u4f4d\u7f6e\u4fee\u6539',
    modifyPriceText: '\u4ef7\u683c',
    floorPlaceholder: '\u9009\u62e9\u697c\u5c42',
    windowPlaceholder: '\u9009\u62e9\u7a97\u53e3',
    pricePlaceholder: '\u8bf7\u8f93\u5165\u4ef7\u683c',
    submitText: '\u63d0\u4ea4\u4fee\u6539',
};
