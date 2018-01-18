//工具类

import swal from 'sweetalert2';

//弹出提示框
exports.popWindow = (data) => {
    console.log("弹出:", data);
    swal({
        title: "",
        text: '' + data,
        timer: 2000
    });
};

exports.confirm = (msg, callbackt, callbackf) => {
    swal({
        title: 'Are you sure?',
        text: msg,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(function (isConfirm) {
        if (isConfirm) {
            callbackt && callbackt();
        } else {
            callbackf && callbackf();
        }
    });
};

exports.prompt = (msg, callbackT, callbackF) => {
    swal({
        title: msg,
        input: 'text',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showLoaderOnConfirm: true,
        preConfirm: function () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 500);
            });
        },
        allowOutsideClick: false
    }).then((text) => {
        if (text && text.value)
            callbackT && callbackT(text.value);
        else
            callbackF && callbackF("");
    });
};

exports.encodeContext = (text) => {
    let tmp = new String(text);
    tmp = tmp.replace(/ /g, "&nbsp;");
    tmp = tmp.replace(/</g, "&lt;");
    tmp = tmp.replace(/>/g, "&gt;");
    // tmp = tmp.replace(/&/g, "&gt;");
    // tmp = tmp.replace(/\'/g, "&#39;");
    // tmp = tmp.replace(/\"/g, "&quit;");
    // tmp = tmp.replace(/\n/igm, "<>");
    return tmp;
};