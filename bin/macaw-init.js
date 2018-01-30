const program = require('commander');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const glob = require('glob'); // npm i glob -D
const download = require('../lib/download');
const shell = require('shelljs');
const ora = require('ora');
const colors = require('colors');
const generator = require('../lib/generator')

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

program
  .version('0.1.0')
  .usage('<project-name>')
  .parse(process.argv);

// 根据输入，获取项目名称
let projectName = program.args[0];
if (!projectName) {
  // project-name 必填

  let currentPath = process.cwd();
  console.log('===========' + currentPath);
  let dirInfo = shell.ls('-A', currentPath);
  if (dirInfo.stdout != '') {
		// 如果文件夹非空
		console.log(dirInfo)
    console.log('文件夹非空'.error);
    return;
  } else {
    inquirer
      .prompt([
        {
          name: 'init',
          message: `确定在 ${currentPath} 目录下初始化项目？Y/N`
        }
      ])
      .then(answers => {
        if (answers.init.toUpperCase() == 'Y') {
          getProjetInfo();
        } else {
          console.log('初始化项目失败'.error);
        }
      });
  }
} else {
  let currentPath = process.cwd();
  let dirInfo = shell.ls('-A', currentPath + '/' + projectName);
  if (dirInfo.stdout != '') {
    // 如果文件夹非空
    console.log('文件夹非空'.error);
    return;
  }
}

console.log('文件夹是空的');

function getProjetInfo() {
	const list = glob.sync('*'); // 遍历当前目录
  let rootName = path.basename(process.cwd());
  if (list.length) {
		// 如果当前目录不为空
		console.log(1)
    if (
      list.filter(name => {
        const fileName = path.resolve(process.cwd(), path.join(name));
        const isDir = fs.statSync(fileName).isDirectory();
        return name.indexOf(projectName) !== -1 && isDir;
      }).length !== 0
    ) {
      console.log(`项目${projectName}已经存在`);
      return;
    }
    rootName = projectName;
  } else if (rootName === projectName) {
		console.log(2)
    rootName = '';
  } else {
		console.log(3)
    rootName = projectName;
  }
	download(rootName)
	.then(target => {
		console.log('=============');
		console.log(target + '.');
		shell.cp('-r', target + '/', rootName);
		let context = {
			name: projectName || 'suibianxieyigemingzi'
		};
		inquirer
    .prompt([
			{
        name: 'projectName',
    		message: '项目的名称',
        default: context.name
      }, {
        name: 'projectVersion',
        message: '项目的版本号',
        default: '1.0.0'
      }, {
        name: 'projectDescription',
        message: '项目的简介',
        default: `A project named ${context.name}`
      }, {
        name: 'projectauthor',
        message: '项目的作者',
        default: `A project named ${context.author}`
      }
    ])
    .then(answers => {
			console.log(`你输入的项目名称是：${answers.projectName}`);
			// return generator(context)
			context = answers;
			generator(context)
			console.log(context)
		})
		// .then(context => {
		// 	console.log('创建成功:)')
		// }).catch(err => {
		// 	console.error(`创建失败：${err.message}`)
		// })
		;
		// shell.cp('-R', target+'/**/.*', rootName);
	})
	.catch(err => console.log(err));
}
