import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from 'store';
import { Link,withRouter } from 'react-router-dom';

import '../../../static/lib/eos3/eos3.min';
import '../../../static/lib/service/auth/zeus.auth';
import '../../../static/lib/service/auth/all';
import '../../../static/lib/service/blend/collegeService';

import '@share/ulynlist/ulynlist';
import '@share/ulynlist/ulynlist.table';
import '@share/ulynlist/ulynlist.pagebar';
import '@share/ulynlist-ext';

import Map from '../../../map/index';


import {
    Panel,
    FormSearch,
    FormControl,
    Select,
    Button,
    Icon,
    FormItem
} from '@share/shareui';

class CollegeList extends Component{

    constructor() {
        super();
        this.state = {
            showIndex: 0,
            collegeName:[],
            collegeType:[],
            selectedName:"",
            selectedType:"",
            selectedAddress:"",
            currentPage: 1,
            linesPerPage:10,
            ...store.get('list')
        };
        this.changeView = this.changeView.bind(this);
        this.renderCollegeTable  = this.renderCollegeTable.bind(this);
    }

    componentDidMount() {
        this.getCollegeName();
        this.getCollegeType('DM_COLLEGE_TYPE');
        this.form.dispatchEvent(new Event("submit"));

        window.onbeforeunload = () => {
            store.remove('list');
        };
    }

    componentWillUnmount(){
        let { history } = this.props;

        if(history.location.pathname !== '/college/collegeDetail'){
            store.remove('list');
        }else{
            store.set('list', this.state);
        }
    }

    getCollegeName(){
        eos.college.collegeService.colleges(data => {
            let collegeName = [];

            data.data.map((item,index)=>{
                collegeName.push({
                    id:item.id,
                    text: item.name,
                    bzmid: item.bzmid,
                    address: item.address,
                    stuNum: item.stuNum
                });
            });
            this.setState({
                collegeName:collegeName
            })
        });
    }

    getCollegeType(code){
        eos.auth.dmService.getAllData(code, data => {
            let collegeType = [{"id":"","text":"全部"}];
            data.map((item,index)=>{
                collegeType.push({
                    id:item.code,
                    text: item.label
                })
            });
            this.setState({
                collegeType:collegeType
            })
        });
    }

    changeView(i){
        this.setState({
            showIndex: i
        })
    }

    renderCollegeTable(e){
        e.preventDefault();
        let { history } = this.props;
        let opts = {
            basePath: "node_modules/@share/ulynlist-ext",
            tableTpl:"share",
            tableColumn:{
                title:'ulynlist',
                rememberCheckbox:true,
                keyColumn:"",
                columns:[
                    {field:'CHECKED',checkbox:'ID', width:"40px"},
                    {field:'name', label:'高校名称', overflowview:'normal', className:"unSortable", width:"160px"},
                    {field:'type', label:'高校类型', overflowview:'normal', className:"unSortable", width:"120px"},
                    {field:'stuNum', label:'学生数量', overflowview:'normal', className:"unSortable", width:"120px"},
                    {field:'address', label:'高校地址', overflowview:'normal', className:"unSortable"},
                    {field: 'operate', label: '操作', className: "unSortable", width:"120px",
                        tableTransFunc:function(value,item){
                            return '<a class="table_do_a btn_view" data-id=' + item.id + ' href="javascript:void(0)">查看</a>'
                        }
                    }
                ],
                rownumbers:false,
                setRowColor: (data) => {}
            },
            afterTableRender: () => {
                $(".btn_view").unbind('click').on("click", function(){
                    let id = $(this).data("id");
                    history.push({
                        pathname: '/college/detail',
                        search: `collegeId=${id}`
                    })
                })
            },
            //请求数据传递的参数
            requestData:{
                currentPage: this.state.currentPage,
                linesPerPage: this.state.linesPerPage,
                "page":{
                    "currentPage": this.state.currentPage,
                    "linesPerPage":this.state.linesPerPage
                },
                "data":{
                    "listSql": "getCollegeList",
                    "collegeId": this.state.selectedName,
                    "collegeType":  this.state.selectedType,
                    "collegeAddress":  this.state.selectedAddress
                }
            },
            customAjax: (requestData, callback) => {
                requestData.page.currentPage = requestData.currentPage ? requestData.currentPage : requestData.page.currentPage;
                requestData.page.linesPerPage = requestData.linesPerPage ? requestData.linesPerPage : requestData.page.linesPerPage;
                eos.college.collegeService.collegeData(requestData, data => {
                    data.data = {
                        ...data.data,
                        ...data.data.page
                    };
                    delete data.data.page;
                    this.setState({
                        currentPage: requestData.page.currentPage,
                        linesPerPage: requestData.page.linesPerPage
                    });
                    console.info("collegeTable",data);
                    callback(data);
                });
            },
            extra:{
                linesPerPageEditable: true,
                tableSize: '',/*默认值为default，配置值支持sm*/
                lineStyle: 'lineSpace'/*默认值为default，配置值支持 lineSpace(各行变色)*/
            },
            pageBarId: 'js-tablePageBar',
            pageBarTpl: "share"
        };
        $("#js-table").ulynlist(opts);
    }

    render(){
        let { selectedName, selectedType, selectedAddress } = this.state;
        let { history } = this.props;

        return (
            <div className="ui-box">
                <Panel>
                    <form ref={form => this.form = form} onSubmit={this.renderCollegeTable}>
                        <FormSearch>
                            <FormItem>
                                <FormItem.Label>高校名称</FormItem.Label>
                                <FormItem.Content>
                                    <Select  className="g-4 form-control"
                                             data={this.state.collegeName}
                                             defaultValue={""}
                                             value={selectedName}
                                             options={{
                                                 allowClear: false
                                             }}
                                             onSelect={e => {
                                                 console.info(e);
                                                 this.setState({
                                                     selectedName:e.target.value
                                                 })
                                             }}>
                                    </Select>
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>高校类型</FormItem.Label>
                                <FormItem.Content>
                                    <Select  className="g-4 form-control"
                                             data={this.state.collegeType}
                                             defaultValue={""}
                                             options={{
                                                 allowClear: false
                                             }}
                                             value={selectedType}
                                             onChange={e => {
                                                 this.setState({
                                                     selectedType:e.target.value
                                                 })
                                             }}>
                                    </Select>
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>高校地址</FormItem.Label>
                                <FormItem.Content>
                                    <FormControl value={selectedAddress}
                                                 onChange={(e) => {
                                                     this.setState({
                                                         selectedAddress: e.target.value
                                                     })
                                                 }}/>
                                </FormItem.Content>
                            </FormItem>
                            <FormItem className="btn-item clearfix">
                                <Button type="submit" bsStyle="primary">查询</Button>
                                <Button type="reset" onClick={(e) => {
                                    this.setState({
                                        selectedName:"",
                                        selectedType:"",
                                        selectedAddress: ""
                                    }, () => {
                                        this.form.dispatchEvent(new Event("submit"));
                                    });
                                }}>重置</Button>
                            </FormItem>
                        </FormSearch>
                    </form>
                </Panel>
                <Panel bsStyle="primary">
                    <Panel.Head title="查询结果">
                        <Panel.HeadLeft>
                            <ul className="ui-list-horizontal">
                                <li>
                                    <span className="text-danger">新增高校、修改高校名称、删除高校请到高校组织模块进行管理！</span>
                                </li>
                            </ul>
                        </Panel.HeadLeft>
                        <Panel.HeadRight>
                            <ul className="ui-list-horizontal">
                                <li>
                                    <a target="__blank" href={CONTEXT_PATH + `/excel/exportCollege.do?params=${JSON.stringify({
                                        collegeId: selectedName,
                                        collegeType: selectedType,
                                        collegeAddress: selectedAddress
                                    })}`} className="btn btn-sm ui-btn-info" >
                                        <i className="fa fa-share-square-o"/>导出
                                    </a>
                                </li>
                            </ul>
                            <ul className="ui-list-horizontal ui-toggle-view">
                                <li onClick={e => this.changeView(0)} className={this.state.showIndex == 0 ?'active' :''}>
                                    <a href="javascript:;">
                                        <i className="fa fa-align-justify"/>
                                    </a>
                                </li>
                                <li onClick={e => this.changeView(1)} className={this.state.showIndex == 1 ?'active' :''}>
                                    <a href="javascript:;">
                                        <i className="fa fa-map-marker"/>
                                    </a>
                                </li>
                            </ul>
                        </Panel.HeadRight>
                    </Panel.Head>
                    <Panel.Body className={this.state.showIndex == 0 ?'body-full' :'body-average'}>
                        <div className="tabContent">
                            <div className={this.state.showIndex == 0 ?'tabItem' :'tabItem hidden'}>
                                <div id="js-table"/>
                                <div id="js-tablePageBar"></div>
                            </div>
                            <div style={{height: '410px'}} className={this.state.showIndex == 1 ?'tabItem' :'tabItem transparent'}>
                                <Map className="noToolBar"
                                     mapAction = {[
                                         {
                                             type: "showPolygon",
                                             data: {
                                                 source: this.state.collegeName,
                                                 map:{
                                                     id: "bzmid",
                                                     name: "text"
                                                 }
                                             },
                                             focus: true,
                                             tip_mouseClick: function(attributes){
                                                 return (
                                                     `<div class="default">
                                                         <div>高校名称：${attributes.text}</div>
                                                         <div>学生人数：${attributes.stuNum}</div>
                                                         <div>高校地址：${attributes.address}</div>
                                                         <a style="color: #00BBDD;text-decoration: underline" class="jumpToDetail" data-id=${attributes.id}>详细</a>
                                                     </div>`
                                                 )
                                             },
                                             bindEvents: (function(history){
                                                 return function(){
                                                     // 地图区域调转详细
                                                     $('.jumpToDetail').unbind('click').on('click',function(){
                                                         let id = $(this).data("id");
                                                         history.push({
                                                             pathname: '/college/collegeDetail',
                                                             search: `collegeId=${id}`
                                                         })
                                                     })
                                                 }
                                             })(history)
                                         }
                                     ]}
                                />
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}

export default withRouter(CollegeList);