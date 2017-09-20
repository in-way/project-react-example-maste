// 引入react基本依赖
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// 引入服务依赖
import '../../../../static/lib/eos3/eos3.min';
import '../../../../static/lib/service/auth/zeus.auth';
import '../../../../static/lib/service/auth/all';
import '../../../../static/lib/service/blend/collegeService';
import '../../../../static/lib/service/auth/all';
// 引入ulynlist插件
import '@share/ulynlist/ulynlist';
import '@share/ulynlist/ulynlist.table';
import '@share/ulynlist/ulynlist.pagebar';
import '@share/ulynlist-ext';
import '../../../../static/lib/ajaxfileupload';
// 引入share-ui
import {
    Panel,
    Button,
    Icon,
} from '@share/shareui';


export default class CollegeTable extends Component {
    constructor(props) {
        super(props);
    }
    // 生命周期 dom渲染完成
    componentDidMount() {
        this.tableInit();
        //监听专业导入
        $(document).on('change', '#importCollege', e => {
            this.handleImportCollege();
        });
    }
    // 生命周期 dom更新
    componentDidUpdate() {
        $("#importCollege").replaceWith(' <input class="importCollege" type="file" id="importCollege" name="file" />')
    }
    // 导入学院信息
    handleImportCollege() {
        let that = this;
        var name = $('#importCollege')[0].value;
        console.log("我在导入了")
        var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        if (fileName != 'xlsx') {
            this.props.showTips("传入文件格式不正确，请确认文件格式正常");
            return;
        }
        $.ajaxFileUpload(
            {
                url: CONTEXT_PATH + "/excel/importSpecialty.do",
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'importCollege', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json,
                success: function (data, status)  //服务器成功响应处理函数
                {
                    console.log(data)
                    let failNum = data.data.failNum;
                    if (failNum === 0) {
                        that.props.showSuccess("全部数据导入成功");
                        $('#js-table').trigger('refresh');
                    } else {
                        // that.setState({
                        //     showWarningStatus: true,
                        //     warningTipsInfo: data.data
                        // })
                        that.props.showWarning(data.data);
                    }
                },
                error: function (data, status, e)//服务器响应失败处理函数
                {
                    alert(e);
                }
            }
        )
    }
    // 表格初始化
    tableInit() {
        let that = this;
        let opts = {
            basePath: "node_modules/@share/ulynlist-ext",
            tableTpl: "share",
            tableColumn: {
                title: 'ulynlist',
                rememberCheckbox: true,
                keyColumn: "",
                columns: [
                    {
                        field: 'faculty', label: '学院/系', overflowview: 'normal', className: "unSortable", width: "120px",
                        tableTransFunc(value, item) {
                            if (item.faculty === "直属学校") {
                                return `<span title="学校只设专业不设院系">${item.faculty}</span>`
                            }
                            return `<span>${item.faculty}</span>`
                        }
                    },
                    {
                        field: 'list', label: '专业', overflowview: 'normal', className: "unSortable",
                        tableTransFunc: function (value, item) {
                            let str = '';
                            item.list.map(major => {
                                str += `<span class="label-border label label-default item-major">${major.specialty}</span>`;
                            });
                            return `<span class="item-pane">${str}</span>`;
                        }
                    },
                    {
                        field: 'operate', label: '操作', className: "unSortable", width: "120px",
                        tableTransFunc: function (value, item) {
                            return `<a class="table_do_a btn_view btn-edit-departments" data-id=${item.facultyId} data-name=${item.faculty} href="javascript:void(0)">编辑</a>`
                        }
                    }
                ],
                rownumbers: true,

            },
            afterTableRender: () => {
                $(".btn-edit-departments").on("click", function () {
                    let currentName = $(this).data("name");
                    let currentId = $(this).data("id");
                    if (currentId === "data-name=直属学校") {
                        currentId = ""
                    }
                    // that.setState({
                    //     showDepartmentsModal: true,
                    //     currentCollege: currentName,
                    //     currentDepartmentsId: currentId
                    // }, () => {
                    //     that.tableInitDepartmentsModel();
                    // })
                    that.props.showMajarModal({
                        currentCollege: currentName,
                        currentDepartmentsId: currentId
                    },()=>{
                        that.props.majorInit();
                    })
                })
            },
            //请求数据传递的参数
            requestData: {

            },
            customAjax: (requestData, callback) => {
                eos.college.collegeService.findCollegeSpecialty(that.props.collegeId, "", data => {
                    data = {
                        ...data,
                        data: {
                            list: data.data
                        }
                    };
                    callback(data);
                });
            },
            extra: {
                linesPerPageEditable: true,
                tableSize: '', /*默认值为default，配置值支持sm*/
                lineStyle: 'lineSpace'/*默认值为default，配置值支持 lineSpace(各行变色)*/
            },
            pageBarId: 'js-tablePageBar',
            pageBarTpl: "share"
        };
        $("#js-table").ulynlist(opts);
    }
    // jsx渲染
    render() {
        return (
            <Panel>
                <Panel.Head title="院系与专业">
                    <Panel.HeadLeft />
                    <Panel.HeadRight>
                        <ul className="ui-list-horizontal">
                            <li>
                                <button type="button" className="btn btn-sm ui-btn-success" onClick={this.props.showCollegeModal}>
                                    <i className="fa fa-cog" />院系管理
                                </button>
                            </li>
                            <li>
                                <a className="btn btn-sm ui-btn-success"
                                    target="__blank"
                                    href={CONTEXT_PATH + `/excel/downloadStudentTemplate.do?fileName=specialtyTemplate`}>
                                    <i className="fa fa-cog" />院系专业导入模板
                                </a>
                            </li>
                            <li>
                                <div className="pull-right btn-management btn-import">
                                    <Icon style={{ verticalAlign: "top", marginTop: "8px" }} className="fa fa-sign-in"></Icon>
                                    <span>院系专业导入</span>
                                    <input className="importCollege" type="file" id="importCollege" name="file" />
                                </div>
                            </li>
                        </ul>
                    </Panel.HeadRight>
                </Panel.Head>
                <Panel.Body full>
                    <div id="js-table"></div>
                </Panel.Body>
            </Panel>
        )
    }
}

// 属性检测
CollegeTable.propTypes = {
    collegeId: PropTypes.string.isRequired,
    showCollegeModal: PropTypes.func.isRequired,
    showMajarModal: PropTypes.func.isRequired,
    showSuccess: PropTypes.func.isRequired,
    showTips: PropTypes.func.isRequired,
    showWarning: PropTypes.func.isRequired
}



