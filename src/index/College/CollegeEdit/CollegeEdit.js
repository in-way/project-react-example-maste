// 引入样式文件
import "./CollegeEdit.scss";
// 引入react基础依赖
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// 引入服务依赖
import '../../../static/lib/service/building/addressAssistService';

// 引入share-ui所需组件
import {
    Grid,
    Row,
    Col,
    Button,
    Modal
} from '@share/shareui';

// 引入组件
import CollegeInfo from "./components/CollegeInfo"
import CollegeTable from "./components/CollegeTable"
import CollegeModal from "./components/CollegeModal"
import SaveEditTips from "./components/SaveEditTips"
import MajarModal from "./components/MajarModal"
import ImportErrorModal from "./components/ImportErrorModal"
import ConfirmSaveTips from "./components/ConfirmSaveTips"
import SuccessTips from "./components/SuccessTips"
import ErrorTips from "./components/ErrorTips"
import TipsModal from "./components/TipsModal"


import Map from '../../../map/index'


class CollegeEdit extends Component {

    constructor(props) {
        super(props);
        // 引入路由参数match
        let { match } = props;
        // 初始化状态
        this.state = {
            warningTipsInfo: {
                failList: []
            },
            showWarningStatus: false,
            successTipsInfo: "",
            showSuccessStatus: false,
            showCollegeModal: false,
            showDepartmentsModal: false,
            currentCollege: "",
            currentCollegeId: match.params.collegeId,
            currentDepartmentsId: "",
            collegeInfo: {},
            showSuccessModal1: false,
            showCancelModel: false,
            isAddCollegeInput: false,
            showTipsModel: false,
            isAddMajorsInput: false,
            showTipsModel1: false,
            eidtTipsInfo: "",
            errorInfo: "",
            errorTipModal: false,
            eidtTipsModel: false
        };

        this.handleCloseCollege = this.handleCloseCollege.bind(this);
        this.handleErrorTipClose = this.handleErrorTipClose.bind(this);
        this.handleCloseDepartments = this.handleCloseDepartments.bind(this);
    }
    /*=== 生命周期 start ====*/
    // 组件DOM更新前
    componentWillUpdate() {
        $("#importCollege").replaceWith('<input class="importCollege" type="file" id="importCollege" name="file" />');
    }
    /*=== 生命周期 end ====*/
    // 关闭编辑提示框
    handleCloseEidtTipsModel() {
        this.setState({
            eidtTipsModel: false
        })
    }
    // 关闭错误提示框
    handleErrorTipClose() {
        this.setState({
            errorTipModal: false
        })
    }
    // 关闭成功提示框
    handleCloseSuccess() {
        let { history } = this.props;
        this.setState({
            showSuccessModal1: false
        })
        // 返回上一个路由
        history.go(-1);
    }
    // 关闭成功提示框
    handleCloseSuccessOnly() {
        this.setState({
            showSuccessModal1: false
        })
    }
    // 关闭学院编辑模态框并刷新表格
    handleCloseCollege() {
        this.setState({
            showCollegeModal: false
        });
        $('#js-table').trigger('refresh');
    }
    // 关闭编辑专业信息模态框
    handleCloseDepartments() {
        this.setState({
            showDepartmentsModal: false
        });
        $('#js-table').trigger('refresh');
    }
    // 关闭警告提示框并刷新表格数据
    handleCloseWarningStatus() {
        this.setState({
            showWarningStatus: false
        });
        $('#js-table').trigger('refresh');
    }
    // 关闭成功提示框
    handleCloseSuccessStatus() {
        this.setState({
            showSuccessStatus: false
        })
    }
    // 关闭提示框
    handleCloseTips1() {
        this.setState({
            showTipsModel1: false
        })
    }
    // 关闭提示框和编辑框并且关闭编辑状态
    handleStillCloseTips1() {
        this.setState({
            isAddMajorsInput: false,
            showTipsModel1: false,
            showDepartmentsModal: false
        })
    }
    // 关闭提示框
    handleCloseTips() {
        this.setState({
            showTipsModel: false
        })
    }
    // 关闭学院编辑状态并且关闭提示框
    handleStillCloseTips() {
        this.setState({
            isAddCollegeInput: false,
            showTipsModel: false
        })
    }
    // 关闭取消模态框 并且返回上一个路由
    handleIsCancelModel() {
        let { history } = this.props;
        this.setState({
            showCancelModel: false
        })
        history.go(-1);
    }
    // 关闭取消提示框
    handleCancelModel() {
        this.setState({
            showCancelModel: false
        })
    }
    // 返回上一个页面
    handleCancelEdit() {
        let { history } = this.props;
        history.go(-1);
    }
    // 显示成功提示
    showSuccessTips1() {
        this.setState({
            showSuccessModal1: true
        })
    }
    // 显示编辑提示
    showEditTips(info) {
        this.setState({
            eidtTipsInfo: info,
            eidtTipsModel: true
        })
    }
    // 显示成功提示
    showTableSuccessTips(info) {
        this.setState({
            showSuccessStatus: true,
            successTipsInfo: info
        })
    }
    // 显示警告提示
    showTableWarningTips(info) {
        this.setState({
            showWarningStatus: true,
            warningTipsInfo: info
        })
    }
    // 改变专业数据
    changeDepartmentState(json, callback) {
        this.setState({
            showDepartmentsModal: true,
            ...json
        })
        callback();
    }
    // 显示保存学院提示框
    showSaveCollegeTips() {
        this.setState({
            showTipsModel: true
        })
    }
    // 显示学院模态框
    handleCollegeModelShow() {
        this.setState({
            showCollegeModal: true
        });
    }
    // 显示错误提示框
    showErrorModal(data) {
        this.setState({
            errorTipModal: true,
            errorInfo: data
        })
    }
    // 渲染虚拟dom
    render() {
        return (
            <div className="ui-box collegeEditPage">
                <Grid className="p0" fluid={true}>
                    <Row className="school-info-top">
                        <Col sm={6}>
                            <CollegeInfo 
                                showSuccessTips={this.showSuccessTips1.bind(this)} 
                                showTips={this.showEditTips.bind(this)} 
                                collegeId={this.state.currentCollegeId} />
                        </Col>
                        <Col className="map-box" sm={6}>
                            <Map className="noToolBar noToggleMap noZoomSlider"
                                mapAction={[
                                    {
                                        type: "showPolygon",
                                        data: { source: this.state.mapInfo },
                                        focus: true
                                    }
                                ]}
                            />
                        </Col>
                    </Row>
                </Grid>
                <Grid className="p0" fluid={true}>
                    <Row>
                        <Col sm={12}>
                            <CollegeTable
                                 showWarning={this.showTableWarningTips.bind(this)} showMajarModal={this.changeDepartmentState.bind(this)} showSuccess={this.showTableSuccessTips.bind(this)} showTips={this.showEditTips.bind(this)} collegeId={this.state.currentCollegeId} showCollegeModal={this.handleCollegeModelShow.bind(this)}></CollegeTable>
                        </Col>
                    </Row>
                </Grid>
                <div className="text-right">
                    <Button 
                        bsSize="large" 
                        type="button" 
                        onClick={this.handleCancelEdit.bind(this)}>返回</Button>
                </div>
                <CollegeModal
                    showErrorModal={this.showErrorModal.bind(this)} 
                    collegeId={this.state.currentCollegeId} 
                    showSaveTips={this.showSaveCollegeTips.bind(this)} 
                    isCollegeModal={this.state.showCollegeModal} 
                    closeCollege={this.handleCloseCollege}
                />

                <MajarModal 
                    showErrorModal={this.showErrorModal.bind(this)} 
                    close={this.handleCloseDepartments.bind(this)} 
                    collegeName={this.state.currentCollege} 
                    showSaveTips={this.showSaveCollegeTips.bind(this)} 
                    majarId={this.state.currentDepartmentsId} 
                    id={this.state.currentCollegeId} 
                    show={this.state.showDepartmentsModal} 
                />

                <ConfirmSaveTips 
                    show={this.state.showSuccessModal1} 
                    closeSuccess={this.handleCloseSuccess.bind(this)} 
                    close={this.handleCloseSuccessOnly.bind(this)} 
                />

                <SuccessTips 
                    show={this.state.showSuccessStatus} 
                    close={this.handleCloseSuccessStatus.bind(this)} 
                    info={this.state.successTipsInfo} 
                />

                <ImportErrorModal 
                    info={this.state.warningTipsInfo} 
                    show={this.state.showWarningStatus} 
                    close={this.handleCloseWarningStatus.bind(this)} 
                />

                <ErrorTips 
                    show={this.state.errorTipModal} 
                    close={this.handleErrorTipClose} 
                    info={this.state.errorInfo} 
                />

                <SaveEditTips 
                    close={this.handleCloseTips.bind(this)} 
                    show={this.state.showTipsModel} 
                    stillClose={this.handleStillCloseTips.bind(this)} 
                />

                <TipsModal 
                    show={this.state.eidtTipsModel} 
                    close={this.handleCloseEidtTipsModel.bind(this)} 
                    info={this.state.eidtTipsInfo} 
                />

                <Modal 
                    bsSize="small" 
                    show={this.state.showCancelModel} 
                    onHide={this.handleCancelModel.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>取消编辑</Modal.Title>
                    </Modal.Header>
                    <Modal.Body onlyText>
                        <p>是否放弃并返回列表</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleCancelModel.bind(this)}>关闭</Button>
                        <Button bsStyle="primary" onClick={this.handleIsCancelModel.bind(this)}>确定</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(CollegeEdit);