// 引入react基础依赖
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// 引入shareUI
import {
    Modal,
    Button
} from '@share/shareui';

// 引入服务依赖
import '../../../../static/lib/eos3/eos3.min';
import '../../../../static/lib/service/auth/zeus.auth';
import '../../../../static/lib/service/auth/all';
import "../../../../static/lib/service/blend/specialtyService";

// 引入ulynlist插件
import '@share/ulynlist/ulynlist';
import '@share/ulynlist/ulynlist.table';
import '@share/ulynlist/ulynlist.pagebar';
import '@share/ulynlist-ext';

export default class MajarModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddMajorsInput: false,
        }
    }
    // 生命周期 监控数据更新
    componentDidUpdate(props,state) {
        if(props.show === false) {
            this.tableInitDepartmentsModel();
        }
    }
    // 专业表格信息初始化
    tableInitDepartmentsModel() {
        let { history } = this.props;
        let that = this;

        function majorsCtrl() {
            $(".majors-add-input").parents("tr").hide();
            $(".table-delete").unbind("click").on("click", function () {
                if (!!$(this).data("id")) {
                    eos.college.specialtyService.delSpecialty($(this).data("id"), data => {
                        console.info("删除专业的时候:", data);
                        if (data.status == 200) {
                            // that.handleCloseCollege();
                            $(this).parents("tr").remove();
                        } else {
                            that.props.showErrorModal(data.message);
                        }
                    })
                }
            })
            $(".btn-add-majors").unbind("click").on("click", function () {
                that.setState({
                    isAddMajorsInput: true
                })
                let trLen = $("#js-table___departments_model").find("tr").length - 1;
                $(".majors-add-input").parents("tr").show().children().eq(0).text(trLen);
            })
            $(".btn-edit-majors").unbind("click").on("click", function () {
                let currentValue = $(this).parents("tr").find(".currentMajorsValue").text();
                $(this).parents("tr").find(".majors-edit-input").val(currentValue).show().siblings().hide();
                $(this).siblings(".js_save_majors").show().siblings().hide();
            })
            $(".js_save_majors").unbind("click").on("click", function () {
                let inputValue = $(this).parents("tr").find(".majors-edit-input").val();
                if (inputValue.length > 20) {
                    // that.setState({
                    //     eidtTipsModel: true,
                    //     eidtTipsInfo: "您输入的专业名称过长，请重新输入"
                    // })
                    that.props.showErrorModal("您输入的专业名称过长，请重新输入");
                    return;
                }
                $(this).parents("tr").find(".majors-edit-input").hide().siblings().text(inputValue).show();
                $(this).siblings().show().end().hide();
                var facultyId = that.props.majarId;
                let curId = $(this).data("id");
                let paramData = {
                    id: curId,
                    name: inputValue,
                    facultyId: facultyId,
                    collegeId: that.props.id
                }

                eos.college.specialtyService.saveSpecialty(paramData, data => {
                    console.log("保存",data)
                })

            })
            $(".js_saveAllMajors").unbind("click").on("click", function () {
                var editInputLen = $(".majors-edit-input:visible").length;
                if (that.state.isAddMajorsInput || editInputLen !=0) {
                    // that.setState({
                    //     showTipsModel1: true
                    // })
                    that.props.showSaveTips();
                } else {
                    that.props.close();
                    // that.handleCloseDepartments();
                }
            })

        }

        let opts = {
            basePath: "node_modules/@share/ulynlist-ext",
            tableTpl: "share",
            tableColumn: {
                title: 'ulynlist',
                rememberCheckbox: true,
                keyColumn: "",
                columns: [
                    {
                        field: 'name', label: '专业名称', overflowview: 'normal', className: "unSortable", width: "80%",
                        tableTransFunc: function (value, item) {
                            if (item.name) {
                                return `
                                    <span class="currentMajorsValue" data-id=${item.id}>${item.name}</span>
                                    <input class="majors-edit-input" type="text" placeholder="请输入" style="width:100%;display:none;" class="form-control">
                                `
                            } else if (item.isInput) {
                                return `<input class="majors-add-input" type="text" placeholder="请输入" style="width:100%;" class="form-control">`
                            }
                        }
                    },
                    {
                        field: 'operate', label: '操作', className: "unSortable", width: "100px", hideTitle: "true",
                        tableTransFunc: function (value, item) {
                            if (!!item.id) {
                                if (item.id === "isAddInput") {
                                    return `
                                    <a class="jsAddCurrentCollege table_do_a btn_view btn-college-model" href="javascript:void(0)">完成</a>
                                    `
                                } else {
                                    return `
                                    <a class="table_do_a btn_view table-delete" data-id=${item.id} href="javascript:void(0)">删除</a>
                                    <a class="btn-edit-majors table_do_a btn_view" data-id=${item.id} href="javascript:void(0)">编辑</a>
                                    <a class="js_save_majors table_do_a btn_view" style="display:none;" data-id=${item.id} href="javascript:void(0)">完成</a>
                                    `
                                }
                            }
                        }
                    }
                ],
                rownumbers: true,

            },

            afterTableRender: () => {
                majorsCtrl();
                $(".jsAddCurrentCollege").on("click", function () {
                    let addValue = $(this).parents("tr").find("input").val();
                    if (addValue.length > 20) {
                        // that.setState({
                        //     eidtTipsModel: true,
                        //     eidtTipsInfo: "您输入的专业名称过长，请重新输入"
                        // })
                        that.props.showErrorModal("您输入的专业名称过长，请重新输入");
                        return;
                    }
                    that.setState({
                        isAddCollegeInput: false,
                        isAddMajorsInput: false
                    })

                    $(this).parents("tr").hide().find("input").val("");
                    if (!addValue) {
                        return;
                    }
                    let length = $("#js-table___departments_model").find("tr").length - 1;

                    var facultyId = that.props.majarId;

                    let paramData = {
                        id: "",
                        name: addValue,
                        facultyId: facultyId,
                        collegeId: that.props.id
                    }

                    var curDom = $(this);
                    eos.college.specialtyService.saveSpecialty(paramData, data => {
                        console.log("新增院系信息", data)
                        let addDomStr = `
                        <tr style="" class=" ">
                            <td class="td_common td_color_dark">${length}</td>
                            <td class="td_common td_color_light" style="" title="${addValue}">
                                <span class="td_val" overflowview="normal">
                                    <span class="currentMajorsValue">${addValue}</span>
                                    <input class="majors-edit-input" type="text" placeholder="请输入" style="width:100%;display:none;">
                                </span>
                            </td>
                            <td class="td_common td_color_dark" style="">
                                <span class="td_val" overflowview="">
                                <a class="table_do_a btn_view table-delete" data-id=${data.data.id} href="javascript:void(0)">删除</a>
                                <a class="btn-edit-majors table_do_a btn_view" data-id=${data.data.id} href="javascript:void(0)">编辑</a>
                                <a class="js_save_majors table_do_a btn_view" style="display:none;" data-id=${data.data.id} href="javascript:void(0)">完成</a>
                                </span>
                            </td>
                        </tr>`;
                        let addDom = $(addDomStr)
                        curDom.parents("tr").before(addDom);
                        majorsCtrl();
                    })
                })
            },
            //请求数据传递的参数
            requestData: {

            },
            customAjax: (requestData, callback) => {
                eos.college.specialtyService.specialtyData(that.props.id, that.props.majarId, data => {
                    var curData = data.data;
                    curData.push({
                        isInput: true,
                        id: "isAddInput"
                    })
                    data = {
                        ...data,
                        data: {
                            list: curData
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

        $("#js-table___departments_model").ulynlist(opts);
    }
    render() {
        return (
            <Modal bsSize="small" show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: "bold" }}>{this.props.collegeName} 院系管理</Modal.Title>
                </Modal.Header>
                <Modal.Body onlyText full>
                    <div id="js-table___departments_model"></div>
                </Modal.Body>
                <Modal.Footer className="clearfix">
                    <Button className="pull-left btn-add-majors">新增专业</Button>
                    <Button className="pull-right js_saveAllMajors" bsStyle="primary" onClick={this.close}>保存</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

// 属性检测
MajarModal.propTypes = {
    close: PropTypes.func.isRequired,
    collegeName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    majarId: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    showErrorModal: PropTypes.func.isRequired,
    showSaveTips: PropTypes.func.isRequired
}

