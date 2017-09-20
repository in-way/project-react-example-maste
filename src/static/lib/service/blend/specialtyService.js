/** 
* 高校管理 - 专业信息服务 
* specialtyService - 1414 
*/
"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(["eos"],factory);
    } else {
        factory(eos);
    }
}(function (eos) {

    var APP_ID = "college",SERVICE_ID = "specialtyService";

    eos.registerService(APP_ID,SERVICE_ID)
        .registerMethod("delSpecialty","1.0",["specId"])
        .registerMethod("saveSpecialty","1.0",["reqData"])
        .registerMethod("specialtyData","1.0",["collegeId","facultyId"]);

    return eos[APP_ID][SERVICE_ID];
}));