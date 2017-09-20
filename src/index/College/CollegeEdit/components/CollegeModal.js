// react基本依赖
import React, { Component } from 'react'
import PropTypes from 'prop-types';
// 引入share-ui
import {
    Modal,
    Button
} from '@share/shareui';

// 引入服务依赖
import '../../../../static/lib/eos3/eos3.min';
import '../../../../static/lib/service/auth/zeus.auth';
import '../../../../static/lib/service/auth/all';
import '../../../../static/lib/service/blend/collegeService';
import "../../../../static/lib/service/blend/facultyService";
import '../../../../static/lib/service/auth/all';
// 引入ulynlist插件
import '@share/ulynlist/ulynlist';
import '@share/ulynlist/ulynlist.table';
import '@share/ulynlist/ulynlist.pagebar';
import '@share/ulynlist-ext';

export default class CollegeModal extends Component {
    constructor(props) {
        super(props);
        // 初始化状态
        this.state = {
            isAddCollegeInput: false,
        }
    }
    // 生命周期， 组件更新后
    componentDidUpdate(prevProp, prevState) {
        if (prevProp.isCollegeModal === false) {
            this.tableInitCollegeModel();
        }
    }
    // 保存学院列表
    handleSaveAllCollegeList() {
        let that = this;
        let collegeValueArr = [];
        $(".currentCollegeValue").each((index, item) => {
            if (!!$(item).data("id")) {
                let collegeJson = {
                    id: $(item).data("id"),
                    name: $(item).text()
                }
                collegeValueArr.push(collegeJson);
            } else {
                let collegeJson = {
                    id: "",
                    name: $(item).text()
                }
                collegeValueArr.push(collegeJson);
            }

        })
        let sendData = {
            collegeId: that.props.collegeId,
            data: collegeValueArr
        }
        eos.college.facultyService.updateFaculty(sendData, data => {
            if (data.status == 200) {
                that.props.closeCollege();
            } else {
                that.props.showErrorModal(data.message)
            }
        })
    }
    // 学院信息表格初始化
    tableInitCollegeModel() {
        let that = this;
        function collegeCtr() {
            $(".college-add-input").parents("tr").hide();
            $(".btn-college-edit").unbind('click').on("click", function () {
                let currentValue = $(this).parents("tr").find(".currentCollegeValue").text();
                $(this).parents("tr").find(".college-edit-input").val(currentValue).show().siblings().hide();
                $(this).siblings(".jsSaveCurrentCollege").show().siblings().hide();
            })
            $(".jsSaveCurrentCollege").unbind('click').on("click", function () {
                let inputValue = $(this).parents("tr").find(".college-edit-input").val();
                $(this).parents("tr").find(".college-edit-input").hide().siblings().text(inputValue).show();
                $(this).siblings().show().end().hide();
            })
            $(".js_delete_currentCollege").unbind('click').on("click", function () {
                $(this).parents("tr").remove();
            })
            $(".js-add-college").unbind('click').on("click", function () {
                let trLen = $("#js-table__college_model").find("tr").length - 1;
                $(".college-add-input").parents("tr").show().children().eq(0).text(trLen);
                that.setState({
                    isAddCollegeInput: true
                })
            })
            $(".js_saveAllCollege").unbind('click').on("click", function () {
                var editInputLen = $(".college-edit-input:visible").length;
                
                if (that.state.isAddCollegeInput === true || editInputLen != 0) {
                    console.log("我执行了")
                    // that.setState({
                    //     showTipsModel: true
                    // })
                    that.props.showSaveTips();
                    // that.handleSaveAllCollegeList();
                } else {
                    // that.handleSaveAllCollegeList();
                    that.handleSaveAllCollegeList();
                }
            })
        }
        let { history } = this.props;
        let opts = {
            basePath: "node_modules/@share/ulynlist-ext",
            tableTpl: "share",
            tableColumn: {
                title: 'ulynlist',
                rememberCheckbox: true,
                keyColumn: "",
                columns: [
                    {
                        field: 'name', label: '院系名称', overflowview: 'normal', className: "unSortable", width: "80%",
                        tableTransFunc(value, item) {
                            if (item.name) {
                                return `
                                    <span class="currentCollegeValue" data-id=${item.id}>${item.name}</span>
                                    <input class="college-edit-input" type="text" placeholder="请输入" style="width:100%;display:none;" class="form-control">
                                `
                            } else if (item.isInput) {
                                return `<input class="college-add-input" type="text" placeholder="请输入" style="width:100%;" class="form-control">`
                            }
                        }
                    },
                    {
                        field: 'operate', label: '操作', className: "unSortable", width: "100px", hideTitle: "true",
                        tableTransFunc(value, item) {
                            if (!!item.id) {
                                if (item.id === "isAddInput") {
                                    return `
                                    <a class="jsAddCurrentCollege table_do_a btn_view btn-college-model" href="javascript:void(0)">完成</a>
                                    `
                                }
                                return `
                                        <a class="table_do_a btn_view table-delete js_delete_currentCollege" data-id=${item.id} href="javascript:void(0)">删除</a>
                                        <a class="table_do_a btn_view btn-college-model btn-college-edit" data-id=${item.id} href="javascript:void(0)">编辑</a>
                                        <a style="display:none;" class="jsSaveCurrentCollege table_do_a btn_view btn-college-model" href="javascript:void(0)">完成</a>
                                        `
                            }
                        }
                    }
                ],
                rownumbers: true,
            },
            afterTableRender: () => {
                collegeCtr();
                $(".jsAddCurrentCollege").on("click", function () {

                    that.setState({
                        isAddCollegeInput: false
                    })
                    let addValue = $(this).parents("tr").find("input").val();
                    $(this).parents("tr").hide().find("input").val("");
                    if (!addValue) {
                        return;
                    }
                    let length = $("#js-table__college_model").find("tr").length - 1;
                    let addDomStr = `
                    <tr style="" class=" ">
                        <td class="td_common td_color_dark">${length}</td>
                        <td class="td_common td_color_light" style="" title="${addValue}">
                            <span class="td_val" overflowview="normal">
                                <span class="currentCollegeValue">${addValue}</span>
                                <input class="college-edit-input" type="text" placeholder="请输入" style="width:100%;display:none;">
                            </span>
                        </td>
                        <td class="td_common td_color_dark" style="">
                            <span class="td_val" overflowview="">
                                <a class="table_do_a btn_view table-delete js_delete_currentCollege" data-id="1" href="javascript:void(0)">删除</a>
                                <a class="table_do_a btn_view btn-college-model btn-college-edit" data-id="1" href="javascript:void(0)">编辑</a>
                                <a style="display:none;" class="jsSaveCurrentCollege table_do_a btn_view btn-college-model" href="javascript:void(0)">完成</a>
                            </span>
                        </td>
                    </tr>`;
                    let addDom = $(addDomStr)
                    $(this).parents("tr").before(addDom);
                    // eos.college.facultyService.addFaculty(that.state.currentCollegeId, addValue);
                    collegeCtr();
                })
            },
            //请求数据传递的参数
            requestData: {

            },
            customAjax: (requestData, callback) => {
                eos.college.collegeService.findCollegeFaculty(that.props.collegeId, data => {
                    let currentdata = data.data;
                    currentdata.push({
                        isInput: true,
                        id: "isAddInput"
                    })
                    data = {
                        ...data,
                        data: {
                            list: currentdata
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
        $("#js-table__college_model").ulynlist(opts);
    }
    // 渲染jsx
    render() {
        return (
            <Modal bsSize="small" show={this.props.isCollegeModal} onHide={this.props.closeCollege}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: "bold" }}>院系信息</Modal.Title>
                </Modal.Header>
                <Modal.Body onlyText full>
                    <div id="js-table__college_model"></div>
                </Modal.Body>
                <Modal.Footer className="clearfix">
                    <Button className="pull-left js-add-college">新增院系</Button>
                    <Button className="pull-right js_saveAllCollege" bsStyle="primary" onClick={this.close}>保存</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
// 属性检测
CollegeModal.propTypes = {
    closeCollege: PropTypes.func.isRequired,
    collegeId: PropTypes.string.isRequired,
    isCollegeModal: PropTypes.bool.isRequired,
    showErrorModal: PropTypes.func.isRequired,
    showSaveTips: PropTypes.func.isRequired
}
