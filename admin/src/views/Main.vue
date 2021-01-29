<template>
    <el-container direction="vertical">
        <el-header 
            height="40px"
            style="font-size: 28px">
            <!-- Header content -->
            <el-row :gutter="20">
                <!-- Title -->
                <el-col :span="16" :offset="0">
                    所言.pro
                </el-col>
                <el-col :span="8" :offset="0" >
                <!-- Navbar -->
                    <el-menu mode="horizontal" default-active="$route.path" router>
                        <el-menu-item v-for="(item, index) in navMenu.items"
                            :index="item.path"
                            :key="`navMenuItem-${index}`">
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
                        placeholder="请输入内容"
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
                        placeholder="请输入内容"
                        v-model="textareaRight"
                        maxlength="500"
                        show-word-limit
                    >
                    </el-input>
                </el-col>
            </el-row> 

            <el-row :gutter="20">
                <!-- Buttons -->
                <el-col :span="12" :offset="0" style="display:block;">
                    <el-button type="primary" @click="onAlign">语料对齐</el-button>
                    <el-button type="primary" plain  @click="onAdvancedAlign">高级对齐</el-button>
                </el-col>
                <el-col :span="12" :offset="0"></el-col>
            </el-row>  
           
        </el-main>

        <el-footer height="40px">
            <!-- Footer content -->
            有道是：所言极是！ | 隐私 | 条款 | 声明
        </el-footer>
    </el-container>
      
 
 </template>
 
 <script tang = 'ts'>
    import { Component, Vue } from 'vue-property-decorator';  
    @Component({

    })
    export default class Main extends Vue{
        // Navbar
        navMenu = {
            items: [
                { title: '首页', path: '/' },
                { title: '说明', path: '/manual' },
                { title: '引用', path: '/referencer' },
            ]
        }
        textareaLeft = ''
        textareaRight = ''

        // Methods
        onAlign(){
            // alert(this.textareaLeft);
            console.log('align btn clicked');
            console.log(this.textareaLeft);
            console.log(this.textareaRight);
        }

        onAdvancedAlign(){
            console.log('advanced align btn clicked');
            console.log(this.textareaLeft);
            console.log(this.textareaRight);
        }



    }
  
</script>

 
 <style>
 
 </style>