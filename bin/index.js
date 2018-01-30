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
	.command('hello', 'hello')
	.parse(process.argv)

