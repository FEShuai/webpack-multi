#!/usr/bin/env node

console.log('hello cli');
// 命令行参数获取
const program = require('commander');
// 执行脚本命令
const shell = require('shelljs');
// 下载git中模板文件
const download = require('download-git-repo');
// 图标提示
const ora = require('ora');
// 颜色输出
var colors = require('colors');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});

const inquirer = require('inquirer');


program.version('1.0.0')
	.usage('<command> [项目名称]')
	.command('init', '创建新项目')
	.parse(process.argv)


program.usage('<project-name>')

// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {  // project-name 必填
	// 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
	program.help()
	return
}

const list = glob.sync('*')  // 遍历当前目录
let rootName = path.basename(process.cwd())
if (list.length) {  // 如果当前目录不为空
	if (list.filter(name => {
			const fileName = path.resolve(process.cwd(), path.join('.', name))
			const isDir = fs.stat(fileName).isDirectory()
			return name.indexOf(projectName) !== -1 && isDir
		}).length !== 0) {
		console.log(`项目${projectName}已经存在`)
		return
	}
	rootName = projectName
} else if (rootName === projectName) {
	rootName = '.'
} else {
	rootName = projectName
}

go()

function go () {
	// 预留，处理子命令
	console.log(path.resolve(process.cwd(), path.join('.', rootName)))
}



