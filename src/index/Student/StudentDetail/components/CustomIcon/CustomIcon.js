import React, { Component } from 'react';
import classnames from "classnames";

class CustomIcon extends Component {
    render() {
        let { color, type, fontName, bsSize, shape, style, ...props } = this.props;
        let colors = [
            '#FF6655', '#0099dd', '#74767A','#FFAA33','#00BB88','#00CCEE'
        ];
        let backgroundColor = '';
        if (type === "1") {
            backgroundColor = color || this.random(colors);
            color = "#fff";
        } else {
            color = color || this.random(colors);
        }

        let styles = {
            ...style,
            color: color,
            backgroundColor: backgroundColor
        },

            classname = classnames('fa', `${fontName}`, `fa-${bsSize}`);

        if (shape === "circular") {
            styles.borderRadius = "50%"
        } else {
            styles.borderRadius = "0"
        }
        return (
            <i {...props} style={styles} className={classname}></i>
        );
    }
    random(colors) {
        var index = Math.floor((Math.random() * colors.length));
        return colors[index];
    }
}
// CustomIcon.defaultProps = {
//     background: "#fff"
// }
CustomIcon.propTypes = {
    bsSize: React.PropTypes.string,
    color: React.PropTypes.string,
    background: React.PropTypes.string
}

export default CustomIcon;