/**
 *  * Created by liaoyf on 2017/8/15 0015.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    FormControl,
    FormGroup,
    InputGroup,
    ListGroupItem,
    ListGroup,
    Icon,
    Select
} from '@share/shareui';

let timer = null;
let searching = false;

class FilterInput extends Component {
    constructor(props){
        super(props);

        this.state = {
            show: false,
            text: props.text,
            item: props.item,
            list: [],
            noData: false
        };

        this.selectAddress = this.selectAddress.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        let { show, text, item } = this.state;
        let { getDataList, level } = this.props;

        if((show && text !== prevState.text && text) || (prevState.show !== show && !prevState.show && text)){
            clearTimeout(timer);
            timer = setTimeout(() => {
                if(text){
                    getDataList(level, text, item)
                        .then(data => {
                            if(data.status === '200'){
                                this.setState({
                                    list: data.data
                                }, () => {
                                    $('#fiLoading').hide();
                                });
                            }
                        });
                }else{
                    this.setState({
                        list: []
                    }, () => {
                        $('#fiLoading').hide();
                    });
                }
            }, 600);
        }
    }

    componentWillReceiveProps(nextProps, nextState){
        let { text } = this.props;

        if(nextProps.text !== text){
            this.setState({
                text: nextProps.text
            });
        }
    }

    selectAddress(item){
        // $('#fiLoading').show();
        let { list } = this.state;
        let { onChange } = this.props;
        // let findIndex = collegeList.findIndex(cur => cur.code === item.code);
        // let findActiveIndex = collegeList.findIndex(cur => cur.active);
        let tmpList = JSON.parse(JSON.stringify(list));
        tmpList.map(cur => {
            if(cur.active){
                delete cur.active;
            }
            if(cur.code === item.code){
                cur.active = true;
                onChange(cur);
            }
        });
        this.setState({
            list: tmpList,
            item: item,
            text: item.name
        });
    }

    componentDidMount(){
        let { show } = this.state;

        $(document).on('click', () => {
            if(this.state.show){
                this.setState({
                    show: false
                });
            }
        });
        $(document).on('click', '.fiSearchBox', e => {
            e.stopPropagation();
        });
        $(this.inputRef).unbind('click').on('click', e => {
            e.stopPropagation();
            let { show } = this.state;

            this.setState({
                show: !show
            });
        })
    }

    keyDown(e){
        // let { collegeList } = this.state;
        // let DOWN_CODE = 40;
        // let UP_CODE = 38;
        //
        // if(collegeList.length <= 0) return;
        // let findIndex = collegeList.findIndex(cur => cur.active);
        // // console.info(findIndex);
        // if(findIndex !== -1){
        //     if(e.keyCode === DOWN_CODE){
        //         if(findIndex !== collegeList.length - 1){
        //             this.setState({
        //                 collegeList: [
        //                     ...collegeList.slice(0, findIndex),
        //                     {
        //                         ...collegeList[findIndex],
        //                         active: false
        //                     },
        //                     {
        //                         ...collegeList[findIndex + 1],
        //                         active: true
        //                     },
        //                     ...collegeList.slice(findIndex + 2)
        //                 ]
        //             });
        //         }else{
        //             this.setState({
        //                 collegeList: [
        //                     {
        //                         ...collegeList[0],
        //                         active: true
        //                     },
        //                     ...collegeList.slice(1)
        //                 ]
        //             });
        //         }
        //     }
        // }else{
        //     this.setState({
        //         collegeList: [
        //             {
        //                 ...collegeList[0],
        //                 active: true
        //             },
        //             ...collegeList.slice(1)
        //         ]
        //     });
        // }
    }

    render() {
        let {searchProps, ...props} = this.props;
        let { show, text, list } = this.state;

        return (
            <div className="fiBox">
                <FormControl inputRef={ref => this.inputRef = ref} className="searchInput" readOnly {...searchProps}/>
                {show && (
                    <div ref={fiSearchBox => this.fiSearchBox = fiSearchBox} className="fiSearchBox">
                        <FormGroup>
                            <InputGroup>
                                <FormControl value={text}
                                             autoFocus
                                             onKeyDown={this.keyDown.bind(this)}
                                             onChange={(e) => {
                                                 this.setState({
                                                     text: e.target.value
                                                 })
                                             }}/>
                                <InputGroup.Addon background={false}>
                                    <i className="fa fa-search"/>
                                </InputGroup.Addon>
                            </InputGroup>
                        </FormGroup>
                        <div className="fiResult">
                            <ListGroup>
                                {list.map(item => (
                                <ListGroupItem key={item.code} href="javascript: ;" active={item.active} onClick={() => this.selectAddress(item)}>
                                    <Icon className="S-share_com_position"/>
                                    <span>{item.name}</span>
                                </ListGroupItem>
                                ))}
                            </ListGroup>
                        </div>
                        <div id="fiLoading">
                            <span></span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

FilterInput.propTypes = {};
FilterInput.defaultProps = {};

export default FilterInput;