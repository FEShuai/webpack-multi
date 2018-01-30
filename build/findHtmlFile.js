const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const HTMLWebpackPlugin = require("html-webpack-plugin");

/**
 * 验证HTML中是否有JS文件引入
 * @param filePath 需要验证的文件路径
 */
function hasJs (filePath) {
  let file = fs.readFileSync(filePath, 'UTF-8');
  const $ = cheerio.load(file);
  return $('script').length != 0 ? true : false;
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay (filePath) {
  let filePaths = [];
  //根据文件路径读取文件，返回文件列表
  try {
    let files = fs.readdirSync(filePath);
    //遍历读取到的文件列表
    files.forEach(function (filename) {
      //获取当前文件的绝对路径
      var filedir = path.join(filePath, filename);
      //根据文件路径获取文件信息，返回一个fs.Stats对象
      try {
        let fsStats = fs.statSync(filedir);
        let isFile = fsStats.isFile();//是文件
        let isDir = fsStats.isDirectory();//是文件夹
        if (isFile) {
          if (/(\.html)$/.test(filedir)) { // 判断文件是否是HTML文件
            filePaths.push({
              name: path.basename(filedir, '.html'),
              path: filedir,
              js: hasJs(filedir)
            });
          } else {
            throw new Error(filedir + '不是 HTML 文件');
          }
        } else if (isDir) {
          filePaths = filePaths.concat(fileDisplay(filedir)); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
      } catch (error) {
        console.error('获取文件信息失败！\n' + error);
      }
    });
    return filePaths;
  } catch (error) {
    console.error('读取目录失败！\n' + error);
  }
}

/**
 * 拼接webpack 入口、template模板方法
 * @param filePath 文件入口
 */
function getFiles(filePath) {
  let file = {
    HTMLPlugins:[], // 通过 html-webpack-plugin 生成的 HTML 集合
    Entries:{} // 入口文件集合
  }
  fileDisplay(filePath).forEach((page) => {
    let pageChunks = page.js ? [page.name, 'commons'] : ['commons'];
    const htmlPlugin = new HTMLWebpackPlugin({
      filename: `${page.name}.html`,
      template: page.path,
      chunks: pageChunks,
    });
    file.HTMLPlugins.push(htmlPlugin);
    if(page.js){
      let fileName = page.name;
      file.Entries[fileName] = path.resolve(__dirname,`../src/js/${page.name}.js`);
    }
  })
  return file;
}

module.exports = getFiles
