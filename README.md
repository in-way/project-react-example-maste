# generator

> 项目描述

	react项目开发示例(以高校管理系统为基础)

## 项目规范

> 项目结构说明


	|-- config // webpack配置目录
	    |-- base.js // 基础配置
	    |-- dev.js // 开发环境webpack配置
	    |-- prod.js // 生产环境webpack配置
	|-- src
	    |-- index  // spa单页应用页面,每个SPA只有一个html入口,子页面由react路由控制
	        |-- main.js // react webapp入口文件
	        |-- index.html // 负责引入js的html文件
	        |-- Router.js // 路由配置文件
	        |-- College // 学院页面目录
	            |-- CollegeDetail // 学院详情页面文件夹
	                |-- components // 只在当前组件当中使用的局部组件
	                |-- image // 用于存放当前组件图片的文件夹
	                |-- CollegeDetails.js // 组件 大驼峰命名 与目录保持一致
	                |-- CollegeDetail.scss // sass文件 大驼峰命名 与目录保持一致
	            |-- ...
	        |-- student // 学生页面目录
	            |-- ...
		|-- map // 地图相关页面.暂时未整合进入shareUI组件当中,后期会加入shareUI组件
	    |-- otherIndex // 其他spa页面
	    |-- static // 图片、sass、js插件等全局静态文件,第三方插件
	        |-- css
	        |-- image
	        |-- lib
	        |-- sass
	        ...
	    |-- utils // 封装的常用的方法
	    |-- components // 全局组件
	    |-- favico.ico // favico.ico(非生产文件，可以不用管)
	|-- .gitignore // git忽略文件配置
	|-- .npmrc // npm配置
	|-- package.json // 安装包管理文件
	|-- README.md // markdown
	|-- webpack.config.js // webpack配置文件


> 文件命名说明
- 命名统一采用驼峰式命名法
- 组件命名采用大驼峰命名其余文件采用小驼峰命名
> 变量命名
- 统一采用小驼峰命名
> 事件驱动函数命名(click,change等事件触发的函数)
- 统一采用 'handle' + '事件名'  ===> 例如: ``<div onClick={this.handleAddTodos.bind(this)}></div>``

## 项目构建
    
> 构建工具使用方法参考：http://

### 项目运行

```
npm run start       //启动项目，浏览器访问访问http://localhost:3000(默认)  访问端口可以在config文件夹的dev当中修改

注意: 跑项目的时候需要使用插件登陆后台,否则访问不到数据
```
    
### 项目打包

```
npm run build   //编译项目，编译到指定目录
```

## 更新日志

#### v1.0.0　2017-09-20

- 【新增】初稿,代码规范还在完善中

