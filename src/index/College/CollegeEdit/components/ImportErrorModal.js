// 引入组件样式文件
import "../CollegeEdit.scss";
// 引入react基本依赖
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// 引入shareUI
import {
    Modal,
    Button,
    Icon,
    Paragraph
} from '@share/shareui';

// 引入服务依赖
import '../../../../static/lib/eos3/eos3.min';
import '../../../../static/lib/service/auth/zeus.auth';
import '../../../../static/lib/service/auth/all';
import '../../../../static/lib/service/blend/collegeService';
import "../../../../static/lib/service/blend/specialtyService";
import "../../../../static/lib/service/blend/facultyService";
import '../../../../static/lib/service/auth/all';
import '../../../../static/lib/service/building/addressAssistService';


export default class ImportErrorModal extends Component {
    render() {
        return (
            <Modal bsSize="small" show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>提示</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <Icon style={{ fontSize: "72px", color: "#ffaa33" }} className="fa fa-exclamation-circle"></Icon>
                        <p style={{ fontSize: "14px" }}><Paragraph inline={true} bsStyle="warning">部分数据导入失败</Paragraph>,共{this.props.info.totalNum}条，成功<Paragraph inline={true} bsStyle="success">{this.props.info.successNum}</Paragraph>条，失败<Paragraph inline={true} bsStyle="danger">{this.props.info.failNum}</Paragraph>条</p>
                    </div>
                </Modal.Body>
                <table className="share-table import">
                    <tbody>
                        <tr className="table_th">
                            <th>行号</th>
                            <th>院系名称</th>
                            <th>专业名称</th>
                            <th>失败原因</th>
                        </tr>
                        {
                            this.props.info.failList.map((item, index) => {
                                return (
                                    <tr>
                                        <td className="fail-info">{item.index}</td>
                                        <td>
                                            <span>{item.facName}</span>
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
                    <Button onClick={this.props.close}>关闭</Button>
                    <Button bsStyle="primary" onClick={this.props.close}>确定</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
// 属性检测
ImportErrorModal.propTypes = {
    close: PropTypes.func.isRequired,
    info: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
}
