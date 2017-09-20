import './CollegeHome.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter,Link } from 'react-router-dom';


import Map from '../../../map/'

import '../../../static/lib/eos3/eos3.min';
import '../../../static/lib/service/auth/zeus.auth';
import '../../../static/lib/service/auth/all';
import '../../../static/lib/service/blend/collegeService';
import '../../../static/lib/service/blend/studentService';
import '../../../static/lib/service/blend/addressService';

import '@share/ulynlist/ulynlist';
import '@share/ulynlist/ulynlist.table';
import '@share/ulynlist/ulynlist.pagebar';
import '@share/ulynlist-ext';
import {getQueryString} from '../../../utils';


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


const defultPic = require('../../../static/image/ico_default_sc.png');

class CollegeDetail extends Component{
    constructor(props) {
        super(props);
        let { location } = props;

        this.state = {
            collegeArray:[],
            collegeId:"",
            orgCode:"",
            collegeLogo:defultPic,
            collegeName:"",
            collegeType:"",
            collegeAddress:"",
            academyNum:0,
            majorNum:0,
            studentNum:0,
            studentCurrentPage:1,
            studentLinesPerPage:10,
        };
    }

    componentDidMount(){
        this.getCollegeArray()
            .then(() => {
                this.refresh();
            })
    }

    componentDidUpdate(prevPros, prevState){
        let { collegeId } = this.state;
        if(collegeId && prevState.collegeId !== collegeId){
            this.refresh();
        }
    }

    refresh(){
        this.getCollegeInfo();
        this.renderMajorTable();
        this.renderStudentTable();
        this.getMapInfo();
    }

    getCollegeInfo(){
        eos.college.collegeService.collegeDetail(this.state.orgCode,this.state.collegeId,data => {
            let collegeInfo = data.data || {};
            console.info("collegeInfo", collegeInfo);
            this.setState({
                collegeLogo:collegeInfo.iconUrl,
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

    getMapInfo(){
        eos.college.addressService.collegeLdData('',data=>{
            if(data.status === '200'){
                let ldArray = [];
                data.data.map((v,i)=>{
                    const name = v.name;
                    v.dzList.map((v,i)=>{
                        v.name = name;
                    });
                    ldArray = ldArray.concat(v.dzList)
                });
                this.setState({
                    "pointData" : ldArray,
                })
            }else{
                console.error("collegeLdData 获取数据失败")
            }
        });
        eos.college.addressService.studentWzData({
            "page": {
                "linesPerPage": '9999999',
                "currentPage": '1'
            },
            "data": {
                "listSql": "studentWzData",
                "collegeId": ""
            }
        }, data =>{
            this.setState({
                "wxpointData" : data.data.list
            })
        });
    }

    getCollegeArray(){
        return new Promise(resolve => {
            eos.college.collegeService.colleges(data => {
                let collegeArray = [];
                data.data.map((item,index)=>{
                    collegeArray.push({
                        id:item.id,
                        text: item.name
                    });
                });
                console.info("collegeName",collegeArray[0].text);
                this.setState({
                    collegeArray:collegeArray,
                    collegeId:collegeArray[0].id,
                    collegeName:collegeArray[0].id
                }, () => {
                    resolve();
                })
            });
        })
    }

    renderMajorTable(){
        let { collegeId } = this.state;
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
                eos.college.collegeService.findCollegeSpecialty(collegeId,"", data => {
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
        $("#major-table").ulynlist(opts);
    }

    renderStudentTable(){
        let { history } = this.props;
        let { collegeId, studentCurrentPage, studentLinesPerPage} = this.state;
        let opts = {
            basePath: "node_modules/@share/ulynlist-ext",
            tableTpl:"share",
            tableColumn:{
                title:'ulynlist',
                rememberCheckbox:true,
                keyColumn:"",
                columns:[
                    {field:'xm', label:'姓名', overflowview:'normal', className:"unSortable", width:"100px",
                        tableTransFunc:function(value,item){
                            if(item.wzbz == "1"){
                                return value + '<span class="label label-info" style="margin-left: 5px">外住</span>'
                            }else{
                                return value;
                            }
                        }
                    },
                    {field:'xb', label:'性别', overflowview:'normal', className:"unSortable", width:"100px"},
                    {field:'lxdh', label:'联系电话', overflowview:'normal', className:"unSortable", width:"120px"},
                    {field:'rxrq', label:'入学时间', overflowview:'normal', className:"unSortable", width:"120px", trans: 'toDisDate',dateType: 'HY'},
                    {field:'specName', label:'专业', overflowview:'normal', className:"unSortable", width:"150px"},
                    {field:'facName', label:'所属院系', overflowview:'normal', className:"unSortable", width:"180px"},
                    {field:'xzdxz', label:'校内地址', overflowview:'normal', className:"unSortable"},
                ],
                rownumbers:false
            },
            //请求数据传递的参数
            requestData:{
                currentPage: studentCurrentPage,
                linesPerPage: studentLinesPerPage,
                "page":{
                    "currentPage": studentCurrentPage,
                    "linesPerPage": studentLinesPerPage
                },
                "data":{
                    "listSql": "getStudentList",
                    "collegeId": collegeId,
                }
            },
            customAjax: (requestData, callback) => {
                requestData.page.currentPage = requestData.currentPage ? requestData.currentPage : requestData.page.currentPage;
                requestData.page.linesPerPage = requestData.linesPerPage ? requestData.linesPerPage : requestData.page.linesPerPage;

                eos.college.studentService.studentData(requestData, data => {
                    console.info("studentTable...", data)
                    data.data = {
                        ...data.data,
                        ...data.data.page
                    };
                    delete data.data.page;
                    this.setState({
                        studentCurrentPage: requestData.page.currentPage,
                        studentLinesPerPage: requestData.page.linesPerPage
                    });
                    callback(data);
                });
            },
            extra:{
                linesPerPageEditable: true,
                tableSize: '',/*默认值为default，配置值支持sm*/
                lineStyle: 'lineSpace'/*默认值为default，配置值支持 lineSpace(各行变色)*/
            },
            pageBarId: 'student-tablePageBar',
            pageBarTpl: "share"
        };
        $("#student-table").ulynlist(opts);
    }

    render(){
        let { history } = this.props;
        let { collegeArray, collegeId, collegeLogo, collegeName, collegeType, collegeAddress, academyNum, majorNum, studentNum } = this.state;
        return (
            <div className="ui-box">
                <Panel>
                    <Panel.Body>
                        <div className="college-pane clearfix">
                            <div className="info-pane">
                                <div className="info-detail clearfix">
                                    <img src={collegeLogo ? (CONTEXT_PATH + '/resource' + collegeLogo) :defultPic} className="detail-logo"/>
                                    <div className="detail-content">
                                        <Select  className="g-5 form-control"
                                                 data={collegeArray}
                                                 defaultValue={collegeId}
                                                 value={collegeName}
                                                 onSelect={e => {
                                                     console.info("select2",e.target.value);
                                                     this.setState({
                                                         collegeId:e.target.value,
                                                         collegeName:e.target.value
                                                     })
                                                 }}>
                                        </Select>
                                        <ul>
                                            <li>
                                                <i className="fa fa-th-large"/>
                                                <span className="key key-type">类型：</span>
                                                <span className="value value-type">{collegeType}</span>
                                            </li>
                                            <li>
                                                <i className="fa fa-map-marker"/>
                                                <span className="key key-address">地址：</span>
                                                <span className="value value-address">{collegeAddress}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="info-total">
                                    <ul className="clearfix">
                                        <li>
                                            <i className="fa fa-building"/>
                                            <span className="key">院系：</span>
                                            <span className="value value-academy">{academyNum}</span>
                                        </li>
                                        <li>
                                            <i className="fa fa-book"/>
                                            <span className="key">专业：</span>
                                            <span className="value value-major">{majorNum}</span>
                                        </li>
                                        <li>
                                            <i className="fa fa-users"/>
                                            <span className="key">学生：</span>
                                            <span className="value value-student">{studentNum}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="map-pane">
                                <Map className="noToolBar noToggleMap noZoomSlider"
                                     btnAction = {[
                                         {
                                             btnMsg: '住校学生分布',
                                             type: 'toggleGraphic',
                                             alias: 'zxStudent',
                                             mouseClick: function(e){
                                                 const graphic = e.graphic,
                                                       attributes = e.graphicCache.attributes;
                                                 showInfoWindow(graphic,
                                                    `<div class="default">
                                                        <div>高校名称：${attributes.name}</div>
                                                        <div>学生：${attributes.stuNum}</div>
                                                        <div>高校地址：${attributes.dzxz}</div>
                                                    </div>`
                                                 )
                                             }
                                         },
                                         {
                                             btnMsg: '外住学生分布',
                                             type: 'toggleGraphic',
                                             alias: 'zxStudent'
                                         }
                                     ]}
                                     mapAction = {[
                                         {
                                             type: "showPolygon",
                                             data: {source:this.state.mapInfo},
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
                                <div id="major-table"/>
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
                <Panel bsStyle="primary">
                    <Panel.Head title="学生信息">

                    </Panel.Head>
                    <Panel.Body full>
                        <div className="tabContent">
                            <div className='tabItem'>
                                <div id="student-table"/>
                                <div id="student-tablePageBar"></div>
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default withRouter(CollegeDetail);