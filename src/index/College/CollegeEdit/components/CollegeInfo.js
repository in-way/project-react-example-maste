// 引入react基础依赖
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// 引入服务依赖
import '../../../../static/lib/eos3/eos3.min';
import '../../../../static/lib/service/auth/zeus.auth';
import '../../../../static/lib/service/blend/collegeService';

// 引入插件
import FilterInput from '../../../../components/FilterInput/FilterInput';
import '../../../../static/lib/ajaxfileupload';
// 引入shareUI
import {
    Panel,
    Form,
    FormItem,
    Button,
    Select,
    Icon,
    Tooltip,
    OverlayTrigger,
} from '@share/shareui';
// 定义图片，地址服务，地址提示
const defultPic = require('../../../../static/image/ico_default_sc.png'),
      AddressAssistService = eos.building.addressAssistService,
      tooltipAdress = (
          <Tooltip id="tooltip">点击选择"路名"、"门牌"查询获取对应地址</Tooltip>
      );

export default class CollegeInfo extends Component {
    constructor(props) {
        super(props);
        // 初始化状态
        this.state = {
            collegeInfo: {},
            collegeType: [],
            schooltypeId: "",
            eidtTipsInfo: "",
            eidtTipsModel: false
        }
    }
    // dom渲染完毕的生命周期
    componentDidMount() {
        this.initCollegeInfo();
        this.getCollegeType('DM_COLLEGE_TYPE');
        //监听上传头像
        $(document).on('change', '#file', e => {
            this.handleModifyPic();
        });
    }
    // 学院信息初始化
    initCollegeInfo() {
        var that = this;
        eos.college.collegeService.collegeDetail("", this.props.collegeId
            , data => {
                that.setState({
                    collegeInfo: data.data,
                    schooltypeId: data.data.typeId,
                    typeId: data.data.typeId,
                    mapInfo: [{
                        id: data.data.bzmid,
                        name: data.data.name
                    }]
                },()=>{
                    console.info("======>",that.state.collegeInfo)
                })
            })
    }
    // 获取学院类型
    getCollegeType(code) {
        eos.auth.dmService.getAllData(code, data => {
            let collegeType = [];
            data.map((item, index) => {
                collegeType.push({
                    id: item.code,
                    text: item.label
                })
            });
            this.setState({
                collegeType: collegeType
            })
        });
    }
    // 上传新学校标志
    handleModifyPic() {
        $.ajaxFileUpload(
            {
                url: CONTEXT_PATH + "/upload",
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'file', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json,
                success: function (data, status)  //服务器成功响应处理函数
                {
                    if (!/\.(gif|jpg|jpeg|bmp|png|GIF|JPG|PNG|BMP)$/.test(data.data[0].type)) {
                        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
                        return false;
                    }
                    //长度不能大于32
                    if (data.data[0].original.replace(data.data[0].type, '').length > 32) {
                        alert('图片名称不能超过32个字符！');
                        return false;
                    }
                    if (data.status) {
                        console.info('上传成功：', data);
                        $('#schollPic').attr('src', CONTEXT_PATH + '/resource' + data.data[0].url).data('url', data.data[0].url);
                    } else {
                        console.error("status:", data.msg);
                    }
                },
                error: function (data, status, e)//服务器响应失败处理函数
                {
                    alert(e);
                }
            }
        )
    }
    // 保存学校信息
    handleSaveCollegeInfo() {
        if (!this.state.schooltypeId || !this.state.collegeInfo.address) {
            this.props.showTips("填写的的信息不完整，请确保信息的完整性");
        } else {
            eos.college.collegeService.saveCollege({
                id: this.props.collegeId,
                typeId: this.state.schooltypeId,
                "dzbh": this.state.collegeInfo.dzbh,
                "address": this.state.collegeInfo.address,
                "iconUrl": $('#schollPic').data('url') || ''
            }, data => {
                if (data.status == 200) {
                    this.props.showSuccessTips();
                } else {
                    alert(data.message)
                }
            })
        }
    }
    // 渲染jsx
    render() {
        return (
            <Panel bsStyle="primary">
                <Panel.Head title="学校信息" />
                <Panel.Body full style={{ overflow: 'inherit' }}>
                    <Form scope="addPage">
                        <Form.Box>
                            <Form.Row>
                                <Form.Col>
                                    <FormItem.Label required>学校标志</FormItem.Label>
                                    <FormItem.Content className="school-mark-box">
                                        <div className="picBox clearfix">
                                            <div className="picWrap pull-left">
                                                <img id="schollPic" data-url={this.state.collegeInfo.iconUrl} src={this.state.collegeInfo.iconUrl ?
                                                    (CONTEXT_PATH + '/resource' + this.state.collegeInfo.iconUrl) : defultPic} alt="" />
                                                <input type="hidden" value={''} />
                                            </div>
                                            <div className="picTool pull-left">
                                                <button type="button"
                                                    className="btn btn-file btn-default">
                                                    修改标志
                                                <input type="file" id="file" name="file" />
                                                </button>
                                                <p className="text text-tip">支持jpg、jpeg、png、bmp格式</p>
                                            </div>
                                        </div>
                                    </FormItem.Content>
                                </Form.Col>
                            </Form.Row>
                            <Form.Row>
                                <Form.Col>
                                    <FormItem.Label required>高校名称</FormItem.Label>
                                    <FormItem.Content>
                                        <span className="textShow">{this.state.collegeInfo.name}</span>
                                    </FormItem.Content>
                                </Form.Col>
                            </Form.Row>
                            <Form.Row>
                                <Form.Col>
                                    <FormItem.Label required>高校类型</FormItem.Label>
                                    <FormItem.Content>
                                        <Select className="w-percent-80 form-control"
                                            data={this.state.collegeType}
                                            value={this.state.schooltypeId}
                                            options={{
                                                placeholder: '请选择'
                                            }}
                                            onChange={e => {
                                                this.setState({
                                                    schooltypeId: e.target.value
                                                })
                                            }}>
                                        </Select>
                                    </FormItem.Content>
                                </Form.Col>
                            </Form.Row>
                            <Form.Row className="specialItem">
                                <Form.Col>
                                    <FormItem.Label required>高校地址</FormItem.Label>
                                    <FormItem.Content>
                                        <FilterInput searchProps={{
                                            value: this.state.collegeInfo.address,
                                            placeholder: '点击搜索',
                                            className: "w-percent-80"
                                        }} onChange={item => this.setState({
                                            collegeInfo: {
                                                ...this.state.collegeInfo,
                                                address: item.name,
                                                dzbh: item.code
                                            }
                                        })}
                                            getDataList={AddressAssistService.getDataList}
                                            level="4"
                                            text={this.state.collegeInfo.address || ''}
                                            item={{}}
                                        />
                                        <OverlayTrigger placement="right" overlay={tooltipAdress}>
                                            <Icon style={{ marginTop: "10px" }} className="fa fa-question-circle"></Icon>
                                        </OverlayTrigger>
                                    </FormItem.Content>
                                </Form.Col>
                            </Form.Row>
                        </Form.Box>
                    </Form>
                </Panel.Body>
                <Panel.Footer>
                    <div className="btn-group pull-right">
                        <Button type="button" bsStyle="primary" onClick={this.handleSaveCollegeInfo.bind(this)}>保存</Button>
                    </div>
                </Panel.Footer>
            </Panel>
        )
    }
}
// 属性检测
CollegeInfo.propTypes = {
    collegeId: PropTypes.string.isRequired,
    showSuccessTips: PropTypes.func.isRequired,
    showTips: PropTypes.func.isRequired
}
