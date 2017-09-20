import 'bootstrap-datetime-picker/css/bootstrap-datetimepicker.css';
import './StudentList.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from 'store';
import {
    withRouter
} from 'react-router-dom';

import '../../../static/lib/eos3/eos3.min';
import '../../../static/lib/service/auth/zeus.auth';
import '../../../static/lib/service/auth/all';
import '../../../static/lib/service/blend/collegeService';
import '../../../static/lib/service/blend/studentService';
import '../../../static/lib/service/blend/addressService';

import 'art-template';
import '@share/ulynlist/ulynlist';
import '@share/ulynlist/ulynlist.table';
import '@share/ulynlist/ulynlist.pagebar';
import '@share/ulynlist-ext';
import 'bootstrap-datetime-picker/js/bootstrap-datetimepicker';
import 'bootstrap-datetime-picker/js/locales/bootstrap-datetimepicker.zh-CN';
import { getQueryString } from '../../../utils';
import '../../../static/lib/ajaxfileupload';

import Map from '../../../map/index'

import {
    Link
} from 'react-router-dom';

import {
    Panel,
    FormSearch,
    FormControl,
    FormItem,
    Select,
    Button,
    Icon,
    DateTime,
    withRenameFieldName,
    Modal,
    Paragraph
} from '@share/shareui';

class StudentList extends Component {

    constructor(props) {
        super(props);
        let { location } = props;
        this.collegeId = getQueryString(location, 'collegeId');

        this.state = {
            warningTipsInfo: {
                failList: []
            },
            showSuccessStatus: false,
            successTipsInfo: "",
            eidtTipsModel: false,
            eidtTipsInfo: "",
            showIndex: 0,
            studentLive: [],
            studentSex: [],
            studentCollege: [],
            selectedName: "",
            selectedId: "",
            selectedLive: "",
            selectedSex: "",
            selectedCollege: this.collegeId || '',
            selectedAcademy: "",
            selectedMajor: "",
            selectedTimeStart: "",
            selectedTimeEnd: "",
            selectedAddress: "",
            showModal: false,
            delItemId: "",
            currentPage: 1,
            linesPerPage: 10,
            showWarningStatus: false,
            ...store.get('studentList')
        }

        this.changeView = this.changeView.bind(this);
        this.renderStudentTable = this.renderStudentTable.bind(this);
        this.close = this.close.bind(this);
        this.delItem = this.delItem.bind(this);
    }
    componentDidMount() {
        this.getSelectData();

        this.form.dispatchEvent(new Event("submit"));

        window.onbeforeunload = () => {
            store.remove('studentList');
        };

        //监听学生导入
        $(document).on('change', '#importStudent', e => {
            this.importStudent();
        });
    }

    componentWillUpdate(){
        $("#importStudent").replaceWith('<input id="importStudent" class="importStudent" type="file" name="file" />')
    }

    componentWillUnmount() {
        let { history } = this.props;

        if (history.location.pathname === '/student/collegeDetail' || history.location.pathname === '/student/collegeEdit') {
            store.set('studentList', this.state);
        } else {
            store.remove('studentList');
        }
    }

    close() {
        this.setState({
            showModal: false,
            delItemId: ""
        });
    }

    closeWarningStatus() {
        this.setState({
            showWarningStatus: false
        })
    }
    closeSuccessStatus() {
        this.setState({
            showSuccessStatus: false
        })
    }

    changeView(i) {
        this.setState({
            showIndex: i
        })
    }

    delItem(id) {
        eos.college.studentService.delStudent(id, data => {
            if (data.status == "200") {
                $("#js-table").trigger('refresh');
            }
        });
        this.setState({
            showModal: false
        });
    }

    getSelectData() {
        eos.auth.dmService.getAllData("DM_SS_SF", data => {
            let studentLive = [{ "id": "", "text": "全部" }];
            console.info("DM_SS_SF", data);
            data.map((item, index) => {
                studentLive.push({
                    id: item.code,
                    text: item.label
                })
            });
            console.info("studentLive...", studentLive);
            this.setState({
                studentLive: studentLive
            })
        });
        eos.auth.dmService.getAllData("DM_RK_XB", data => {
            let studentSex = [{ "id": "", "text": "全部" }];
            data.map((item, index) => {
                studentSex.push({
                    id: item.code,
                    text: item.label
                })
            });
            console.info("studentSex...", studentSex);
            this.setState({
                studentSex: studentSex
            })
        });
        eos.college.collegeService.colleges(data => {
            let studentCollege = [];
            data.data.map((item, index) => {
                studentCollege.push({
                    id: item.id,
                    text: item.name,
                    bzmid: item.bzmid,
                    address: item.address,
                    stuNum: item.stuNum
                })
            });
            console.info("studentCollege...", studentCollege);
            this.setState({
                studentCollege: studentCollege
            })
        });
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

    renderStudentTable(e) {
        e.preventDefault();
        let { history } = this.props;
        let { selectedName, selectedId, selectedLive,
            selectedSex, selectedCollege, selectedAcademy,
            selectedMajor, selectedTimeStart, selectedTimeEnd, selectedAddress,
        } = this.state;
        console.info("selectedTime...", selectedTimeStart, selectedTimeEnd);
        let opts = {
            basePath: "node_modules/@share/ulynlist-ext",
            tableTpl: "share",
            tableColumn: {
                title: 'ulynlist',
                rememberCheckbox: true,
                keyColumn: "",
                columns: [
                    { field: 'CHECKED', checkbox: 'ID', width: "40px" },
                    {
                        field: 'xm', label: '姓名', overflowview: 'normal', className: "unSortable", width: "80px",
                        tableTransFunc: function (value, item) {
                            if (item.wzbz == "1") {
                                return value + '<span class="label label-info" style="margin-left: 5px">外住</span>'
                            } else {
                                return value;
                            }
                        }
                    },
                    { field: 'xb', label: '性别', overflowview: 'normal', className: "unSortable", width: "80px" },
                    { field: 'lxdh', label: '联系电话', overflowview: 'normal', className: "unSortable", width: "100px" },
                    { field: 'rxrq', label: '入学时间', overflowview: 'normal', className: "unSortable", width: "100px", trans: 'toDisDate', dateType: 'HY' },
                    { field: 'specName', label: '专业', overflowview: 'normal', className: "unSortable", width: "120px" },
                    { field: 'facName', label: '所属院系', overflowview: 'normal', className: "unSortable", width: "120px" },
                    { field: 'collegeName', label: '学校', overflowview: 'normal', className: "unSortable", width: "120px" },
                    {
                        field: 'operate', label: '操作', className: "unSortable", width: "120px",
                        tableTransFunc: function (value, item) {
                            return '<a class="table_do_a btn_view" data-id=' + item.id + ' href="javascript:void(0)">查看</a>' +
                                '<a class="table_do_a btn_edit" data-id=' + item.id + ' href="javascript:void(0)">编辑</a>' +
                                '<a class="table_do_a btn_del" data-id=' + item.id + ' href="javascript:void(0)">删除</a>'
                        }
                    }
                ],
                rownumbers: false,
                setRowColor: (data) => {
                    if (data.state == "success") {
                        return "bg-success";
                    } else if (data.state == "info") {
                        return "bg-info";
                    } else if (data.state == "danger") {
                        return "bg-danger";
                    } else if (data.state == "warning") {
                        return "bg-warning";
                    } else {
                        return "";
                    }
                }
            },
            afterTableRender: () => {
                $(".btn_view").unbind('click').on("click", (e) => {
                    let viewId = $(e.target).data('id');
                    history.push({
                        pathname: '/student/detail',
                        search: `studentId=${viewId}`
                    })
                })
                $(".btn_edit").unbind('click').on("click", (e) => {
                    let editId = $(e.target).data('id');
                    history.push({
                        pathname: '/student/edit',
                        search: `studentId=${editId}`
                    })
                })
                $(".btn_del").unbind('click').on("click", (e) => {
                    let delId = $(e.target).data('id');
                    this.setState({
                        showModal: true,
                        delItemId: delId
                    });
                })
            },
            //请求数据传递的参数
            requestData: {
                currentPage: this.state.currentPage,
                linesPerPage: this.state.linesPerPage,
                "page": {
                    "currentPage": this.state.currentPage,
                    "linesPerPage": this.state.linesPerPage
                },
                "data": {
                    "listSql": "getStudentList",
                    "collegeId": selectedCollege,
                    "facName": selectedAcademy,
                    "specName": selectedMajor,
                    "xm": selectedName,
                    "zjhm": selectedId,
                    "xb": selectedSex,
                    "wzbz": selectedLive,
                    "qssj": selectedTimeStart,
                    "zzsj": selectedTimeEnd,
                    "xzdxz": selectedAddress
                }
            },
            customAjax: (requestData, callback) => {
                requestData.data.qssj = requestData.data.qssj.replace(/-/g, "");
                requestData.data.zzsj = requestData.data.zzsj.replace(/-/g, "");
                requestData.page.currentPage = requestData.currentPage ? requestData.currentPage : requestData.page.currentPage;
                requestData.page.linesPerPage = requestData.linesPerPage ? requestData.linesPerPage : requestData.page.linesPerPage;

                console.info("调用接口：", requestData)
                eos.college.studentService.studentData(requestData, data => {
                    data.data = {
                        ...data.data,
                        ...data.data.page
                    };
                    delete data.data.page;
                    this.setState({
                        currentPage: requestData.page.currentPage,
                        linesPerPage: requestData.page.linesPerPage
                    });
                    callback(data);
                });
            },
            extra: {
                linesPerPageEditable: true,
                tableSize: '',/*默认值为default，配置值支持sm*/
                lineStyle: 'lineSpace'/*默认值为default，配置值支持 lineSpace(各行变色)*/
            },
            pageBarId: 'js-tablePageBar',
            pageBarTpl: "share"
        };
        $("#js-table").ulynlist(opts);
    }

    importStudent() {
        let that = this;
        var name = $('#importStudent')[0].value;
        var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        if (fileName != 'xlsx') {
            $("#importStudent").replaceWith('<input id="importStudent" class="importStudent" type="file" name="file" />');
            this.setState({
                eidtTipsInfo: "传入文件格式不正确，请确认文件格式正常",
                eidtTipsModel: true
            });
            return;
        }
        $.ajaxFileUpload({
            url: CONTEXT_PATH + "/excel/importStudent.do",
            secureuri: false,
            fileElementId: 'importStudent',
            dataType: 'json', //返回值类型 一般设置为json,
            success: function (data, status)  //服务器成功响应处理函数
            {
                console.log("返回的学生信息",data)
                if (data.data.failNum === 0) {
                    $('#js-table').trigger('refresh');
                    that.setState({
                        successTipsInfo: "学生数据全部导入成功！",
                        showSuccessStatus: true
                    })
                } else {
                    that.setState({
                        showWarningStatus: true,
                        warningTipsInfo: data.data
                    },()=>{
                        console.log(this.state.warningTipsInfo.failList)
                    })
                }
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                alert(e);
            }
        })
        
    }
    closeEidtTipsModel() {
        this.setState({
            eidtTipsModel: false
        })
    }

    render() {
        let { studentLive, studentSex, studentCollege,
            selectedName, selectedId, selectedLive,
            selectedSex, selectedCollege, selectedAcademy,
            selectedMajor, selectedTimeStart, selectedTimeEnd, selectedAddress,
            showModal
            } = this.state;

        let { history } = this.props;

        return (
            <div className="ui-box">
                <Panel>
                    <form ref={form => this.form = form} onSubmit={this.renderStudentTable}>
                        <FormSearch>
                            <FormItem>
                                <FormItem.Label>姓名</FormItem.Label>
                                <FormItem.Content>
                                    <FormControl className="g-4"
                                        value={selectedName}
                                        onChange={(e) => {
                                            this.setState({
                                                selectedName: e.target.value
                                            })
                                        }} />
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>证件号</FormItem.Label>
                                <FormItem.Content>
                                    <FormControl className="g-4"
                                        value={selectedId}
                                        onChange={(e) => {
                                            this.setState({
                                                selectedId: e.target.value
                                            })
                                        }} />
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>是否外住</FormItem.Label>
                                <FormItem.Content>
                                    <Select className="g-4 form-control"
                                        data={studentLive}
                                        defaultValue={""}
                                        options={{
                                            allowClear: false
                                        }}
                                        value={selectedLive}
                                        onSelect={e => {
                                            this.setState({
                                                selectedLive: e.target.value
                                            })
                                        }}>
                                    </Select>
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>性别</FormItem.Label>
                                <FormItem.Content>
                                    <Select className="g-4 form-control"
                                        data={studentSex}
                                        defaultValue={""}
                                        options={{
                                            allowClear: false
                                        }}
                                        value={selectedSex}
                                        onSelect={e => {
                                            this.setState({
                                                selectedSex: e.target.value
                                            })
                                        }}>
                                    </Select>
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>学校</FormItem.Label>
                                <FormItem.Content>
                                    <Select className="g-4 form-control"
                                        data={studentCollege}
                                        defaultValue={""}
                                        options={{
                                            allowClear: false
                                        }}
                                        value={selectedCollege}
                                        onSelect={e => {
                                            this.setState({
                                                selectedCollege: e.target.value
                                            })
                                        }}>
                                    </Select>
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>所属院系</FormItem.Label>
                                <FormItem.Content>
                                    <FormControl className="g-4"
                                        value={selectedAcademy}
                                        onChange={(e) => {
                                            this.setState({
                                                selectedAcademy: e.target.value
                                            })
                                        }} />
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>专业</FormItem.Label>
                                <FormItem.Content>
                                    <FormControl className="g-4"
                                        value={selectedMajor}
                                        onChange={(e) => {
                                            this.setState({
                                                selectedMajor: e.target.value
                                            })
                                        }} />
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>现居住地</FormItem.Label>
                                <FormItem.Content>
                                    <FormControl className="g-4"
                                        value={selectedAddress}
                                        onChange={(e) => {
                                            this.setState({
                                                selectedAddress: e.target.value
                                            })
                                        }} />
                                </FormItem.Content>
                            </FormItem>
                            <FormItem>
                                <FormItem.Label>入学时间</FormItem.Label>
                                <FormItem.Content className="rangePart">
                                    <DateTime className="sub-item" multiple
                                        input1Props={{
                                            id: 'selectedTimeStart', value: selectedTimeStart,
                                            changeDate: (val, ev) => {
                                                this.setState({
                                                    selectedTimeStart: val
                                                })
                                            }
                                        }}
                                        input2Props={{
                                            id: 'selectedTimeEnd', value: selectedTimeEnd,
                                            changeDate: (val, ev) => {
                                                this.setState({
                                                    selectedTimeEnd: val
                                                })
                                            }
                                        }} />
                                </FormItem.Content>
                            </FormItem>
                            <FormItem className="btn-item clearfix">
                                <Button type="submit" bsStyle="primary">查询</Button>
                                <Button type="reset" onClick={(e) => {
                                    this.setState({
                                        selectedName: "",
                                        selectedId: "",
                                        selectedLive: "",
                                        selectedSex: "",
                                        selectedCollege: "",
                                        selectedAcademy: "",
                                        selectedMajor: "",
                                        selectedTimeStart: "",
                                        selectedTimeEnd: "",
                                        selectedAddress: ""
                                    }, () => {
                                        // this.renderStudentTable();
                                        this.form.dispatchEvent(new Event("submit"));
                                    });
                                }}>重置</Button>
                            </FormItem>
                        </FormSearch>
                    </form>
                </Panel>
                <Panel bsStyle="primary">
                    <Panel.Head title="查询结果">
                        <Panel.HeadLeft />
                        {/*<Panel.HeadLeft>*/}
                        {/*<ul className="ui-list-horizontal">*/}
                        {/*<li>*/}
                        {/*<span>总数：</span>*/}
                        {/*<em className="text-primary">2675</em>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                        {/*<span>住校学生：</span>*/}
                        {/*<em className="text-success">2675</em>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                        {/*<span>外住学生：</span>*/}
                        {/*<em className="text-info">2675</em>*/}
                        {/*</li>*/}
                        {/*</ul>*/}
                        {/*</Panel.HeadLeft>*/}
                        <Panel.HeadRight>
                            <ul className="ui-list-horizontal">
                                <li>
                                    <button type="button" className="btn btn-sm ui-btn-success" onClick={() => {
                                        this.props.history.push({
                                            pathname: '/student/collegeEdit',
                                            search: this.collegeId && `collegeId=${this.collegeId}`
                                        });
                                    }}>
                                        <i className="fa fa-plus" />新增
                                    </button>
                                </li>
                                <li>
                                    <a href={CONTEXT_PATH + `/excel/downloadStudentTemplate.do?fileName=studentTemplate`} target="__blank" className="btn btn-sm ui-btn-default">
                                        <i className="fa fa-download" />下载模板
                                    </a>
                                </li>
                                {/* <li>
                                    <button type="button" className="btn btn-sm ui-btn-success">
                                        <i className="fa fa-sign-in" />导入
                                    </button>
                                </li> */}
                                <li>
                                    <a target="__blank" href={CONTEXT_PATH + `/excel/exportStudent.do?params=${JSON.stringify({
                                        collegeId: selectedCollege,
                                        facName: selectedAcademy,
                                        specName: selectedMajor,
                                        xm: selectedName,
                                        zjhm: selectedId,
                                        xb: selectedSex,
                                        wzbz: selectedLive,
                                        qssj: selectedTimeStart,
                                        zzsj: selectedTimeEnd,
                                        xzdxz: selectedAddress
                                    })}`} className="btn btn-sm ui-btn-info" >
                                        <i className="fa fa-share-square-o" />导出
                                    </a>
                                </li>
                                <li>
                                    <div className="pull-right btn-management btn-import">
                                        <Icon style={{ verticalAlign: "top", marginTop: "8px",marginRight:"5px" }} className="fa fa-sign-in"></Icon>
                                        <span>学生导入</span>
                                        <input id="importStudent" className="importStudent" type="file" name="file" />
                                    </div>
                                </li>
                            </ul>
                            <ul className="ui-list-horizontal ui-toggle-view">
                                <li onClick={e => this.changeView(0)} className={this.state.showIndex == 0 ? 'active' : ''}>
                                    <a href="javascript:;">
                                        <i className="fa fa-align-justify" />
                                    </a>
                                </li>
                                <li onClick={e => this.changeView(1)} className={this.state.showIndex == 1 ? 'active' : ''}>
                                    <a href="javascript:;">
                                        <i className="fa fa-map-marker" />
                                    </a>
                                </li>
                            </ul>
                        </Panel.HeadRight>
                    </Panel.Head>
                    <Panel.Body className={this.state.showIndex == 0 ? 'body-full' : 'body-average'}>
                        <div className="tabContent">
                            <div className={this.state.showIndex == 0 ? 'tabItem' : 'tabItem hidden'}>
                                <div id="js-table" />
                                <div id="js-tablePageBar"></div>
                            </div>
                            <div style={{ height: '410px' }} className={this.state.showIndex == 1 ? 'tabItem' : 'tabItem transparent'}>
                                <Map className="noToolBar"
                                     legend = {{
                                         "data": [
                                             {
                                                 img: "point_green",
                                                 text: "住校学生"
                                             },
                                             {
                                                 img: "point_yellow",
                                                 text: "校外学生"
                                             }
                                         ],
                                         "style":{

                                         }
                                     }}
                                     mapAction = {[
                                         {
                                             type: "showPolygon",
                                             data: {
                                                 source: this.state.studentCollege,
                                                 map:{
                                                     id : "bzmid",
                                                     name : "text"
                                                 }
                                             },
                                             tip_mouseClick: function(attributes){
                                                 return (
                                                     `<div class="default">
                                                         <div>高校名称：${attributes.text}</div>
                                                         <div>学生人数：${attributes.stuNum}</div>
                                                         <div>高校地址：${attributes.address}</div>
                                                     </div>`
                                                 )
                                             },
                                             focus: true
                                         },
                                         {
                                             type: "showPoint",
                                             data: {
                                                 source: this.state.pointData
                                             },
                                             focus: false,
                                             style: {
                                                 img : "point_green",
                                                 width : 18,
                                                 height : 22,
                                                 xoffset : 0,
                                                 yoffset : 11
                                             },
                                             tip_mouseOver: function(attributes){
                                                 return (
                                                     `<div class="default">
                                                         <div>地址：${attributes.dzxz}</div>
                                                         <div>住宿学生：${attributes.stuNum}</div>
                                                     </div>`
                                                 )
                                             }
                                         },
                                         {
                                             type: "showPoint",
                                             data: {
                                                 source:this.state.wxpointData
                                             },
                                             focus: false,
                                             style: {
                                                 img : "point_yellow",
                                                 width : 18,
                                                 height : 22,
                                                 xoffset : 0,
                                                 yoffset : 11
                                             },
                                             tip_mouseOver: function(attributes){
                                                 return (
                                                     `<div class="default">
                                                         <div>姓名：${attributes.stuName}</div>
                                                         <div>所属学校：${attributes.collegeName}</div>
                                                         <div>居住地址：${attributes.dzxz}</div>
                                                         <a style="color: #00BBDD;text-decoration: underline" class="jumpToDetail" data-id=${attributes.stuId}>详细</a>
                                                     </div>`
                                                 )
                                             },
                                             bindEvents: (function(history){
                                                 return function(){
                                                     // 地图区域调转详细
                                                     $('.jumpToDetail').unbind('click').on('click',function(){
                                                         let id = $(this).data("id");
                                                         history.push({
                                                             pathname: '/student/collegeDetail',
                                                             search: `studentId=${id}`
                                                         })
                                                     })
                                                 };
                                             })(history)
                                         }
                                     ]}
                                />
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
                <Modal bsSize="small" show={showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>提示信息</Modal.Title>
                    </Modal.Header>
                    <Modal.Body onlyText>
                        <p>是否确定删除？</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>取消</Button>
                        <Button bsStyle="primary" onClick={(e) => {
                            this.delItem(this.state.delItemId)
                        }}>确定</Button>
                    </Modal.Footer>
                </Modal>
                <Modal bsSize="small" show={this.state.eidtTipsModel} onHide={this.closeEidtTipsModel.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>提示</Modal.Title>
                    </Modal.Header>
                    <Modal.Body onlyText>
                        <p>{this.state.eidtTipsInfo}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this.closeEidtTipsModel.bind(this)}>确定</Button>
                    </Modal.Footer>
                </Modal>
                <Modal bsSize="small" show={this.state.showSuccessStatus} onHide={this.closeSuccessStatus.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>提示</Modal.Title>
                    </Modal.Header>
                    <Modal.Body validationState="success" message={this.state.successTipsInfo}>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeSuccessStatus.bind(this)}>关闭</Button>
                        <Button bsStyle="primary" onClick={this.closeSuccessStatus.bind(this)}>确定</Button>
                    </Modal.Footer>
                </Modal>
                <Modal bsSize="large" show={this.state.showWarningStatus} onHide={this.closeWarningStatus.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>提示</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Icon style={{ fontSize: "72px", color: "#ffaa33" }} className="fa fa-exclamation-circle"></Icon>
                            <p style={{ fontSize: "14px" }}><Paragraph inline={true} bsStyle="warning">部分数据导入失败</Paragraph>,共{this.state.warningTipsInfo.totalNum}条，成功<Paragraph inline={true} bsStyle="success">{this.state.warningTipsInfo.successNum}</Paragraph>条，失败<Paragraph inline={true} bsStyle="danger">{this.state.warningTipsInfo.failNum}</Paragraph>条</p>
                        </div>
                    </Modal.Body>
                    <table className="share-table import">
                        <tbody>
                            <tr className="table_th">
                                <th>行号</th>
                                <th>名字</th>
                                <th>证件类型</th>
                                <th>证件号码</th>
                                <th>学校</th>
                                <th>专业</th>
                                <th>错误原因</th>
                            </tr>
                            {
                                this.state.warningTipsInfo.failList.map((item, index) => {
                                    return (
                                        <tr key={"tr_"+index}>
                                        
                                            <td className="fail-info">{item.index}</td>
                                            <td>
                                                <span>{item.name}</span>
                                            </td>
                                            <td>
                                                <span>{item.zjlx}</span>
                                            </td>
                                            <td>
                                                <span>{item.zjhm}</span>
                                            </td>
                                            <td>
                                                <span>{item.college}</span>
                                            </td>
                                            <td>
                                                <span>{item.specName}</span>
                                            </td>
                                            <td>
                                                <span className="fail-info">{item.message}</span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <Modal.Footer>
                        <Button onClick={this.closeWarningStatus.bind(this)}>关闭</Button>
                        <Button bsStyle="primary" onClick={this.closeWarningStatus.bind(this)}>确定</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(StudentList);