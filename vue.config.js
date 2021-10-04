
// 项目优化
module.exports = {
    // 发布模式
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            // 通过CDN加载
            config.set('externals', {
                vue: 'Vue',
                axios: 'axios',
                echarts: 'echarts',
                "vue-quill-editor":'VueQuillEditor'
            })
            
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })

        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
    
        
}