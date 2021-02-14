<template>
    <el-header>
        <!-- Header content -->
        <el-row :gutter="20">
            <!-- Title -->
            <el-col :span="12" :offset="0" style="float: left; width: 375px; height: 60px">
                <el-image style="float: left" :src="require('../assets/suoyan.pro.header.png')" fit="contain" ></el-image>
            </el-col>
            <el-col :span="12" :offset="0" style="float: right; width: 220px" >
            <!-- Header Navbar -->
                <el-menu 
                    mode="horizontal" 
                    default-active="$route.path" 
                    router
                    style="float: right; height: 50px; width: 220px;">
                    <el-menu-item v-for="(item, index) in headerNavMenu.items"
                        :index="item.path"
                        :key="`headerNavMenuItem-${index}`">
                            {{item.title}}
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </el-header>
</template>
 
<script tang = 'ts'>
    import { Component, Vue } from 'vue-property-decorator';  

    @Component({})
    export default class Header extends Vue{
        // Navigation bar
        headerNavMenu = {
            items: [
                { title: '首页', path: '/' },
                { title: '说明', path: '/manual' },
                { title: '引用', path: '/reference' },
            ]
        }; 

    }
</script>