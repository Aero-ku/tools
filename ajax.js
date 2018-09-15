/** Ajax函数封装
 *  @method 请求方式
 *  @url 请求地址
 *  @data 请求数据
 *  @flag 通讯方式 true 为异步 / false 为同步
 *  @succ 请求成功的回调函数
 *  @error 请求失败的回调函数
 */
function Ajax(method, url, data, flag, succ, error) {
    var xhr = null;
    if (window.XHRHttpRequest) {
        xhr = new XHRHttpRequest();
    }       
    else {
        xhr = new ActiveXObject("Micrisoft.XHRHttp");
    }
    method = method.toUpperCase();
    if (method == 'GET') {
        xhr.open(method, url + '?' + data, true)//true表示通过异步加载，false表示通过同步加载
        xhr.send();
    } else if (method == 'POST') {
        xhr.open(method, url, flag);
        xhr.setRequestHeader('Content-type', 'application-context/x-www-form-urlencoded')
        xhr.send(data);//POST 请求方式会将请求数据放到请求体中发送
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                succ(xhr.responseText);
            }
        }
        else {
            error(xhr.responseText);
        }
    }
}