/**
 * 拆分路由配置
 * @ljp 2017-9-6
 */
import '@share/shareui-html';
import '@share/shareui-font/dist/style.css';
import 'select2/dist/css/select2.css';
import '../static/sass/college.scss';


import React from 'react';
import ReactDOM from 'react-dom';
import Router from "./Router";



import '../static/lib/eos3/eos3.min';
import { ajaxloading } from '../static/lib/ajaxloading';
eos.rewriteUrl('remote');
ajaxloading('eos3');

ReactDOM.render(
    <Router />,
    document.getElementById('root')
);


