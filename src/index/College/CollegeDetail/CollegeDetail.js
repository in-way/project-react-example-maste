// 引入样式文件
import './CollegeDetail.scss';
// 引入react基础依赖
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link,withRouter } from 'react-router-dom';

// 引入地图组件
import Map from '../../../map/'
// 引入局部组件
import InfoPane from './components/InfoPane'
// 引入服务依赖
import '../../../static/lib/eos3/eos3.min';
import '../../../static/lib/service/auth/zeus.auth';
import '../../../static/lib/service/auth/all';
import '../../../static/lib/service/blend/collegeService';
// 引入ulynlist插件
import 'art-template';
import '@share/ulynlist/ulynlist';
import '@share/ulynlist/ulynlist.table';
import '@share/ulynlist/ulynlist.pagebar';
import '@share/ulynlist-ext';
// 引入解析url字符串方法
import {getQueryString} from '../../../utils';
// 引入shareUI组件
import {
    Panel,
    FormSearch,
    FormControl,
    Select,
    Button,
    Icon,
    FormItem,
    ButtonToolBar,
    Label
} from '@share/shareui';
// 引入默认图片
const defaultPic = require('../../../static/image/ico_default_sc.png');

class CollegeDetail extends Component{

    constructor(props) {
        super(props);
        // 引入路由location参数
        let { location } = props;
        // 初始化状态
        this.state = {
            collegeLogo:defaultPic,
            collegeName:"",
            collegeType:"",
            collegeAddress:"",
            academyNum:0,
            majorNum:0,
            studentNum:0
        };
        // 解析url,获取参数
        this.orgCode = getQueryString(location, 'orgCode');
        this.collegeId = getQueryString(location, 'collegeId');
    }
    // 生命周期 组件挂载之前
    componentWillMount() {
        this.getCollegeInfo();
    }
    // 生命周期 组件挂载完成
    componentDidMount(){
        this.renderMajorTable();
    }
    // 获取学院信息
    getCollegeInfo(){
        eos.college.collegeService.collegeDetail(this.orgCode,this.collegeId,data => {
            let collegeInfo = data.data || {};
            console.info("collegeInfo:",collegeInfo);
            this.collegeId = collegeInfo.id;
            this.setState({
                collegeLogo:collegeInfo.iconUrl,
                collegeName:collegeInfo.name,
                collegeType:collegeInfo.type,
                collegeAddress:collegeInfo.address,
                academyNum:collegeInfo.facNum,
                majorNum:collegeInfo.specNum,
                studentNum:collegeInfo.stuNum,
                mapInfo: [{
                    "id" : collegeInfo.bzmid,
                    "name" : collegeInfo.name
                }]
            })
        });
    }
    // 渲染表格
    renderMajorTable(){
        let opts = {
            basePath: "node_modules/@share/ulynlist-ext",
            tableTpl:"share",
            tableColumn:{
                title:'ulynlist',
                keyColumn:"",
                columns:[
                    {field:'faculty', label:'学院/系', overflowview:'normal', className:"unSortable", width:"200px"},
                    {field:'list', label:'专业', overflowview:'normal', className:"unSortable",
                        tableTransFunc: function(value, item){
                            let str = '';
                            item.list.map(major => {
                                str += `<span class="label-border label label-default item-major">${major.specialty}</span>`;
                            });
                            return `<span class="item-pane">${str}</span>`;
                        }}
                ],
                rownumbers:true,
                setRowColor: (data) => {}
            },
            afterTableRender: () => {},
            //请求数据传递的参数
            requestData:{},
            customAjax: (requestData, callback) => {
                eos.college.collegeService.findCollegeSpecialty(this.collegeId,this.orgCode, data => {
                    let tmpData = {
                        ...data,
                        data: {
                            currentPage: 1,
                            linesPerPage: 1000,
                            totalNum: data.data.length,
                            totalPage: Math.floor(data.data.length / 1000),
                            list: [
                                ...data.data
                            ]
                        }
                    };
                    callback(tmpData);
                });
            },
            extra:{
                linesPerPageEditable: true,
                tableSize: '',/*默认值为default，配置值支持sm*/
                lineStyle: 'lineSpace'/*默认值为default，配置值支持 lineSpace(各行变色)*/
            }
        };
        $("#js-table").ulynlist(opts);
    }
    // 渲染jsx
    render(){
        let { history } = this.props;
        return (
            <div className="ui-box">
                <Panel>
                    <Panel.Body>
                        <div className="college-pane clearfix">
                            <div className="info-pane">
                                <InfoPane {...this.state} defaultPic={defaultPic} collegeId={this.collegeId}/>
                            </div>
                            <div className="map-pane">
                                <Map className="noToolBar noToggleMap noZoomSlider"
                                     mapAction = {[
                                         {
                                             type: "showPolygon",
                                             data: {
                                                 source:this.state.mapInfo
                                             },
                                             focus: true
                                         }
                                     ]}
                                />
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
                <Panel bsStyle="primary">
                    <Panel.Head title="院系和专业">
                    </Panel.Head>
                    <Panel.Body full>
                        <div className="tabContent">
                            <div className='tabItem'>
                                <div id="js-table"/>
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
                <ButtonToolBar>
                    <Button type="button" bsStyle="primary" onClick={(e) => {
                        history.push(`/college/edit/${this.collegeId}`);
                    }}>编辑</Button>
                    <Button type="button" onClick={(e) => {
                        history.goBack();
                    }}>返回</Button>
                </ButtonToolBar>
            </div>
        );
    }
}

export default withRouter(CollegeDetail);