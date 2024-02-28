const req = require.context('../../../assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map(i => {
  return i.match(re)[1]
})

export default svgIcons

/**
这段代码主要是使用 Webpack 的 require.context 方法来动态地导入指定目录下的所有符合条件的文件，并将它们存储在一个数组中。具体解释如下：

1. 第一行代码使用 require.context 方法来创建一个上下文模块，用于在指定目录下动态导入所有符合条件的文件。第一个参数 '../../../assets/icons/svg' 是指定的目录路径，第二个参数 false 表示不递归查找子目录，第三个参数 /\.svg$/ 是一个正则表达式，表示只导入以 .svg 结尾的文件。

2. 第二行代码定义了一个 requireAll 函数，接受一个 requireContext 参数，然后调用 requireContext.keys() 方法来获取所有符合条件的文件路径，并返回一个数组。

3. 第四行定义了一个正则表达式 re，用于匹配文件路径中的文件名部分。

4. 第六行代码调用 requireAll 函数传入之前创建的 require.context 实例 req，获取所有符合条件的文件路径，并存储在一个数组中。

5. 第八行代码对获取到的文件路径数组进行遍历，对每个路径执行 match 方法，传入之前定义的正则表达式 re，提取出文件名部分并存储在一个新数组 svgIcons 中。

6. 最后一行通过 export default 将提取出的文件名数组 svgIcons 导出，供其他模块使用。
 */