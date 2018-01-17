import ajaxMoudule from "./ajax";
import tools from "./tools";

const Ajax = ajaxMoudule.Ajax;

function promiseAjax(url, datas = "") {
    return new Promise((resolve, reject) => {
        new Ajax({
            url: url,
            data: datas,
            success(res, obj) {
                resolve(res);
            },
            error(XML, textStatus, errorThrown) {
                reject(XML, textStatus, errorThrown);
            }
        }).ajax();
    });
}

exports.ls = (path) => {
    console.log("刷新");
    return new Promise((resolve, reject) => {
        promiseAjax("/fs/ls", path).then((data) => {
            //排序
            let res_dir = [];
            let res_file = [];
            for (let k in data) {
                if (!data[k].isFile) {
                    res_dir.push(data[k]);
                } else {
                    res_file.push(data[k]);
                }
            }
            let newRes = res_dir.sort().concat(res_file.sort());
            resolve(newRes);
        }, (XML) => {
            if (XML.status == 401 || XML.status == 403) {
                tools.popWindow("非法 的访问操作，权限不足，请重新登陆！");
            }
        });
    });
};

exports.mkdir = (newName) => {
    console.log("新建目录");
    return promiseAjax("/fs/mkdir", newName);
};

exports.copy = (fileStack) => {
    console.log("复制");
    return promiseAjax("/fs/cp", fileStack);
};

exports.paste = () => {
    console.log("粘贴");
    return promiseAjax("/fs/patse");
};

exports.remove = (fileStack) => {
    console.log("删除");
    return promiseAjax("/fs/rm", fileStack);
};

exports.cponce = (fileStack) => {
    console.log("剪贴");
    return promiseAjax("/fs/ct", fileStack);
};

exports.rename = (filesStack, newName) => {
    console.log("重名名:", filesStack[0].name, "->", newName);
    if (filesStack.length == 1) {
        let oldName = filesStack[0].name;
        return promiseAjax("/fs/rename", {
            oldName: oldName,
            newName: newName
        });
    } else {
        tools.popWindow("非法操作，同时命名多个文件或未选择文件！");
    }

};


exports.upload = (file, progress) => { //$("#m-upload-file")[0].files[0]
    if (typeof FormData != "function") {
        tools.popWindow("很遗憾，您的浏览器不兼容异步文件上传。请使用现代浏览器！");
        return null;
    }
    var oMyForm = new FormData();
    oMyForm.append("time", new Date().toUTCString());
    oMyForm.append("upload_file", file);
    return new Promise((resolve, reject) => {
        var oReq = new XMLHttpRequest();
        oReq.open("POST", "/fs/upload", true);
        oReq.onload = function (oEvent) {
            if (oReq.status == 200) {
                resolve("Done");
            } else {
                reject(oReq.status);
            }
        };
        oReq.upload.addEventListener("progress", (evt) => {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            progress(percentComplete);
        }, false);
        oReq.send(oMyForm);
    });
};