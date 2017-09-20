import React, { Component } from 'react'
import {
    HashRouter as Router,
    Route,
    Redirect
} from 'react-router-dom';

import Bundle from '@share/bundle';
import loadCollegeList from 'bundle-loader?lazy&name=CollegeList!./College/CollegeList/CollegeList';
import loadCollegeDetail from 'bundle-loader?lazy&name=CollegeDetail!./College/CollegeDetail/CollegeDetail';
import loadCollegeEdit from 'bundle-loader?lazy&name=CollegeEdit!./College/CollegeEdit/CollegeEdit';
import loadCollegeHome from 'bundle-loader?lazy&name=CollegeHome!./College/CollegeHome/CollegeHome';
import loadStudentList from 'bundle-loader?lazy&name=StudentList!./Student/StudentList/StudentList';
import loadStudentDetail from 'bundle-loader?lazy&name=StudentDetail!./Student/StudentDetail/StudentDetail';
import loadStudentEdit from 'bundle-loader?lazy&name=StudentEdit!./Student/StudentEdit/StudentEdit';


let CollegeList = () => (
    <Bundle load={loadCollegeList}>
        {CollegeList => <CollegeList />}
    </Bundle>
);

let CollegeDetail = () => (
    <Bundle load={loadCollegeDetail}>
        {CollegeDetail => <CollegeDetail />}
    </Bundle>
);

let CollegeEdit = () => (
    <Bundle load={loadCollegeEdit}>
        {CollegeEdit => <CollegeEdit />}
    </Bundle>
);

let CollegeHome = () => (
    <Bundle load={loadCollegeHome}>
        {CollegeHome => <CollegeHome />}
    </Bundle>
);

let StudentList = () => (
    <Bundle load={loadStudentList}>
        {StudentList => <StudentList />}
    </Bundle>
);
let StudentDetail = () => (
    <Bundle load={loadStudentDetail}>
        {StudentDetail => <StudentDetail />}
    </Bundle>
);
let StudentEdit = () => (
    <Bundle load={loadStudentEdit}>
        {StudentEdit => <StudentEdit />}
    </Bundle>
);

export default class RouterWrap extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Redirect from='/' to='/college/list'/>
                    <Route path="/college/list" component={CollegeList} />
                    <Route path="/college/detail" component={CollegeDetail} />
                    <Route path="/college/edit/:collegeId" component={CollegeEdit} />
                    <Route path="/college/home" component={CollegeHome} />
                    <Route path="/student/list" component={StudentList} />
                    <Route path="/student/detail" component={StudentDetail} />
                    <Route path="/student/edit" component={StudentEdit} />
                </div>
            </Router>
        )
    }
}



