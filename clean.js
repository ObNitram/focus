const shell = require('shelljs')

shell.rm('-rf', './modules/node_modules')
console.log('./modules/node_modules : Removed')
shell.rm('-rf', './modules/pathManage/dist')
console.log('./modules/pathManage/dist : Removed')

shell.rm('-rf', './modules/themeTypes/dist')
console.log('./modules/themeTypes/dist : Removed')

shell.rm('-rf', './node_modules/')
console.log('./node_modules : Removed')


