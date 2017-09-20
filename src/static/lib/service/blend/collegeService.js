/** 
* 高校管理 - 高校服务 
* collegeService - 1435 
*/
"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(["eos"],factory);
    } else {
        factory(eos);
    }
}(function (eos) {

    var APP_ID = "college",SERVICE_ID = "collegeService";

    eos.registerService(APP_ID,SERVICE_ID)
        .registerMethod("findCollegeSpecialty","1.3",["collegeId","orgCode"])
        .registerMethod("findCollegeFaculty","1.0",["collegeId"])
        .registerMethod("saveCollege","1.1",["reqData"])
        .registerMethod("colleges","1.1",[])
        .registerMethod("collegeData","1.2",["map"])
        .registerMethod("collegeDetail","1.0",["orgCode","collegeId"]);

    return eos[APP_ID][SERVICE_ID];
}));