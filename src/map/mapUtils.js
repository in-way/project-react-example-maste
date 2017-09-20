/**
 * Created by Administrator on 2017/8/24.
 */


import MapConfig from './mapConfig'


// 共用方法
const info = console.info;
const error = console.error;
const warn = console.warn;

export const setLayerRender = function(borderColor, borderWidth, bgColor) {
    return {
        "type": "simple",
        "label": "",
        "description": "",
        "symbol": {
            "type": "esriSFS",
            "style": "esriSFSSolid",
            "color": bgColor,
            "outline": {
                "type": "esriSLS",
                "style": "esriSLSSolid",
                "color": borderColor,
                "width": borderWidth
            }
        }
    }
};
export const isArray = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};
export const getQueryString = function(location, name) {
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if (location.search.indexOf("?") == -1 || location.search.indexOf(name + '=') == -1) {
        return '';
    }

    // 获取链接中参数部分
    var queryString = location.search.substring(location.search.indexOf("?") + 1);
    queryString = queryString.replace(/#.*$/, '');
    // 分离参数对 ?key=value&key2=value2
    var parameters = queryString.split("&");

    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        // 获取等号位置
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }

        // 获取name 和 value
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
        if (paraName == name) {
            return decodeURIComponent(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
};
export const loadCss = function(url) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = url;
    $('head').append(css);
};
export const TempLayer = function(layerName, renderOpt) {
    const borderColor = renderOpt.borderColor || [94, 64, 37, 255],
        borderWidth = renderOpt.borderWidth || 2,
        bgColor = renderOpt.bgColor || [252, 157, 154, 0];
    return new SkySeaMap.GraphicsLayer({
        layerId: layerName,
        opacity: 100,
        index: 5,
        renderer: renderOpt ? setLayerRender(borderColor, borderWidth, bgColor) : ''
    });
};
let map = {};


// 面
export const renderPolygon = function(opt,map1) {

    // todo 判断基本图层是否存在
    map = map1;

    let polygonLayer = map.layerList.polygonLayer,
        labelLayer = map.layerList.labelLayer,
        featureLayer = map.layerList.featureLayer;

    let dataIn = opt.data,
        idArray = [],
        idMap = dataIn.map ?  dataIn.map.id : "id",
        nameMap = dataIn.map ?  dataIn.map.name : "name",
        focus = opt.focus,
        styleArray = opt.style,
        style,
        alias = opt.alias;



    // 删除当前临时层的要素
    polygonLayer && polygonLayer.clear();
    labelLayer && labelLayer.clear();

    // 删除高亮以及indowindow
    map.clearScreen();

    if(!(dataIn && dataIn.source && dataIn.source.length>0)) return warn("暂无数据");

    // 初始化 graphicCache
    if(alias){
        map.graphicCache[alias] = [];
    }

    dataIn.source.map((v,i)=>{
        v[idMap] && idArray.push(v[idMap])
    });


    if(!idArray.length>0){
        return
    }

    $("#bgbg,#ss_loading").show();

    map.queryFeature({
        layerId: featureLayer,
        filterByIds: idArray
    }, function (result) {
        info(result)
        if (result.status === 'success' && result.result.length>0) {
            result.result.map((v,i)=>{
                let graphic = v,
                    name,
                    attributes,
                    polygon;

                dataIn.source.map((v,i)=>{
                    if (String(graphic.attributes.OBJECTID) === String(v[idMap])) {
                        name = v[nameMap];
                        attributes = v;
                        // todo 新增中断
                    }
                });

                if(styleArray && styleArray.length > 0){
                    style = styleArray[i%styleArray.length]
                }else{
                    styleArray = [
                        {
                            borderColor: [0, 204, 238, 255],
                            borderWidth: 2,
                            bgColor: [0, 204, 238, 80]
                        },
                        {
                            borderColor: [0, 187, 136, 255],
                            borderWidth: 2,
                            bgColor: [0, 187, 136, 80]
                        },
                        {
                            borderColor: [255, 102, 85, 255],
                            borderWidth: 2,
                            bgColor: [255, 102, 85, 80]
                        }
                    ];
                    style = styleArray[i%styleArray.length]
                    // info("123",style)
                }

                polygon = createGraphic(
                    Object.assign(opt,{
                        geometry: graphic.geometry,
                        attributes: attributes,
                        name: name,
                        style: style
                    })
                );

                polygonLayer.add(polygon.grap);
                polygon.textGrap && labelLayer.add(polygon.textGrap);

                $("#bgbg,#ss_loading").hide();

                if(alias){
                    map.graphicCache[alias].push({
                        grap: polygon.grap,
                        textGrap: polygon.textGrap
                    })
                }

                // 定位
                if (focus) {
                    centerAtPolygon(graphic);
                    focus = !focus;
                }
            });
        }
        else if(result.status === 'success' && result.result.length ===0){
            error("要素查询结果为0")
            $("#bgbg,#ss_loading").hide();
        }
        else {
            error("要素查询失败");
            $("#bgbg,#ss_loading").hide();
        }
    });

    // 注册事件
    registerEvent()
};

// 点
export const renderPoint = function(opt,map1){

    map = map1;

    const pointLayer = map.layerList.pointLayer,
          data = opt.data,
          xMap = data.map ? data.map.x : "x",
          yMap = data.map ? data.map.y : "y",
          alias = opt.alias;

    // pointLayer && pointLayer.clear();
    map.clearScreen();
    if(!(data && data.source && data.source.length>0)) return warn("暂无数据");

    if(alias){
        map.graphicCache[alias] = [];
    }

    data.source.map((v,i)=>{
        const x = v[xMap],
              y = v[yMap],
              grap = createGraphic(
                  Object.assign({
                      x : x,
                      y : y,
                      attributes : v
                  },opt)
              ).grap;

        if(alias){
            map.graphicCache[alias].push(grap)
        }
        pointLayer.add(grap)
    });

    registerEvent()
};

// 创建图形
export const createGraphic = function(opt){
    let x = opt.x,
        y = opt.y,
        geometry = opt.geometry,
        attributes = opt.attributes,
        style = opt.style,
        name = opt.name,
        tip_mouseOver = opt.tip_mouseOver,
        tip_mouseClick = opt.tip_mouseClick,
        autoCloseTip = opt.autoCloseTip,
        mouseOver = opt.mouseOver,
        mouseOut = opt.mouseOut,
        bindEvents = opt.bindEvents,
        mouseClick = opt.mouseClick;

    let grap,
        textGrap,
        grapGeometry,
        grapStyle;

    // 设置默认样式
    if( x && y ){
        if(!style){
            style = {
                img : "point",width : 20,height : 24,
                xoffset : 0,yoffset : 12
            };
        }
        grapGeometry = {"x": x, "y": y, "type": "point"};
        grapStyle = {
            "type" : "esriPMS",
            "url" : require("./"+ style.img +".png"),
            "contentType" : "image/png",
            "width" : style.width,
            "height" : style.height,
            "angle" : 0,
            "xoffset" : style.xoffset,
            "yoffset" : style.yoffset
        };
    }else if(geometry && geometry.type === 'polygon'){
        if(!style){
            style = {
                borderColor: [94, 64, 37, 255],
                borderWidth: 2,
                bgColor: [252, 157, 154, 0]
            };
        }
        grapStyle = {
            "type": "esriSFS",
            "style": "esriSFSSolid",
            "color": style.bgColor,
            "outline": {
                "type": "esriSLS",
                "style": "esriSLSSolid",
                "color": style.borderColor,
                "width": style.borderWidth
            }
        };
        grapGeometry = geometry
    }else if(geometry && geometry.type === 'polyline'){
        // todo 线
    }

    // 注入属性
    attributes.mouseOver = mouseOver;
    attributes.mouseOut = mouseOut;
    attributes.mouseClick = mouseClick;
    attributes.tip_mouseOver = tip_mouseOver;
    attributes.tip_mouseClick = tip_mouseClick;
    attributes.autoCloseTip = autoCloseTip;
    attributes.bindEvents = bindEvents;

    // 创建图形对象
    grap = new SkySeaMap.Graphic(
        grapGeometry,
        grapStyle,
        attributes,
        ''
    );

    // 设置面的文字
    if (name) {
        textGrap = new SkySeaMap.Graphic(geometry);
        textGrap.setSymbol({
            "type": "esriTS",
            "color": [66, 66, 66, 255],
            "verticalAlignment": "middle",
            "horizontalAlignment": "center",
            "text": name,
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "font": {
                "family": "Arial",
                "size": 12,
                "style": "normal",
                "weight": "bold",
                "decoration": "none"
            }
        });
    }

    return {
        grap: grap,
        textGrap: textGrap
    };
};
// 定位点
export const centerAtPoint = function(x,y,level){
    level = level ? level : 13;
    map.location({
        center: {
            x: x,
            y: y
        },
        zoom: level,
        isHighLight: false
    }, function (result) {
    });
};
// 定位面
export const centerAtPolygon = function(graphic, level) {
    level = level ? level : 15;
    var a = graphic.geometry.getCentroid();
    map.location({
        center: {
            x: a.x,
            y: a.y
        },
        zoom: level,
        isHighLight: false
    }, function (result) {
    });
};
// 通过 id 定位面
export const centerAtGraphicById = function(id, featureLayer, level) {
    if (!id) {
        console.error("定位用的id不存在");
        return;
    }
    level = level ? level : 13;
    map.queryFeature({
        layerId: featureLayer,
        filterByIds: [id],
        isHighLight: false
    }, function (result) {
        if (result.status === 'success') {
            var a = result.result[0].geometry.getCentroid();
            map.location({
                center: {
                    x: a.x,
                    y: a.y
                },
                zoom: level,
                isHighLight: false
            }, function (result) {
            });
        } else {
            console.error("定位用的id 查询失败")
        }
    });
};
// 显示隐藏 infoWindow
export const showInfoWindow = function(graphic,infoTemplate){
    // infoWindow.setFeatures([graphic]);
    const infoWindow = getInfoWindow();
    // infoWindow.setTitle();
    infoWindow.setContent(infoTemplate);
    // todo 这里要对geometry进行判断 mapPoint
    if(graphic.geometry.type==='polygon'){
        let a = graphic.geometry.getCentroid();
        infoWindow.show(a)
    }else{
        infoWindow.show(graphic.geometry);
    }


};
export const hideInfoWindow = function(graphic,infoTemplate){
    // infoWindow.setFeatures([graphic]);
    const infoWindow = getInfoWindow();
    // infoWindow.setTitle();
    infoWindow.hide()
};

// 单例
function singleton( fn ){
    let result;
    let ret = function(){
        return result || ( result = fn .apply( this, arguments ) );
    };
    ret.destory = function(){
        result = null;
    };
    return ret
}
export const getInfoWindow = singleton(function(){
    return map.getInfoWindow()
});
export const registerEvent = singleton(function(){
    let layerArray = [
        'pointLayer',
        'polygonLayer'
    ];
    layerArray.map((v,i)=>{
        map.layerList[v].onMouseOver(function(e){
            const graphic = e.graphic,
                  attributes = graphic.attributes,
                  bindEvents = attributes.bindEvents;
            // info(e)
            if(attributes && attributes.tip_mouseOver){
                showInfoWindow(graphic,attributes.tip_mouseOver(attributes));
                bindEvents && bindEvents();
            }
            if(attributes && attributes.mouseOver){
                attributes.mouseOver(e)
            }
        });
        map.layerList[v].onMouseOut(function(e){
            const graphic = e.graphic,
                attributes = graphic.attributes;
            // info(e)
            if(attributes && attributes.autoCloseTip){
                hideInfoWindow();
            }
            if(attributes && attributes.mouseOut){
                attributes.mouseOut(e)
            }
        });
        map.layerList[v].onClick(function(e){
            const graphic = e.graphic,
                attributes = graphic.attributes,
                bindEvents = attributes.bindEvents;
            // info(e)
            if(attributes && attributes.tip_mouseClick){
                showInfoWindow(graphic,attributes.tip_mouseClick(attributes))
                bindEvents && bindEvents();
            }
            if(attributes && attributes.mouseClick){
                attributes.mouseClick(e)
            }
        });
    });
    return true;
});