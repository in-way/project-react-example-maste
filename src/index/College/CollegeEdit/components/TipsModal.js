// 引入react基础依赖
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Modal,
    Button
} from '@share/shareui';

export default class TipsModal extends Component {
    render() {
        return (
            <Modal bsSize="small" show={this.props.show} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>提示</Modal.Title>
                </Modal.Header>
                <Modal.Body onlyText>
                    <p>{this.props.info}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.props.close}>确定</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
// 属性检测
TipsModal.propTypes = {
    close: PropTypes.func.isRequired,
    info: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired
}
