let str = 'b';
console.log('this is b.')
const obj = {
	str: str,
	obj2: {
		age: 99
	}
}


setTimeout(function() {
	obj.str = 'b2'
	obj.obj2.age += 1;
}, 1000);

module.exports = obj;