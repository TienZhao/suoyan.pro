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
                        maxlength="2000"
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
                        maxlength="2000"
                        show-word-limit
                    >
                    </el-input>
                </el-col>
            </el-row> 

            <el-row :gutter="20" style="margin-top: 20px;">
                <!-- Buttons -->
                <el-col :span="12" :offset="0" style="display:block;">
                    <el-button type="primary" @click="onAlign">一键对齐</el-button>
                    <el-button type="primary" plain  @click="onAdvancedAlign">模拟对齐</el-button>
                </el-col>
                <el-col :span="12" :offset="0"></el-col>
            </el-row>  

            <div id="echart_main" style="width: 800px; height: 500px;"></div>
           
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
    import * as echarts from 'echarts';

    @Component({})
    export default class Main extends Vue{
        // Navbar
        headerNavMenu = {
            items: [
                { title: '首页', path: '/' },
                { title: '说明', path: '/manual' },
                { title: '引用', path: '/referencer' },
            ]
        };
        textareaLeft = '';
        textareaRight = '';
        alignResponse;


        // Methods
        async onAlign(){
            // alert(this.textareaLeft);
            console.log('align btn clicked');
            console.log(this.textareaLeft);
            console.log(this.textareaRight);
            
            // const res = await this.$http.get()
            // console.log(res)

            // Alignment Test
            const req = new( Object )
            req.articles = new( Array )
            req.articles.push({
                    text: this.textareaLeft,
                    lang: 'zh'
                })
            req.articles.push({
                text: this.textareaRight,
                    lang: 'es'
                })
            console.log(req)
            const res = await this.$http.post('/align',req)
            console.log(res)
        }


        async onAdvancedAlign(){
            console.log('Test align test btn clicked');
            const res = await this.$http.post('/align_test',{});
            this.alignResponse = res;
            console.log(res);

            this.renderEchart();

            // console.log(this.textareaLeft);
            // console.log(this.textareaRight);

            // Lexical Analysis Test
            // const res = await this.$http.post('/post')
            // const res = await this.$http.post('/lexical_analysis',{
            //     text: this.textareaLeft
            // })
            
            // Sentence Boundary Detection Test
            // const res = await this.$http.post('/sbd',
            // {
            //     text: this.textareaLeft,
            //     lang: 'zh'
            // })
            // const res = await this.$http.post('/sbd',
            // {
            //     text: this.textareaRight,
            //     lang: 'en'
            // }]

            // Sentence Similarity Test
            // const res = await this.$http.post('/text_similarity',{
            //     src: this.textareaRight,
            //     tgt: this.textareaLeft,
            // })
            // console.log(res)

            // Translation Test
            // const res = await this.$http.post('/text-translate',{
            //     src: this.textareaRight,
            // })
            // console.log(res)
        }

        renderEchart(){
            var chartDom = document.getElementById('echart_main');
            var myChart = echarts.init(chartDom);
            var option;
            var xLegend = this.alignResponse.data.articles[0].sentenceArray;
            var yLegend = this.alignResponse.data.articles[1].sentenceArray;
            var data = [];

            console.log(xLegend);

            this.alignResponse.data.relations.forEach(relation => {
                var x, y, z;
                z = parseInt(relation.similarity * 100000)/1000;
                relation.nodes.forEach(node => {
                    if(node.articleIndex == 0){
                        x = node.sentenceIndex
                    } else if(node.articleIndex == 1){
                        y = node.sentenceIndex
                    }
                })
                const dataNode = [x, y, z]
                data.push(dataNode)
            });

            data = data.map(function (item) {
                return [item[1], item[0], item[2] || '-'];
            });

            option = {
                tooltip: {
                    position: 'top',
                    formatter: function (params) {
                        var xText = xLegend[params.data[0]]
                        var yText = yLegend[params.data[1]]
                        var zText = params.data[2]
                        return xText + '</br>' + yText + '</br>对齐评分:' + zText
                    }
                },
                grid: {
                    height: '80%',
                    width: '80%',
                    top: '50px',
                    left: '80px',
                },
                xAxis: {
                    type: 'category',
                    data: xLegend,
                    position: 'top',
                    axisLabel:{
                        interval:0,
                        width: 60,
                        overflow: 'truncate',
                    },
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: yLegend,
                    inverse: true,
                    axisLabel:{
                        interval:0,
                        width: 60,
                        overflow: 'truncate',
                    },
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 50,
                    max: 80,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '0%',
                    inRange: {
                        color: ['#b0c0f0', '#1030a0']
                    }
                },
                series: [{
                    name: 'Similarity Score',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: true
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            option && myChart.setOption(option);
        }
    }
  
</script>

 
<style>

</style>