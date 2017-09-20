/**
 * Created by Administrator on 2017/8/17.
 */
import React, {Component} from 'react';
import './index.scss';
import * as mapUtils from './mapUtils'

const info = console.info;
const error = console.error;

// 有全局的 map
class Map extends Component {

    constructor(props) {
        super(props);
        this.mapListener = this.mapListener.bind(this)
    }

    componentDidMount(){
        const that = this;
        let { mapAction } = this.props;
        this.initMap(function(map){
            that.initLayer(map,function(){
                that.mapListener(function(){
                    mapAction.map((v,i)=>{
                        that.actionJudge(map,v)
                    });
                    // that.actionJudge(map,mapAction)
                });
            })
        })
    }

    shouldComponentUpdate(){
        return false
    }


    componentWillReceiveProps(nextProps, nextState){
        let { mapAction } = this.props;

        nextProps.mapAction.map((v,i)=>{
            if(JSON.stringify(v) !== JSON.stringify(mapAction[i])){
                this.mapListener(() => {
                    this.actionJudge(this.map,v)
                });
            }
        })


        // if(JSON.stringify(nextProps.mapAction) !== JSON.stringify(mapAction)){
        //     this.mapListener(() => {
        //         this.actionJudge(this.map,nextProps.mapAction)
        //     });
        // }
    }

    componentWillUnmount(){
        mapUtils.registerEvent.destory();
        mapUtils.getInfoWindow.destory();
    }

    render() {
        const { className, legend } = this.props;
        let legendStr;
        if(legend){
            legendStr =
                <ul className="mapLegend" key="legend">
                    {
                        legend.data.map((v,i)=>{
                            let img = require('./' + v.img + '.png');
                            return <li key={i}>
                                        <i className="left"
                                           style={{
                                               backgroundImage: (v.img ? 'url(' + img + ')' : ''),
                                               backgroundRepeat: "no-repeat",
                                               backgroundColor: v.color,
                                               backgroundPosition: "center center"
                                           }}
                                        />
                                        <span className="right">{v.text}</span>
                                    </li>
                        })
                    }
                </ul>;
        }

        return (
            <div style={{position: "relative",width :"100%",height : "100%"}}>
                <div id="myMap" className={className} />
                {legend ? legendStr : ''}
            </div>
        )
    }

    // 地图初始化
    initMap(callback){
        const that = this,
            $script = require('scriptjs'),
            jqueryPath = process.env.NODE_ENV === 'production' ?'./static/lib/jquery/jquery.min.js' : require.resolve('jquery');

        $script([jqueryPath, CONTEXT_PATH + '/config'], function () {
            const URL= Config.SkySeaMapServiceURL,
                mapKey= Config.orgMapKey;
            that.featureLayer = Config.orgLayerId;
            that.Config = window.Config;
            mapUtils.loadCss("http://" + URL + "/SkySeaMap/SkySeaMap.css");
            $script("http://" + URL + "/SkySeaMap/arcgis_js_api/init.js", function () {
                $script("http://" + URL + "/SkySeaMap/SkySeaMap.js", function () {
                    const map = new SkySeaMap.Map('myMap');
                    map.initMap(mapKey, function (result) {
                        if (result.status === 'success') {
                            that.map = map;
                            callback(map)
                        } else {
                            error("地图加载失败")
                        }
                    });
                })
            });
        });
    }

    // 图层初始化、图层事件
    initLayer(map,callback){
        const featureLayer = this.featureLayer,
              Config = this.Config;
        map.basemapToggle();
        map.layerFilters({
            layerId: featureLayer,
            filters: "1 != 1"
        }, function (result) {
            map.checkedLayer(featureLayer, function (result) {
                const renderOpt = {
                        borderColor: [94, 64, 37, 255],
                        borderWidth: 2,
                        bgColor: [252, 157, 154, 0]
                    },
                    polygonLayer = mapUtils.TempLayer("polygonLayer", false),
                    labelLayer = mapUtils.TempLayer("labelLayer", false),
                    pointLayer = mapUtils.TempLayer("pointLayer", false);
                map.graphicCache = {};
                map.layerList = {
                    "featureLayer": Config.orgLayerId,
                    "polygonLayer": polygonLayer,
                    "labelLayer": labelLayer,
                    "pointLayer": pointLayer
                };
                callback(map)
            });
        })
    }

    actionJudge(map,mapAction) {
        // if(mapAction.length === 0){return;}
        // mapAction.map((v,i)=>{
        //     map.layerList.labelLayer.clear();
        //     map.layerList.polygonLayer.clear();
        //     map.layerList.pointLayer.clear();
        //     if(!(v.data.source && v.data.source.length>0)){return}
        //     switch (v.type) {
        //         case 'showPolygon':
        //             mapUtils.renderPolygon(v,map);
        //             break;
        //         case 'showPoint':
        //             mapUtils.renderPoint(v,map);
        //             break;
        //         // case 'legend':
        //     }
        // });

        if(!(mapAction.data && mapAction.data.source && mapAction.data.source.length>0)){return}
        switch (mapAction.type) {
            case 'showPolygon':
                mapUtils.renderPolygon(mapAction,map);
                break;
            case 'showPoint':
                mapUtils.renderPoint(mapAction,map);
                break;
            // case 'legend':
        }

    }

    // 监听地图对象
    mapListener( fn , args ){
        const that = this;
        if(this.map && this.map.layerList){
            fn ( args )
        }else{
            setTimeout(function(){
                that.mapListener( fn , args )
            },200)
        }
    }

}

export default Map;