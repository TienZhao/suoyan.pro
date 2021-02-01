<template>
    <el-container direction="vertical">
        <el-header>
            <!-- Header content -->
            <el-row :gutter="20">
                <!-- Title -->
                <el-col :span="16" :offset="0">
                    <el-image style="width: 114px; height: 50px" :src="require('../assets/yanyes_logo_100p.png')" fit="contain" ></el-image>
                    <!-- 所言.pro -->
                </el-col>
                <el-col :span="8" :offset="0" >
                <!-- Header Navbar -->
                    <el-menu 
                        mode="horizontal" 
                        default-active="$route.path" 
                        router
                        style="float: right; height: 50px">
                        <el-menu-item v-for="(item, index) in headerNavMenu.items"
                            :index="item.path"
                            :key="`headerNavMenuItem-${index}`">
                                {{item.title}}
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </el-header>

        <el-main direction="vertical">
            <!-- Main content -->
            <el-row :gutter="20">
                <el-col :span="12" :offset="0">
                    <!-- Input Box Left -->
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 10, maxRows: 50}"
                        placeholder="请输入中文语料"
                        v-model="textareaLeft"
                        maxlength="500"
                        show-word-limit
                    >
                    </el-input>
                </el-col>

                <el-col :span="12" :offset="0">
                    <!-- Input Box Right -->
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 10, maxRows: 50}"
                        placeholder="请输入西班牙语语料"
                        v-model="textareaRight"
                        maxlength="500"
                        show-word-limit
                    >
                    </el-input>
                </el-col>
            </el-row> 

            <el-row :gutter="20" style="margin-top: 20px;">
                <!-- Buttons -->
                <el-col :span="12" :offset="0" style="display:block;">
                    <el-button type="primary" @click="onAlign">一键对齐</el-button>
                    <el-button type="primary" plain  @click="onAdvancedAlign">高级对齐</el-button>
                </el-col>
                <el-col :span="12" :offset="0"></el-col>
            </el-row>  
           
        </el-main>

        <el-footer
            height="40px"
            style="position: fixed; bottom: 0px; font-size: 16px; color: #999; width: 100%; 
            text-align:center;">
            <!-- Footer content -->
            <el-row
                style="display:inline/inline-block;">
                <label>所言极是</label>
                <label> | </label>
                <label>隐私</label>
                <label> | </label>
                <label>条款</label>
                <label> | </label>
                <label>声明</label>
            </el-row>

        </el-footer>
    </el-container>
      
 
 </template>
 
 <script tang = 'ts'>
    import { Component, Vue } from 'vue-property-decorator';  
 
    @Component({})
    export default class Main extends Vue{
        // Navbar
        headerNavMenu = {
            items: [
                { title: '首页', path: '/' },
                { title: '说明', path: '/manual' },
                { title: '引用', path: '/referencer' },
            ]
        }
        textareaLeft = ''
        textareaRight = ''

        // Methods
        async onAlign(){
            // alert(this.textareaLeft);
            console.log('align btn clicked');
            console.log(this.textareaLeft);
            console.log(this.textareaRight);
            
            const res = await this.$http.get()
            console.log(res)
        }

        async onAdvancedAlign(){
            console.log('advanced align btn clicked');
            console.log(this.textareaLeft);
            console.log(this.textareaRight);

            // Lexical Analysis Test
            // const res = await this.$http.post('/post')
            // const res = await this.$http.post('/lexical_analysis',{
            //     text: this.textareaLeft
            // })
            
            // Sentence Boundary Detection Test
            // const res = await this.$http.post('/sbd',
            // [{
            //     text: this.textareaLeft,
            //     lang: 'zh'
            // },{
            //     text: this.textareaRight,
            //     lang: 'en'
            // }])

            // Sentence Similarity Test
            // const res = await this.$http.post('/text_similarity',{
            //     src: this.textareaRight,
            //     tgt: this.textareaLeft,
            // })
            // console.log(res)

            // Translation Test
            const res = await this.$http.post('/text-translate',{
                src: this.textareaRight,
            })
            console.log(res)
        }



    }
  
</script>

 
<style>

</style>