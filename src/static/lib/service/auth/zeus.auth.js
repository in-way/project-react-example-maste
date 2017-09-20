"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"],factory);
    } else {
        // Browser globals
        window.ZeusAuth = factory(jQuery);
    }
}(function ($) {
    if(!$){
        throw new Error("缺少jquery依赖引入");
    }
    function evil(fn) {
        var Fn = Function;  //一个变量指向Function，防止有些前端编译工具报错
        return new Fn('return ' + fn)();
    }
    var ssoServerUrl = "getSSoServerUrl"  //此地址配合后端ssoFilter使用，均可拦截到
        ,cacheUserInfo = {}
        ,isAuthReady = false
        ,authReadyCallbacks = [];
    function login(userId,password,success,error) {
        var self = this;        
        $.ajax( {
            url:ssoServerUrl,
            type:"get"
        }).then(function (data)
            {
                return $.ajax( {
                        url: data.sso_url+"login.do",
                        data:{userId:userId,password:password},
                        type:"post",
                        xhrFields:
                        {
                            withCredentials: true
                        }}
                );
            }
        ).done(function (data)
            {
                if(data.status){
                    cacheUserInfo = data.data;
                    success && success(cacheUserInfo);
                    //alert(data.data.error);
                    initAuthorizer();
                }else{
                    error && error(data.msg);
                }
            }).fail(function(msg){
                error && error(msg);
            });
    }
    function logout(success,error) {        
        $.ajax( {
            url:ssoServerUrl,
            type:"get"
        }).then(function (data)
            {
                return $.ajax( {
                        url: data.sso_url+"logout.do",
                        data:{},
                        type:"post",
                        xhrFields:
                        {
                            withCredentials: true
                        }}
                );
            }
        ).done(function (data)
            {
                if(data.status){
                    cacheUserInfo = {};
                    success && success(data);
                }else{
                    error && error(data.msg);
                }
            }).fail(function(msg){
                error && error(msg);
            });
    }
    function getUserInfo(success,error) {
        var self = this;
        if(!$.isEmptyObject(cacheUserInfo)){
            success(cacheUserInfo);
            return;
        }
        $.ajax( {
            url:ssoServerUrl,
            type:"get"
        }).then(function (data)
            {
                return $.ajax( {
                        url: data.sso_url+"getCurrentUser.do",
                        data:{},
                        type:"get",
                        xhrFields:
                        {
                            withCredentials: true
                        }}
                );
            }
        ).done(function (data)
            {
                 if(data.status){
                     cacheUserInfo = data.data;
                     success(cacheUserInfo);
                 }else{
                     error && error(data.msg);
                 }
            }).fail(function(msg){
                error && error(msg);
            });
    }

    //权限相关的验证对象
    function Authorizer(){}
    Authorizer.prototype.checkExpress = function(express){
        var self = this;
        if(cacheUserInfo && cacheUserInfo.authMap){
            var arr = express.replace(/\(|\)|\|\||&&/g," ").split(" ");
            if(arr.length == 1){
                return this.checkBaseExpress(arr[0]);
            }
            $.each(arr,function(i,baseExpress){
                express = express.replace(baseExpress, self.checkBaseExpress(baseExpress));
            });
            return evil(express);
        }else{
            return false;
        }
    }
    Authorizer.prototype._exist = function(authKey,type){
        if(cacheUserInfo && cacheUserInfo.authMap){
            type = $.trim(type);
            authKey = $.trim(authKey);
            var arr = cacheUserInfo.authMap[type];
            return $.inArray(authKey,arr) != -1;
        }else{
            return false;
        }
    }
    Authorizer.prototype.checkBaseExpress = function(baseExpress){
        if(baseExpress){
            var arr = baseExpress.split(":");
            if(arr.length != 2){
                throw new Error("权限校验表达式有误：" + baseExpress);
            }
            return this._exist(arr[1], arr[0]);
        }
        return true;
    }
    Authorizer.prototype.existApp = function(appId){
        return this._exist(appId,"APP");
    }
    Authorizer.prototype.existModule = function(appId,modKey){
        return this._exist(appId + "-" + modKey,"MOD");
    }
    Authorizer.prototype.existAppCtrl = function(appId,ctrlKey){
        return this._exist(appId + "-" + ctrlKey,"AC");
    }
    Authorizer.prototype.existModuleCtrl = function(appId,modKey,ctrlKey){
        return this._exist(appId + "-" + modKey + "-" + ctrlKey,"MC");
    }
    Authorizer.prototype.checkElement = function(el){
        var domAttr = new DomAttr($(el));
        if(!domAttr.express){
            return true;
        }
        var status = authorizer.checkExpress(domAttr.express);
        if(!status){
            //没有权限，进行处理。
            domAttr.onNotAuthorized();
        }
        return status;
    }
    Authorizer.prototype.recalcAuth = function(){
        var self = this;
        //先校验body,没有权限就返回了
        var bodySelector = $("body[auth-express]");
        if(bodySelector.length >0){
            if(!self.checkElement(bodySelector)){
                bodySelector.attr("auth-body-nopass",true);
                return;
            }
        }
        //若取不到用户，则要权限的全部没有权限
        var selectors = $("[auth-express]");
        if(selectors.length > 0){
            $.each(selectors,function(k,v){
                if(v.isBody){
                    return true;
                }
                self.checkElement(v);
            })
        }
    }
    function DomAttr(selector){
        this.isBody = selector.is("body");
        this.isButton = selector.is("input") || selector.is("a") || selector.is("button");
        this.isDiv = !(selector.is("html") || this.isBody || this.isButton);
        this.selector = selector;
        this.express = selector.attr("auth-express");
        this.display = selector.attr("auth-display") === 'true';
        this.replaceTpl = selector.attr("auth-replaceTpl");
    }
    DomAttr.prototype.onNotAuthorized = function(){
        var selector = this.selector;
        //控制视图
        var displayContent = this.getDisplayContent();
        if(this.isBody){
            selector.html(displayContent);
        }else if(this.isDiv){
            if(displayContent){
                selector.html(displayContent);
            }else{
                selector.hide();
            }
        }else if(this.isButton){
            if(!this.display){
                selector.hide();
            }
            //去除点击事件
            selector.css("cursor", "default");
            if(selector.is("a")){
                selector.attr("href", "javascript:void(0);");
            }
            selector.removeAttr("onclick");
            selector[0].onclick = null;
            selector.unbind("click").bind("click",function(e){
                e.stopPropagation();
                alert("您没有该权限");
//            throw new Error("No operation authority");
                return false;
            });
        }
    }
    DomAttr.prototype.getDisplayContent = function(){
        if(this.replaceTpl){
            return $("#"+this.replaceTpl).html() || this.replaceTpl;
        }else{
            if(this.isBody){
                return "您没有该权限";
            }
            return "";
        }
    }

    var authorizer = new Authorizer();
    function  initAuthorizer(){
        //获取当前用户并缓存，实现后续获取用户是同步地从缓存里面拿
        ZeusAuth.getUserInfo(
            function(data){
                isAuthReady = true;
                $.each(authReadyCallbacks,function(i,callback){
                    callback(authorizer);
                });
                authReadyCallbacks = [];
                //触发DOM节点权限验证
                authorizer.recalcAuth();
            },
            function(){
            //取不到用户
            authorizer.recalcAuth();
        });
    }

    var ZeusAuth = {
        login:login,
        logout:logout,
        getUserInfo:getUserInfo,
        authReady:function(callback){
            if(isAuthReady){
                callback(authorizer);
                return;
            }else{
                authReadyCallbacks.push(callback);
            }
        }
    }

    //执行初始化权限验证的事情
    $(document).ready(function(){
        initAuthorizer();
        timeoutRecalcAuth();
    });
    function timeoutRecalcAuth(){
        ZeusAuth.authReady(function(){
            if($("body").attr("auth-body-nopass")){
                console && console.warn("body验证未通过，停止循环校验权限");
                return;
            }
            authorizer.recalcAuth();
            setTimeout(timeoutRecalcAuth,1000);
        });
    }
    return ZeusAuth;
}));

