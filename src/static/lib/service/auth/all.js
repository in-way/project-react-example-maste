/** 
* auth - 认证中心 
* 20160413203956 
*/
"use strict";
(function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory(eos);
    }else if (typeof define === 'function' && define.amd) {
        define(["eos"],factory);
    } else {
        factory(eos);
    }
}(function (eos) {

    var APP_ID = "auth";

    eos.registerService(APP_ID,"appManage")
        .registerMethod("changeModPosition","1.0",["currentModId","parentModId","childModIds"])
        .registerMethod("getApp","1.0",["appId"])
        .registerMethod("saveApp","1.0",["app"])
        .registerMethod("saveModuleCtrl","1.0",["moduleCtrl"])
        .registerMethod("getRefModules","1.1",[])
        .registerMethod("saveAppModule","1.0",["appModule"])
        .registerMethod("deleteAppModules","1.0",["modIds"])
        .registerMethod("getApps","1.0",["con"])
        .registerMethod("getRefPlugin","1.0",["modId","pluginType","appId"])
        .registerMethod("getModuleCtrl","1.0",["modCtrlId"])
        .registerMethod("deleteModuleCtrl","1.0",["modCtrlIds"])
        .registerMethod("deleteApps","1.0",["appIds"])
        .registerMethod("enableApps","1.0",["modCtrlOpe"])
        .registerMethod("getAppModule","1.0",["modId"]);

    eos.registerService(APP_ID,"appGroup")
        .registerMethod("getAppGroups","1.0",[])
        .registerMethod("deleteAppGroups","1.0",["groupIds"])
        .registerMethod("saveAppGroup","1.0",["appGroup"])
        .registerMethod("getAppGroup","1.0",["groupId"]);

    eos.registerService(APP_ID,"authRole")
        .registerMethod("authenticated","1.0",["appId","modKey","authKey"])
        .registerMethod("saveRole","1.0",["role"])
        .registerMethod("getRole","1.1",["roleId"])
        .registerMethod("getRoleList","1.0",["con"])
        .registerMethod("getUserCtrls","1.0",["userId"])
        .registerMethod("deleteRoles","1.0",["roleIds"])
        .registerMethod("getRolesByCtrlId","1.0",["modCtrlId"]);

    eos.registerService(APP_ID,"userManage")
        .registerMethod("getUserByMzXzqh","1.0",["mzXzqh"])
        .registerMethod("getUser","1.0",["userId"])
        .registerMethod("resetPsw","1.0",["oldPsw","newPsw"])
        .registerMethod("deleteUsers","1.0",["userIds"])
        .registerMethod("login","1.0",["userName","password"])
        .registerMethod("deleteDeptUserRoles","1.0",["deptUserRoleIds"])
        .registerMethod("setUserRole","1.0",["userRoles"])
        .registerMethod("getWg","1.0",["sqxzqh"])
        .registerMethod("getUserByJsXzqh","1.0",["jsXzqh"])
        .registerMethod("saveUser","1.0",["user"])
        .registerMethod("saveDeptUserRole","1.0",["deptUserRole"]);

    eos.registerService(APP_ID,"commonService")
        .registerMethod("getUlynList","1.0",["reqData"])
        .registerMethod("queryXzqhChildren","1.0",["xzqh"]);

    eos.registerService(APP_ID,"dmService")
        .registerMethod("getAllTables","1.0",[])
        .registerMethod("getAllData2Map","1.0",["dmName"])
        .registerMethod("getAllData","1.0",["dmName"])
        .registerMethod("getMultiLabelByKeyListMap","1.0",["keys","keyColumn"])
        .registerMethod("getMultiLabelByKeyList","1.0",["dmName","keys"])
        .registerMethod("getLabelByKey","1.0",["dmName","key"])
        .registerMethod("getMultiLabels","1.0",["dmName","keys"])
        .registerMethod("refreshBM","1.0",[])
        .registerMethod("loadData","1.0",[]);

    eos.registerService(APP_ID,"xzqhService")
        .registerMethod("getParentXzqh","1.0",["xzqh"])
        .registerMethod("getDzXzq","1.0",["xzqhs"])
        .registerMethod("getDeptTree","1.0",["baseXzqh"])
        .registerMethod("getXzqh","1.0",["baseXzqh","level"])
        .registerMethod("getXzqhIgnoreLoginUser","1.0",["baseXzqh","level"])
        .registerMethod("getXzqhDeptTree","1.0",["baseXzqh"])
        .registerMethod("getXzqhName","1.0",["xzqh"])
        .registerMethod("formatXzqh","1.0",["xzqh"])
        .registerMethod("getDzXzqWg","1.0",["xzqh"]);

    eos.registerService(APP_ID,"userAppMenus")
        .registerMethod("getFavorableApps","1.1",[])
        .registerMethod("getBusinessApps","1.2",[])
        .registerMethod("setFavorableApps","1.0",["appIds"])
        .registerMethod("getAppMenu","1.2",["appId"])
        .registerMethod("getAppGroup","1.3",["favMenuFlag"]);

    eos.registerService(APP_ID,"xzqhQgService")
        .registerMethod("getXzqh","1.0",["baseXzqh","level"]);

    eos.registerService(APP_ID,"pluginManage")
        .registerMethod("getPlugin","1.0",["pluginId"])
        .registerMethod("savePlugin","1.0",["plugin"])
        .registerMethod("deletePlugin","1.0",["pluginId"]);

    eos.registerService(APP_ID,"todoService")
        .registerMethod("loadConfig","1.0",["configId"])
        .registerMethod("saveOrUpdateAppInfo","1.0",["appData"])
        .registerMethod("saveOrUpdate","1.0",["todoConfig"])
        .registerMethod("getToDoApp","1.0",["appId"]);

    eos.registerService(APP_ID,"deptService")
        .registerMethod("getDept","1.0",["deptIds"]);

    eos.registerService(APP_ID,"statItemService")
        .registerMethod("getCurUserStatItem","1.0",[])
        .registerMethod("getStatItem","1.0",["statItemId"])
        .registerMethod("bindStatItemRole","1.0",["roleName","statItemList"])
        .registerMethod("deleteStatItem","1.0",["statItemId"])
        .registerMethod("saveStatItem","1.0",["reqData"])
        .registerMethod("getStatItems","1.0",["appId","modId","roleName"])
        .registerMethod("saveStatItemList","1.0",["list"]);

    eos.registerService(APP_ID,"commonListService")
        .registerMethod("getStatItemList","1.0",["reqData"]);

    eos.registerService(APP_ID,"workDateService")
        .registerMethod("getWorkDate","1.1",["beginDate","num"])
        .registerMethod("getWorkDateNum","1.1",["beginDate","endDate"])
        .registerMethod("getWorkDateNumByDay","1.0",["beginDate","endDate"])
        .registerMethod("isWorkDate","1.0",["date"]);

    eos.registerService(APP_ID,"appUserBinder")
        .registerMethod("getModAppAccount","1.0",["modId"])
        .registerMethod("getUserAppAccounts","1.0",[])
        .registerMethod("saveAppUser","1.0",["appUserMap"])
        .registerMethod("clearBindAccount","1.0",["appUserId"]);

    return eos[APP_ID];
}));