import 'bootstrap-datetime-picker/css/bootstrap-datetimepicker.css';
import '../../../components/FilterInput/filterInput.scss';

import React, {Component} from 'react';
import {
    withRouter
} from 'react-router-dom';

import '../../../static/lib/eos3/eos3.min';
import '../../../static/lib/service/auth/all';
import '../../../static/lib/service/blend/collegeService';
import '../../../static/lib/service/blend/studentService';
import '../../../static/lib/service/blend/specialtyService';
import '../../../static/lib/service/building/addressAssistService';

import 'bootstrap-datetime-picker/js/bootstrap-datetimepicker';
import 'bootstrap-datetime-picker/js/locales/bootstrap-datetimepicker.zh-CN';
import {
    Panel,
    Form,
    FormItem,
    Button,
    FormControl,
    Select,
    Radio,
    DateTime,
    ButtonToolBar,
    TextTip,
    ListGroup,
    ListGroupItem,
    Icon,
    OverlayTrigger,
    Tooltip
} from '@share/shareui';
import FilterInput from '../../../components/FilterInput/FilterInput';
import {getQueryString, getBmData, toDisDate, timeToStr, checkSFZH} from '../../../utils';

const AddressAssistService = eos.building.addressAssistService;
const StudentService = eos.college.studentService;
const CollegeService = eos.college.collegeService;
const SpecialtyService = eos.college.specialtyService;
const Null = '_null';

class StudentEdit extends Component {
    constructor(props) {
        super(props);

        this.stuendId = getQueryString(props.location, 'studentId');
        let collegeId = getQueryString(props.location, 'collegeId');
        this.state = {
            id: this.studentId,
            submitting: false,
            specialtyId: Null,
            facultyId: Null,
            text: '',
            dzbh: '',
            collegeId: collegeId,
            collegeDisabled: collegeId
        };
        this.saveStudent = this.saveStudent.bind(this);
    }

    componentWillMount() {
        let {location} = this.props;
        Promise.all([
            getBmData([
                'DM_RK_ZJLX',
                'DM_RK_XB',
                'DM_RK_MZ',
                'DM_RK_GJ'
            ]),
            CollegeService.colleges()
        ]).then(result => {
            console.info(result);
            this.setState({
                ...result[0],
                DM_XX: result[1].data
            });
        });
        if(this.stuendId){
            StudentService.findStudent(this.stuendId , data => {
                if (data.status === '200') {
                    this.setState({
                        ...data.data,
                        csrq: toDisDate(data.data.csrq),
                        rxrq: toDisDate(data.data.rxrq)
                    });

                    this.findCollegeFaculty(data.data.collegeId);
                    this.findCollegeSpecialty(data.data.collegeId, data.data.facultyId);
                }
            });
        }
    }

    componentDidMount() {
        if(this.state.collegeId.length != 0) {
            this.findCollegeFaculty(this.state.collegeId);
        }
    }

    //获取所属院系
    findCollegeFaculty(collegeId) {
        if(!collegeId) return;
        CollegeService.findCollegeFaculty(collegeId)
            .then(data => {
                if (data.status === '200') {
                    this.setState({
                        DM_YX: data.data
                    });
                }
            });
    }

    //获取专业
    findCollegeSpecialty(collegeId, facultyId) {
        if(!collegeId || facultyId === Null) return;
        SpecialtyService.specialtyData(collegeId, facultyId)
            .then(data => {
                if (data.status === '200') {
                    this.setState({
                        DM_ZY: data.data
                    });
                }
            })
    }

    saveStudent(){
        let { history } = this.props;
        let student = {
            "id": this.state.id,
            "xm": this.state.xm,
            "zjlx": this.state.zjlxCode,
            "zjhm": this.state.zjhm,
            "xb": this.state.xbCode,
            "csrq": timeToStr(this.state.csrq),
            "mz": this.state.mzCode,
            "college": this.state.collegeId,
            "faculty": this.state.facultyId === Null ? '' : this.state.facultyId,
            "specialty": this.state.specialtyId === Null ? '' : this.state.specialtyId,
            "xh": this.state.xh,
            "rxrq": timeToStr(this.state.rxrq),
            "bjmc": this.state.bjmc,
            "lxdh": this.state.lxdh,
            "gj": this.state.gjCode,
            "fwbh": this.state.fwbh || '',
            "dzbh": this.state.dzbh,
            "hjdxz": this.state.hjdxz,
            "xzdxz": this.state.xzdxz,
            "bz": this.state.bz
        };
        this.setState({
            submitting: true
        });
        if(student.xm && student.zjlx &&
            (student.zjlx === '111' || student.zjlx === '112' ? checkSFZH(student.zjhm) : student.zjhm) &&
            student.xb && student.lxdh &&
            student.college && student.faculty !== Null && student.specialty !== Null && student.rxrq && student.hjdxz && student.xzdxz){
            console.info('保存学生：', student);
            StudentService.saveStudent(student).then(data => {
                if(data.status === '200'){
                    alert('保存成功！');
                    history.goBack();
                }else{
                    alert(data.message);
                }
            });
        }
    }

    render() {
        let { history } = this.props;
        let { submitting, collegeDisabled } = this.state;
        return (
            <div className="ui-box">
                <Panel>
                    <Panel.Head title="学生信息"/>
                    <Panel.Body full>
                        <Form scope="addPage">
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label required>姓名</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.xm && 'error'}>
                                            <FormControl value={this.state.xm || ''}
                                                         onChange={e => this.setState({xm: e.target.value})}/>
                                            {submitting && !this.state.xm && <TextTip>姓名不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label required>证件类型</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.zjlxCode && 'error'}>
                                            <div>
                                                <Select data={this.state.DM_RK_ZJLX || []}
                                                        value={this.state.zjlxCode || ''}
                                                        options={{
                                                            placeholder: ''
                                                        }}
                                                        onChange={e => {
                                                            this.setState({
                                                                zjlxCode: e.target.value
                                                            });
                                                        }}
                                                        fieldName={{id: 'code', text: 'label'}}/>
                                            </div>
                                            {submitting && !this.state.zjlxCode && <TextTip>证件类型不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label required>证件号</FormItem.Label>
                                        <FormItem.Content validationState={submitting && (!this.state.zjhm || (
                                            (this.state.zjlxCode === '111' || this.state.zjlxCode === '112') && !checkSFZH(this.state.zjhm)
                                        )) && 'error'}>
                                            <FormControl value={this.state.zjhm || ''}
                                                         onChange={e => this.setState({zjhm: e.target.value})}/>
                                            {submitting && !this.state.zjhm && <TextTip>证件号不能为空！</TextTip>}
                                            {submitting && (
                                            (this.state.zjlxCode === '111' || this.state.zjlxCode === '112') && !checkSFZH(this.state.zjhm)
                                            ) && <TextTip>身份证格式不正确！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label required>性别</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.xbCode && 'error'}>
                                            {(this.state.DM_RK_XB || []).map((item, index) => (
                                                <Radio key={index} name="jzdw"
                                                       value={item.code || ''}
                                                       checked={this.state.xbCode === item.code}
                                                       onChange={e => this.setState({xbCode: e.target.value})} inline>
                                                    {item.label}
                                                </Radio>
                                            ))}
                                            {submitting && !this.state.xbCode && <TextTip>性别不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label>出生日期</FormItem.Label>
                                        <FormItem.Content>
                                            <DateTime input1Props={{
                                                id: 'birthDay',
                                                value: this.state.csrq || '',
                                                changeDate: value => this.setState({csrq: value})
                                            }}/>
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>民族</FormItem.Label>
                                        <FormItem.Content>
                                            <Select data={this.state.DM_RK_MZ || []}
                                                    value={this.state.mzCode || ''}
                                                    onChange={e => {
                                                        this.setState({
                                                            mzCode: e.target.value
                                                        })
                                                    }}
                                                    options={{
                                                        placeholder: ''
                                                    }}
                                                    fieldName={{id: 'code', text: 'label'}}/>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label required>联系电话</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.lxdh && 'error'}>
                                            <FormControl value={this.state.lxdh || ''}
                                                         onChange={e => this.setState({lxdh: e.target.value})}/>
                                            {submitting && !this.state.lxdh && <TextTip>联系电话不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>国籍（地区）</FormItem.Label>
                                        <FormItem.Content>
                                            <Select data={this.state.DM_RK_GJ || []}
                                                    value={this.state.gjCode || ''}
                                                    options={{
                                                        placeholder: ''
                                                    }}
                                                    onChange={e => {
                                                        this.setState({
                                                            gjCode: e.target.value
                                                        })
                                                    }}
                                                    fieldName={{id: 'code', text: 'label'}}/>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                        </Form>
                    </Panel.Body>
                </Panel>
                <Panel>
                    <Panel.Head title="学校信息"/>
                    <Panel.Body full>
                        <Form scope="addPage">
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label required>学校</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.collegeId && 'error'}>
                                            <div>
                                                <Select data={this.state.DM_XX || []}
                                                    value={this.state.collegeId || ''}
                                                        options={{
                                                            allowClear: false
                                                        }}
                                                    onSelect={e => {
                                                        this.setState({
                                                            collegeId: e.target.value,
                                                            facultyId: Null,
                                                            specialtyId: Null,
                                                            DM_ZY: []
                                                        }, () => {
                                                            this.findCollegeFaculty(e.target.value);
                                                        });
                                                    }}
                                                    fieldName={{text: 'name'}}
                                                        disabled={collegeDisabled}
                                                />
                                            </div>
                                            {submitting && !this.state.collegeId && <TextTip>学校不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label required>所属院系</FormItem.Label>
                                        <FormItem.Content validationState={submitting && (this.state.facultyId === Null || !this.state.collegeId) && 'error'}>
                                            <div>
                                                <Select data={this.state.DM_YX || []}
                                                    value={this.state.facultyId || ''}
                                                        options={{
                                                            allowClear: false
                                                        }}
                                                        onSelect={e => {
                                                        this.setState({
                                                            facultyId: e.target.value,
                                                            specialtyId: Null
                                                        });
                                                        this.findCollegeSpecialty(this.state.collegeId, e.target.value);
                                                    }}
                                                    fieldName={{text: 'name'}}/>
                                            </div>
                                            {submitting && (this.state.facultyId === Null || !this.state.collegeId) && <TextTip>所属院系不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label required>专业</FormItem.Label>
                                        <FormItem.Content validationState={submitting && this.state.specialtyId === Null && 'error'}>
                                            <div>
                                                <Select data={this.state.DM_ZY || []}
                                                    value={this.state.specialtyId}
                                                        options={{
                                                            allowClear: false
                                                        }}
                                                        onSelect={e => {
                                                        this.setState({
                                                            specialtyId: e.target.value
                                                        })
                                                    }}
                                                    fieldName={{text: 'name'}}/>
                                            </div>
                                            {submitting && this.state.specialtyId === Null && <TextTip>专业不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label>学号</FormItem.Label>
                                        <FormItem.Content>
                                            <FormControl value={this.state.xh || ''}
                                                         onChange={e => this.setState({xh: e.target.value})}/>
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label required>入学时间</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.rxrq && 'error'}>
                                            <DateTime input1Props=
                                                          {{
                                                              id: 'rxrq',
                                                              value: this.state.rxrq || '',
                                                              changeDate: value => this.setState({rxrq: value})
                                                          }}
                                            >
                                            </DateTime>
                                            {submitting && !this.state.rxrq && <TextTip>入学时间不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>班级</FormItem.Label>
                                        <FormItem.Content>
                                            <FormControl value={this.state.bjmc || ''}
                                                         onChange={e => this.setState({bjmc: e.target.value})}/>
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
                        <Form scope="addPage">
                            <Form.Box>
                                <Form.Row>
                                    <Form.Col>
                                        <FormItem.Label required>户籍地址</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.hjdxz && 'error'}>
                                            <FormControl value={this.state.hjdxz || ''}
                                                         onChange={e => this.setState({hjdxz: e.target.value})}/>
                                            {submitting && !this.state.hjdxz && <TextTip>户籍地址不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                            <Form.Box>
                                <Form.Row className="specialItem">
                                    <Form.Col>
                                        <FormItem.Label required>
                                            <OverlayTrigger placement="right" overlay={
                                                <Tooltip id="tooltip">点击选择“路名”、“门牌“查询获取对应的地址！</Tooltip>
                                            }>
                                                <Icon className="fa-question-circle"/>
                                            </OverlayTrigger>现居住地址</FormItem.Label>
                                        <FormItem.Content validationState={submitting && !this.state.xzdxz && 'error'}>
                                            {/*<FormControl value={this.state.xzdxz || ''}
                                                         onChange={e => this.setState({xzdxz: e.target.value})}/>*/}
                                            <FilterInput searchProps={{
                                                value: this.state.xzdxz,
                                                placeholder: '点击搜索'
                                            }} onChange={item => this.setState({xzdxz: item.name, dzbh: item.code})}
                                                         getDataList={AddressAssistService.getDataList}
                                                         level="4"
                                                         text={this.state.xzdxz || ''}
                                                         item={{}}
                                            />
                                            {submitting && !this.state.xzdxz && <TextTip>现居住地址不能为空！</TextTip>}
                                        </FormItem.Content>
                                    </Form.Col>
                                    <Form.Col>
                                        <FormItem.Label>备注</FormItem.Label>
                                        <FormItem.Content>
                                            <FormControl value={this.state.bz || ''}
                                                         onChange={e => this.setState({bz: e.target.value})}/>
                                        </FormItem.Content>
                                    </Form.Col>
                                </Form.Row>
                            </Form.Box>
                            <Form.Box>
                                <Form.Row>
                                    {this.stuendId && (
                                        <Form.Col>
                                            <FormItem.Label>在外居住地址</FormItem.Label>
                                            <FormItem.Content>
                                                <span className="textShow">{this.state.zwjzdz || ''}</span>
                                            </FormItem.Content>
                                        </Form.Col>
                                    )}
                                    {this.stuendId && (
                                        <Form.Col>
                                            <FormItem.Label>来源</FormItem.Label>
                                            <FormItem.Content>
                                                <span className="textShow">社区基础数据采集</span>
                                            </FormItem.Content>
                                        </Form.Col>
                                    )}
                                </Form.Row>
                            </Form.Box>
                        </Form>
                    </Panel.Body>
                </Panel>
                <ButtonToolBar>
                    <Button type="button" bsStyle="primary" onClick={this.saveStudent}>保存</Button>
                    <Button type="button" onClick={e => {
                        history.goBack();
                    }}>取消</Button>
                </ButtonToolBar>
            </div>
        );
    }
}

export default withRouter(StudentEdit);