import './StudentDetail.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import '../../../static/lib/eos3/eos3.min';
import '../../../static/lib/service/auth/zeus.auth';
import '../../../static/lib/service/auth/all';
import '../../../static/lib/service/blend/studentService';

import {getQueryString,toDisDate} from '../../../utils';
import CustomIcon from './components/CustomIcon/CustomIcon';
let defaultPhoto = require("./image/ico_tx.jpg");


import {
    Link
} from 'react-router-dom';

import {
    Panel,
    Modal,
    Form,
    FormSearch,
    FormControl,
    Select,
    Button,
    Icon,
    FormItem,
    TextBadge,
    ButtonToolBar,
    Label
} from '@share/shareui';

class StudentDetail extends Component{

    constructor(props) {
        super(props);
        let { location } = props;

        this.state = {
            sfSelModal: false,
            delSuccessModal: false,
            photo:defaultPhoto,
            userName:'',
            wzState:'',
            xb:'',
            mz:'',
            gj:'',
            csrq:'',
            zjlx:'',
            lxdh:'',
            zjh:'',
            xxmc:'',
            ssyx:'',
            zy:'',
            xh:'',
            rxsj:'',
            bj:'',
            hjdz:'',
            xjzd:'',
            bz:'',
            zwjzdz:''
        };
        this.studentId = getQueryString(location, 'studentId');
        this.closeSureModal = this.closeSureModal.bind(this);
        this.closeConfirmModal = this.closeConfirmModal.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.delConfirm = this.delConfirm.bind(this);
    }

    componentWillMount() {
        this.getStudentInfo();
    }

    closeSureModal(){
        this.setState({
            delSuccessModal: false
        });
    }

    closeConfirmModal(){
        this.setState({
            sfSelModal: false
        });
    }

    showConfirm(studentId,history){
        this.setState({
            sfSelModal: true
        });
    }

    delConfirm(studentId,history){
        eos.college.studentService.delStudent(studentId,data => {
            console.info("删除：",data);
            if(data.status){
                this.setState({
                    delSuccessModal: true
                });
            }
        })
    }

    getStudentInfo(){
        eos.college.studentService.findStudent(this.studentId,data => {
            let studentInfo = data.data || {};
            console.info("studentInfo:",studentInfo);
            this.setState({
                photo:defaultPhoto,
                userName:studentInfo.xm,
                wzState:studentInfo.wzbzLabel,
                xb:studentInfo.xbLabel,
                mz:studentInfo.mzLabel,
                gj:studentInfo.gjLabel,
                csrq:toDisDate(studentInfo.csrq,'HY'),
                zjlx:studentInfo.zjlxLabel,
                lxdh:studentInfo.lxdh,
                zjh:studentInfo.zjhm,
                xxmc:studentInfo.college,
                ssyx:studentInfo.faculty,
                zy:studentInfo.specialty,
                xh:studentInfo.xh,
                rxsj:toDisDate(studentInfo.rxrq,'HY'),
                bj:studentInfo.bjmc,
                hjdz:studentInfo.hjdxz,
                xjzd:studentInfo.xzdxz,
                bz:studentInfo.bz,
                zwjzdz:studentInfo.zwjzdz
            })
        });
    }


    render(){
        let { history } = this.props;
        let { photo, userName, wzState, xb, mz, gj, csrq, zjlx, lxdh, zjh, xxmc, ssyx, zy, xh, rxsj, bj, hjdz, xjzd, bz, zwjzdz} = this.state;
        return (
            <div className="ui-box">
                <Panel>
                    <Panel.Body>
                        <div className="studentInfo clearfix">
                            <div className="pic pull-left">
                                <img src={photo} alt=""/>
                            </div>
                            <div className="infoList">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h3>{userName}<Label bsStyle="danger">{wzState}</Label></h3>
                                        <TextBadge href="#">
                                        </TextBadge>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4 list-group">
                                            <div className="list-item">
                                                <label>
                                                   <CustomIcon
                                                       bsSize="item"
                                                       color="#0099dd"
                                                       type="1"
                                                       shape="circular"
                                                       fontName="fa-venus-mars"
                                                   />性别：
                                                </label>
                                                <span className="textShow">{xb}</span>
                                            </div>
                                            <div className="list-item">
                                                <label>
                                                    <CustomIcon
                                                        bsSize="item"
                                                        color="#FFAA33"
                                                        type="1"
                                                        shape="circular"
                                                        fontName="fa-user"
                                                    />民族：
                                                </label>
                                                <span className="textShow">{mz}</span>
                                            </div>
                                            <div className="list-item">
                                                <label>
                                                    <CustomIcon
                                                        bsSize="item"
                                                        color="#74767A"
                                                        type="1"
                                                        shape="circular"
                                                        fontName="fa-flag"
                                                    />国籍(地区)：
                                                </label>
                                                <span className="textShow">{gj}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 list-group">
                                            <div className="list-item">
                                                <label>
                                                    <CustomIcon
                                                        bsSize="item"
                                                        color="#FF6655"
                                                        type="1"
                                                        shape="circular"
                                                        fontName="fa-calendar"
                                                    />出生日期：
                                                </label>
                                                <span className="textShow">{csrq}</span>
                                            </div>
                                            <div className="list-item">
                                                <label>
                                                    <CustomIcon
                                                        bsSize="item"
                                                        color="#00BB88"
                                                        type="1"
                                                        shape="circular"
                                                        fontName="fa-id-card"
                                                    />证件类型：
                                                </label>
                                                <span className="textShow">{zjlx}</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 list-group">
                                            <div className="list-item">
                                                <label>
                                                    <CustomIcon
                                                        bsSize="item"
                                                        color="#FF6655"
                                                        type="1"
                                                        shape="circular"
                                                        fontName="fa-phone"
                                                    />联系电话：
                                                </label>
                                                <span className="textShow">{lxdh}</span>
                                            </div>
                                            <div className="list-item">
                                                <label>
                                                    <CustomIcon
                                                        bsSize="item"
                                                        color="#00CCEE"
                                                        type="1"
                                                        shape="circular"
                                                        fontName="fa-vcard-o"
                                                    />证件号：
                                                </label>
                                                <span className="textShow">{zjh}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel.Body>
                </Panel>
                <Panel>
                    <Panel.Head title="学校信息"/>
                    <Panel.Body full>
                        <Form>
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label>学校</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{xxmc}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>所属院系</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{ssyx}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>专业</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{zy}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label>学号</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{xh}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>入学时间</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{rxsj}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>班级</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{bj}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                        </Form>
                    </Panel.Body>
                </Panel>
                <Panel>
                    <Panel.Head title="地址信息"/>
                    <Panel.Body full>
                        <Form>
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label>户籍地址</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{hjdz}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label>现居住址</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{xjzd}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label>备注</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{bz}</span>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Col itemClassName="warningItem">
                                        <FormItem.Label>在外居住地址</FormItem.Label>
                                        <FormItem.Content>
                                            <span className="textShow">{zwjzdz}<span className="text-default">（来源：社区基础数据采集）</span></span>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                        </Form>
                    </Panel.Body>
                </Panel>
                <ButtonToolBar>
                    <Button type="button" bsStyle="danger" onClick={this.showConfirm}>删除</Button>
                    <Button type="button" bsStyle="primary" onClick={(e) => {
                        history.push({
                            pathname: "/student/edit",
                            search: `studentId=${this.studentId}`
                        });
                    }}>编辑</Button>
                    <Button type="button" onClick={(e) => {
                        history.goBack();
                    }}>返回</Button>
                </ButtonToolBar>


                <Modal
                    bsSize="small"
                    show={this.state.sfSelModal}
                    onHide={this.closeConfirmModal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>删除提醒</Modal.Title>
                    </Modal.Header>
                    <Modal.Body onlyText>
                        <p>确定删除数据？</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeConfirmModal}>取消</Button>
                        <Button bsStyle="primary" onClick={(e) =>{this.delConfirm(this.studentId,history)}}>删除</Button>
                    </Modal.Footer>
                </Modal>

                <Modal bsSize="small" show={this.state.delSuccessModal} onHide={this.closeSureModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>操作提醒</Modal.Title>
                    </Modal.Header>
                    <Modal.Body validationState="success" message="删除成功" info="将返回列表页面">

                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={(e) => {
                        history.goBack();
                    }}>确定</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withRouter(StudentDetail);