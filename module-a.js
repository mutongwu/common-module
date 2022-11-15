let str = 'a';
console.log('this is module a.')
setTimeout(function() {
	str = 'a2'
}, 1000);
module.exports = str;