import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class InfoPane extends Component {
    render() {
        let { collegeId, collegeLogo, collegeName, collegeType, collegeAddress, academyNum, majorNum, studentNum, defaultPic, history } = this.props;
        console.info("InfoPane...history", history);
        return (
            <div>
                <div className="info-detail clearfix">
                    <img src={collegeLogo ? (CONTEXT_PATH + '/resource' + collegeLogo) : defaultPic} className="detail-logo"/>

                    <div className="detail-content">
                        <h5>{collegeName}</h5>
                        <ul>
                            <li>
                                <i className="fa fa-th-large"/>
                                <span className="key key-type">类型：</span>
                                <span className="value value-type">{collegeType}</span>
                            </li>
                            <li>
                                <i className="fa fa-map-marker"/>
                                <span className="key key-address">地址：</span>
                                <span className="value value-address">{collegeAddress}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="info-total">
                    <ul className="clearfix">
                        <li>
                            <i className="fa fa-building"/>
                            <span className="key">院系：</span>
                            <span className="value value-academy">{academyNum}</span>
                        </li>
                        <li>
                            <i className="fa fa-book"/>
                            <span className="key">专业：</span>
                            <span className="value value-major">{majorNum}</span>
                        </li>
                        <li>
                            <i className="fa fa-users"/>
                            <span className="key">学生：</span>
                            <span className="value value-student" onClick={(e) => {
                                history.push({
                                    pathname: '/student/list',
                                    search: `collegeId=${collegeId}`
                                })
                            }}>{studentNum}<i className="fa fa-external-link"/></span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}

export default withRouter(InfoPane);