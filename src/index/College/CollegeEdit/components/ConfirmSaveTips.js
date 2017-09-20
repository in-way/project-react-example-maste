// react基础依赖
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// 引入shareui
import {
    Modal,
    Button,
    Icon
} from '@share/shareui';

export default class ConfirmSaveTips extends Component {
    render() {
        return (
            <Modal bsSize="small" show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>提交结果</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <Icon style={{ fontSize: "40px", color: "#0099dd" }} className="fa fa-question-circle"></Icon>
                        <p>确定保存当前信息吗？</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>关闭</Button>
                    <Button bsStyle="primary" onClick={this.props.closeSuccess}>确定</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
// 属性检测
ConfirmSaveTips.propTypes = {
    close: PropTypes.func.isRequired,
    closeSuccess: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
}
