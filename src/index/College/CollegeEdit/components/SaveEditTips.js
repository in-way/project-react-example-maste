// react基础依赖
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// 引入shareUI
import {
    Modal,
    Button
} from '@share/shareui';

export default class SaveEditTips extends Component {
    render() {
        return (
            <Modal bsSize="small" show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>提示</Modal.Title>
                </Modal.Header>
                <Modal.Body onlyText>
                    <p>您有尚未保存的编辑,确认放弃该编辑直接保存吗？</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>关闭</Button>
                    <Button bsStyle="primary" onClick={this.props.stillClose}>确定</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
// 属性检测
SaveEditTips.propTypes = {
    close: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    stillClose: PropTypes.func.isRequired
}
