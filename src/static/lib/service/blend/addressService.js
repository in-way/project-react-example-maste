/** 
* 高校管理 - 地址服务 
* addressService - 1436 
*/
"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(["eos"],factory);
    } else {
        factory(eos);
    }
}(function (eos) {

    var APP_ID = "college",SERVICE_ID = "addressService";

    eos.registerService(APP_ID,SERVICE_ID)
        .registerMethod("collegeLdData","1.0",["collegeId"])
        .registerMethod("studentWzData","1.1",["reqData"]);

    return eos[APP_ID][SERVICE_ID];
}));