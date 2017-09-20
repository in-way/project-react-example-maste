/** 
* 高校管理 - 学生信息服务 
* studentService - 1423 
*/
"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(["eos"],factory);
    } else {
        factory(eos);
    }
}(function (eos) {

    var APP_ID = "college",SERVICE_ID = "studentService";

    eos.registerService(APP_ID,SERVICE_ID)
        .registerMethod("findStudent","1.0",["studentId"])
        .registerMethod("delStudent","1.0",["studentId"])
        .registerMethod("saveStudent","1.0",["reqData"])
        .registerMethod("studentData","1.3",["reqData"]);

    return eos[APP_ID][SERVICE_ID];
}));