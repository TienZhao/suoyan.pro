module.exports = {
    chainWebpack: config => {
      config
        .plugin('html')
        .tap(args => {
          args[0].title= '所言|平行语料对齐工具'
          return args
        });
        
      config.module
      .rule('md')
      .test(/\.md/)
      .use('html-loader')
        .loader('html-loader')
        .end()
      .use('markdown-loader')
        .loader('markdown-loader')
        .end()
    }
  }