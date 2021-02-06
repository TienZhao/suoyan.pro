<template>
    <el-container direction="vertical">
        <el-header>
            <!-- Header content -->
            <el-row :gutter="20">
                <!-- Title -->
                <el-col :span="16" :offset="0">
                    <el-image style="width: 114px; height: 50px" :src="require('../assets/yanyes_logo_100p.png')" fit="contain" ></el-image>
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
                    <el-radio-group v-model="langRadioLeft" size="medium">
                        <el-radio-button label="汉语" ></el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="12" :offset="0">
                    <el-radio-group v-model="langRadioRight" size="medium" @change="changeLangRight">
                        <el-radio-button label="自动检测" ></el-radio-button>
                        <el-radio-button label="英语" ></el-radio-button>
                        <el-radio-button label="西班牙语" ></el-radio-button>
                        <el-radio-button label="德语" ></el-radio-button>
                        <el-radio-button label="俄语" ></el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>
            
            <el-row :gutter="20"  style="margin-top: 20px;">
                <el-col :span="12" :offset="0">
                    <!-- Input Box Left -->
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 10, maxRows: 50}"
                        :placeholder="placeHolderLeft"
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
                        :placeholder="placeHolderRight"
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
            
            <el-row :gutter="20">
                <div id="echart_main" style="width: 1600px; height: 900px;"></div>
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
        echartStyle = {
            width: '1000px',
            height: '1000px',
            background: '#00F',
        };
        langRadioLeft = '汉语';
        langRadioRight = '英语';
        placeHolderLeft = '请输入' + this.langRadioLeft + '语料'
        placeHolderRight = '请输入' + this.langRadioRight + '语料'
        changeLangRight(val) {
            this.placeHolderRight = '请输入' + val + '语料';
            console.log(this.placeHolderRight);
        }


        // Methods
        onClickCell(params){
            console.log(params);
        }

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
            this.alignResponse = res;
            console.log(res);

            this.renderEchart();
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
            var dataRaw = [];
            var dataSeriesArray = []; // Composed of a few objects like dataSeriesTemplate{}
            // Define Echarts data series.
            // Document at: https://echarts.apache.org/zh/option.html#series-heatmap
            // Each row of chart need to be placed in a different series, 
            // Otherwise there will be an error related with 'select' event and 'selected' feature.
            // Check details at: https://github.com/apache/echarts/issues/14230
            var dataSeriesTemplate = {
                name: '',
                type: 'heatmap',
                data: [],
                label: {show: true},
                selectedMode: 'multiple',
                // Style when cursor passes by.
                emphasis: {itemStyle: {shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)',}},
                // Style when 'select' event occures by mouse click or 'data.selected' is set as true.
                select: {itemStyle: {borderColor:'#ffffff', borderWidth: 4,},}
            }

            this.alignResponse.data.relations.forEach(relation => {
                var x, y, z
                var dataNode = {
                    value: [],
                    selected: false,
                }
                z = parseInt(relation.similarity * 100000)/1000;
                relation.nodes.forEach(node => {
                    if(node.articleIndex == 0){
                        x = node.sentenceIndex;
                    } else if(node.articleIndex == 1){
                        y = node.sentenceIndex;
                    }
                })
                dataNode.value = [y, x, z] // Replace the data.map in Echarts tutorial.
                if (z > 70){ // Binarize align result (sample condition)
                    dataNode.selected = true;
                }
                dataRaw.push(dataNode)
            });

            for(var i = 0; i < yLegend.length; i++){
                var tempDataSeries = JSON.parse(JSON.stringify(dataSeriesTemplate))
                dataRaw.forEach(dataNode =>{
                    if(i == dataNode.value[1]){
                        tempDataSeries.data.push(dataNode);
                    }
                })
                dataSeriesArray.push(tempDataSeries);
            }

            option = {
                tooltip: {
                    position: 'top',
                    formatter: function (params) {
                        var xText = xLegend[params.data.value[0]]
                        var yText = yLegend[params.data.value[1]]
                        var zText = params.data.value[2]
                        return "<div style='width: 290px; display: block; word-break: break; white-space: pre-wrap'>"+
                            "汉语： " + xText + "</br>" +
                            "外语： " + yText + "</br>" +
                            "<b>对齐评分： " + zText + "</b>" + 
                            "</div>"
                    },
                },
                grid: {
                    height: '80%',
                    width: '80%',
                    top: '50px',
                    left: '150px',
                },
                xAxis: {
                    type: 'category',
                    data: xLegend,
                    position: 'top',
                    axisLabel:{ // Text on X axis.
                        interval:0, // Force to split neighbouring texts, without which occurs failure of loading long texts.
                        width: 60, // Not sure what unit is using here.
                        overflow: 'truncate', // Truncate long text with default ellipsis (…).
                    },
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: yLegend,
                    inverse: true,
                    axisLabel:{ // Text on Y axis.
                        interval: 0, // Force to split neighbouring texts, without which occurs failure of loading long texts.
                        width: 150, // Not sure what unit is using here.
                        overflow: 'truncate', // Truncate long text with default ellipsis (…).
                    },
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: 50,
                    max: 80,
                    dimension: 2, // Bind with item[2] in series.data
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '0%',
                    inRange: {
                        color: ['#b0c0f0', '#1030a0'] // Customized gradient from light-grayish-blue (min) to deep-cobalt-blue (max)
                    }
                },
                series: dataSeriesArray,
                // series: [{
                //     name: '对齐选中',
                //     type: 'heatmap',
                //     data: dataHit,  // This series contains align results to be exported.
                //     label: {
                //         show: true
                //     },
                //     itemStyle: {    // Wrap cells with white border.
                //         borderColor:'#ffffff',
                //         borderWidth: 4,        
                //     },
                //     emphasis: {     // When cursor passes by.
                //         itemStyle: {
                //             shadowBlur: 10,
                //             shadowColor: 'rgba(0, 0, 0, 0.5)',
                //         }
                //     }
                // }, {
                //     name: '对齐忽略',
                //     type: 'heatmap',
                //     data: dataMissed,   // This series contains align results to be abandoned.
                //     label: {
                //         show: true
                //     },
                //     selectedMode: 'multiple',
                //     emphasis: {     // When cursor passes by.
                //         itemStyle: {
                //             shadowBlur: 10,
                //             shadowColor: 'rgba(0, 0, 0, 0.5)',
                //         }
                //     }
                // }]
            };

            option && myChart.setOption(option);
            myChart.resize({
                width: parseInt((xLegend.length * 80) + 160) + 'px',
                height: parseInt((yLegend.length * 50) + 100) + 'px',
            });

            myChart.on('selectchanged', function (params) {
                console.log(params);
            });
        }
    }
  
</script>

 
<style>

</style>