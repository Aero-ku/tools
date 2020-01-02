# 如何深度克隆一个对象

通过for-in遍历对象的方式，对原始值和引用值进行判断，判断方法为typeof，对于原始值，直接赋值， 对于引用值，则通过递归调用该方法 当遇到引用值时，因为引用值还分为数组和对象，因此在这一步还需要进一步的判断数组和对象有三种方法
var obj = {} var arr = []

对象原型上的toString方法 Object.prototype.toString.call(item)
如果实例是一个对象的话 Object.prototype.toString.call(obj) 的结果为： "[object Object]"
如果实例是一个数组的话 Object.prototype.toString.call(arr) 的结果为： "[array Array]"
构造函数实例原型的constructor.name方法
如果实例是一个对象 obj.proto.constructor.name 的结果为"Object"
如果实例是一个数组 arr.proto.constructor.name 的结果为 "Array"
instanceof方法，该方法用来判断构造函数的prototype属性所指向的对象是否存在于目标实例的原型链上
如果实例是一个对象 obj instanceof Object 结果为true
如果实例是一个对象 arr instanceof Array 结果为true 注意 arr instanceof Object 结果也为true
具体的克隆过程请参考guthub上传的代码