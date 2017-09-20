/** 
* 基础 - 地址辅助服务类 
* addressAssistService - 1424 
*/
"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(["eos"],factory);
    } else {
        factory(eos);
    }
}(function (eos) {

    var APP_ID = "building",SERVICE_ID = "addressAssistService";

    eos.registerService(APP_ID,SERVICE_ID)
        .registerMethod("getDataList","1.0",["level","key","item"]);

    return eos[APP_ID][SERVICE_ID];
}));