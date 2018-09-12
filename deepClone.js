// 原生js函数实现深拷贝
function deepClone (target, origin){
    var target = target || {}
    for(var prop in origin){
        if(origin.hasOwnProperty(prop)){
            if(typeof origin[prop] == 'object'&& typeof origin[prop] != null){
                if(Object.prototype.toString.call(origin[prop]) == '[object Object'){
                    target[prop] = {}
                } else {
                    target[prop] = []
                }
                deepClone(target[prop], origin[prop])
            } else {
                target[prop] = origin[prop]
            }
        }
    }
    return target
}
