/**
 * Created by Administrator on 2017/8/15.
 */
export const getQueryString = function(location, name){
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if(location.search.indexOf("?")==-1 || location.search.indexOf(name+'=')==-1)
    {
        return '';
    }

    // 获取链接中参数部分
    var queryString = location.search.substring(location.search.indexOf("?")+1);
    queryString = queryString.replace(/#.*$/, '');
    // 分离参数对 ?key=value&key2=value2
    var parameters = queryString.split("&");

    var pos, paraName, paraValue;
    for(var i=0; i<parameters.length; i++)
    {
        // 获取等号位置
        pos = parameters[i].indexOf('=');
        if(pos == -1) { continue; }

        // 获取name 和 value
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
        if(paraName == name)
        {
            return decodeURIComponent(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
};

export const getQueryUrlString = function(location, name){
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空
    if(location.indexOf("?")==-1 || location.indexOf(name+'=')==-1)
    {
        return '';
    }

    // 获取链接中参数部分
    var queryString = location.substring(location.indexOf("?")+1);
    queryString = queryString.replace(/#.*$/, '');
    // 分离参数对 ?key=value&key2=value2
    var parameters = queryString.split("&");

    var pos, paraName, paraValue;
    for(var i=0; i<parameters.length; i++)
    {
        // 获取等号位置
        pos = parameters[i].indexOf('=');
        if(pos == -1) { continue; }

        // 获取name 和 value
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        // 如果查询的name等于当前name，就返回当前值，同时，将链接中的+号还原成空格
        if(paraName == name)
        {
            return decodeURIComponent(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
};

export const toDisDate = function(dateStr, formatType){
    if (!dateStr || dateStr.length < 6 || dateStr.length > 14)
    {
        return dateStr;
    }
    else
    {
        var charArr = [];
        switch (formatType)
        {
            case "HY":
                charArr = ['-', '-', ' ', ':', ':'];
                break;
            case "DOT":
                charArr = ['.', '.', ' ', ':', ':'];
                break;
            case "CN":
                charArr =['年', '月', '日', ':', ':'];
                break;
            case "XX":
                charArr = ['/', '/', '', ':', ':'];
                break;
            default:charArr =['-', '-', ' ', ':', ':'];
        }
        try
        {
            dateStr = dateStr.replace(/ /g,"").replace(/-/g,"").replace(/:/g,"");
            switch (dateStr.length)
            {
                case 6:
                    dateStr = dateStr.substr(0,4) + charArr[0] + dateStr.substr(4,2);
                    break;
                case 8:
                    dateStr = dateStr.substr(0,4) + charArr[0] + dateStr.substr(4,2) + charArr[1] + dateStr.substr(6,2);
                    break;
                case 10:
                    dateStr = dateStr.substr(0,4) + charArr[0] + dateStr.substr(4,2) + charArr[1] + dateStr.substr(6,2) + charArr[2] + dateStr.substr(8,2);
                    break;
                case 12:
                    dateStr = dateStr.substr(0,4) + charArr[0] + dateStr.substr(4,2) + charArr[1] +
                        dateStr.substr(6,2) + charArr[2] + dateStr.substr(8,2) + charArr[3] + dateStr.substr(10,2);
                    break;
                case 14:
                    dateStr = dateStr.substr(0,4) + charArr[0] + dateStr.substr(4,2) + charArr[1] +
                        dateStr.substr(6,2) + charArr[2] + dateStr.substr(8,2) + charArr[3] + dateStr.substr(10,2) +
                        charArr[4] + dateStr.substr(12,2) ;
                    break;
                default:
                    return dateStr;
            }
            return dateStr;
        }
        catch (ex)
        {
            return dateStr;
        }
    }
}

/**
 * 根据多个表码名获取表码值，并缓存表码
 * @param bmNameArr
 * @returns {*|Promise}
 */
window.__cacheBm = {};    //存储缓存的表码
export const getBmData = (bmNameArr) => {
    let promiseArr = [];
    let arr = [];
    let obj = {};   //最终返回的结果
    for(let i = 0; i < bmNameArr.length; i++){
        let bmName = bmNameArr[i].split('.');
        arr.push(bmName[bmName.length - 1]);
        if(window.__cacheBm[bmNameArr[i].toString()]){
            promiseArr.push(Promise.resolve(window.__cacheBm[bmNameArr[i].toString()]));
        }else{
            promiseArr.push(eos.auth.dmService.getAllData(bmNameArr[i]));
        }
    }
    return new Promise(function(resolve, reject){
        Promise.all(promiseArr).then(function(data){
            for(let j = 0; j < data.length; j++){
                window.__cacheBm[arr[j]] = data[j];
                obj[arr[j]] = data[j];
            }

            resolve(obj);
        });
    });
};

/**
 * 批量转换时间格式2016-12-12 => 20161212000000
 * @param fieldNameArr  属性名成数组
 * @param obj
 * @returns {*}
 */
// export const timeToStr = (fieldNameArr, obj) => {
//     for(let i = 0; i < fieldNameArr.length; i++){
//         let name = fieldNameArr[i];
//         obj[name] = obj[name] ? obj[name].replace(/-/g, '') : '';
//     }
//
//     return obj;
// };
export const timeToStr = (timeStr) => {
    if(!timeStr) return '';
    return timeStr.replace(/-/g, '');
};

export const checkSFZH = function (ID) {
    ID = $.trim(ID);
    if(!ID) return true;
    if(typeof ID !== 'string') return false;
    var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
    var d = new Date(birthday);
    var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
    var currentTime = new Date().getTime();
    var time = d.getTime();
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var sum = 0, i, residue;

    if(!/^\d{17}(\d|x)$/i.test(ID)) return false;
    if(city[ID.substr(0,2)] === undefined) return false;
    if(time >= currentTime || birthday !== newBirthday) return false;
    for(i=0; i<17; i++) {
        sum += ID.substr(i, 1) * arrInt[i];
    }
    residue = arrCh[sum % 11];
    if (residue !== ID.substr(17, 1)) return false;

    return true;
};