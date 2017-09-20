/** 
* 高校管理 - 院系服务 
* facultyService - 1404 
*/
"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(["eos"],factory);
    } else {
        factory(eos);
    }
}(function (eos) {

    var APP_ID = "college",SERVICE_ID = "facultyService";

    eos.registerService(APP_ID,SERVICE_ID)
        .registerMethod("updateFaculty","1.0",["reqData"])
        .registerMethod("addFaculty","1.0",["collegeId","name"]);

    return eos[APP_ID][SERVICE_ID];
}));