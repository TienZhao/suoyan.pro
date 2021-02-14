<template>
    <el-container direction="vertical">
        <Header>
            <!-- Using @/components/Header.vue -->
        </Header>

        <el-main direction="vertical">
            <!-- Main content -->
            <div v-if="step == 1">
                <el-row :gutter="20" style="margin-top: 50px;">
                    <el-col :span="12" :offset="0">
                        <!-- Language Button Left -->
                        <el-radio-group v-model="langRadioLeft" size="medium" @change="onChangeLangRadioLeft">
                            <el-radio-button :label="item.label" :key="item.label" v-for="item in langOptionsLeft">{{item.text}}</el-radio-button>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <!-- Language Button Right -->
                        <el-radio-group v-model="langRadioRight" size="medium" @change="onChangeLangRadioRight">
                            <el-radio-button :label="item.label" :key="item.label" v-for="item in langOptionsRight">{{item.text}}</el-radio-button>
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
                    <el-col :span="24" :offset="0" style="display: block;">
                        <el-button type="primary" @click="onAlign">一键对齐</el-button>
                        <!-- <el-button type="primary" plain  @click="onAdvancedAlign">模拟对齐</el-button> -->
                        <el-button type="primary" plain  @click="onRandomAlign">随便试试</el-button>
                    </el-col>
                </el-row>  
            </div>

            <el-row :gutter="20" overflow="auto">
                <div id="alignChartMain" v-loading="alignChartLoading"></div>
            </el-row>

            <div v-if = "step == 2">
                <el-row :gutter="20">
                    <el-col :span="24" :offset="0">
                        <el-button type="primary" @click="onExport">导出结果</el-button>
                        <el-button type="primary" plain @click="onBack">返回</el-button>
                    </el-col>
                </el-row>
            </div>  
           
        </el-main>

        <el-footer
            height="30px"
            style="position: fixed; bottom: 0px; font-size: 16px; color: #999; width: 100%; background-color: white; 
            text-align:center;">
            <!-- Footer content -->
            <el-row style="display:inline/inline-block; margin-top: 5px;">
                <label><a href='/' style="color: gray;text-decoration:none">所言极是</a></label>
                <label> | </label>
                <label><a href='/privacy' style="color: gray;text-decoration:none">隐私</a></label>
                <label> | </label>
                <label><a href='/imprint' style="color: gray;text-decoration:none">声明</a></label>
            </el-row>

        </el-footer>
    </el-container>
      
 
 </template>
 
 <script tang = 'ts'>
    import { Component, Vue } from 'vue-property-decorator';  
    import * as echarts from 'echarts';
    import Header from '@/components/Header.vue'

    @Component({
        components: {
            Header,
        },
    })
    export default class Main extends Vue{
        // Navigation bar
        headerNavMenu = {
            items: [
                { title: '首页', path: '/' },
                { title: '说明', path: '/manual' },
                { title: '引用', path: '/reference' },
            ]
        }; 

        // Page step
        step = 1;
        
        // Language radio buttons
        langOptionsLeft = [
            {label:'zh',  text:'汉语'},
        ]
        langOptionsRight = [
            {label:'auto',  text:'自动检测'},
            {label:'en',  text:'英语'},
            {label:'fr',  text:'法语'},
            {label:'es',  text:'西班牙语'},
            {label:'de',  text:'德语'},
            {label:'ru',  text:'俄语'},
        ]
        langRadioLeft = 'zh';       // Default value.
        langRadioRight = 'auto';    // Default value.
        onChangeLangRadioLeft(val) {
            const langOption = this.langOptionsLeft.find(langOption => langOption.label == val);
            this.placeHolderLeft = '请输入' + langOption.text + '语料';
            console.log(this.placeHolderLeft);
        }
        onChangeLangRadioRight(val) {
            const langOption = this.langOptionsRight.find(langOption => langOption.label == val);
            this.placeHolderRight = '请输入' + langOption.text + '语料';
            console.log(this.placeHolderRight);
        }
        
        // Input boxes, where placeholders are set according to language radio default values.
        textareaLeft = '';
        textareaRight = '';
        placeHolderLeft = '请输入' + this.langOptionsLeft.find(langOption => langOption.label == this.langRadioLeft).text + '语料';
        placeHolderRight = '请输入' + this.langOptionsRight.find(langOption => langOption.label == this.langRadioRight).text + '语料';
        
        // Align button
        alignResponse;
        
        // Echarts
        // echartStyle = {
        //     width: '1000px',
        //     height: '1000px',
        //     background: '#00F',
        // };
        alignChart;
        alignChartLoading = false;

        // Export button
        alignChartSelection = [];

        // Methods
        async onAlign(){
            // Set align chart to loading mode.
            var chartDom = document.getElementById('alignChartMain');
            chartDom.style.width = '300px';
            chartDom.style.height = '300px';
            this.alignChartLoading = true;
            // Align.
            const req = new( Object )
            req.articles = new( Array )
            req.articles.push({
                    text: this.textareaLeft,
                    lang: this.langRadioLeft,
                })
            req.articles.push({
                    text: this.textareaRight,
                    lang: this.langRadioRight,
                })
            console.log(req)
            const res = this.$http.post('/align',req)
            this.alignResponse = await res;
            console.log(await res);
            // Next step of the page.
            this.step = 2;
            // Render echart to visualize align result.
            this.alignChartLoading = false;
            this.renderEchart();
        }

        async onRandomAlign(){
            this.textareaLeft = '多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。最初他们带来了磁石。一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。“万物皆有灵，”吉卜赛人用嘶哑的嗓音宣告，“只需唤起它们的灵性。”';
            this.langRadioLeft = 'zh';
            this.textareaRight = 'Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos. El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo. Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos. Primero llevaron el imán. Un gitano corpulento, de barba montaraz y manos de gorrión, que se presentó con el nombre de Melquiades, hizo una truculenta demostración pública de lo que él mismo llamaba la octava maravilla de los sabios alquimistas de Macedonia. Fue de casa en casa arrastrando dos lingotes metálicos, y todo el mundo se espantó al ver que los calderos, las pailas, las tenazas y los anafes se caían de su sitio, y las maderas crujían por la desesperación de los clavos y los tornillos tratando de desenclavarse, y aun los objetos perdidos desde hacía mucho tiempo aparecían por donde más se les había buscado, y se arrastraban en desbandada turbulenta detrás de los fierros mágicos de Melquíades. «Las cosas, tienen vida propia -pregonaba el gitano con áspero acento-, todo es cuestión de despertarles el ánima.»';
            this.langRadioRight = 'es';

            this.onAlign();
        }

        onBack(){
            this.step = 1;
            this.alignChart.clear();
        }


        // // Test Function
        // async onAdvancedAlign(){
        //     console.log('Advance align test btn clicked');

            // // Align Test
            // const res = await this.$http.post('/align_test',{});
            // this.alignResponse = res;
            // console.log(res);

            // this.renderEchart();

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
        // }

        async onExport(){
            console.log(this.alignChartSelection);
            // Export Test
            const res = await this.$http.post('/export',this.alignChartSelection);
            console.log(res);
            let arrayBuffer = new Int8Array(res.data.data).buffer;
            let blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); 
            let fileName = `test.xlsx`;
            // type for xls: 'application/vnd.ms-excel'
            // type for xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            if (window.navigator && window.navigator.msSaveBlob) {
                // For IE family explorers
                window.navigator.msSaveBlob(blob, 'test.xlsx');
            } else {
                // For other explorers
                let link = document.createElement('a'); // 创建a标签
                link.style.display = 'none';
                let objectUrl = URL.createObjectURL(blob);
                link.href = objectUrl;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        }

        renderEchart(){
            // Define chart size
            let that = this;
            var chartDom = document.getElementById('alignChartMain');
            var resizechartDom = function () {
                chartDom.style.width = parseInt(that.alignResponse.data.articles[1].sentenceArray.length * 80 + 250) + 'px';
                chartDom.style.height = parseInt(that.alignResponse.data.articles[1].sentenceArray.length * 50 + 200) + 'px'
            };
            resizechartDom();
            // Initialize chart
            this.alignChart = echarts.init(chartDom);
            // Define Chart Options
            var option;
            var xLegend = this.alignResponse.data.articles[0].sentenceArray;
            var yLegend = this.alignResponse.data.articles[1].sentenceArray;
            var dataRaw = [];
            var dataSeriesArray = []; // Composed of a few objects like dataSeriesTemplate{}
            // Define Chart data series.
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
                select: {itemStyle: {borderColor:'#50f000', borderWidth: 6,}}
            }
            // Set chart data values.
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
                dataNode.value = [x, y, z] // Replace the data.map in Echarts tutorial.
                if (relation.hit){ // Binarized align result
                    dataNode.selected = true;
                    // Store default selection to this.alignChartSelection
                    this.alignChartSelection.push([yLegend[y], xLegend[x]]);
                }
                dataRaw.push(dataNode)
            });
            // Organize chart data by making data series (rows).
            for(var i = 0; i < yLegend.length; i++){
                var tempDataSeries = JSON.parse(JSON.stringify(dataSeriesTemplate))
                dataRaw.forEach(dataNode =>{
                    if(i == dataNode.value[1]){
                        tempDataSeries.data.push(dataNode);
                    }
                })
                dataSeriesArray.push(tempDataSeries);
            }
            // Set chart options.
            option = {
                tooltip: {
                    position: 'top',
                    confine: true,
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
                    // height: '80%',
                    // width: '80%',
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
            // Render chart.
            option && this.alignChart.setOption(option);
            // Resize chart.
            this.alignChart.resize({
                // Resize based on content quantity
                width: parseInt((xLegend.length * 80) + 250) + 'px',
                height: parseInt((yLegend.length * 50) + 200) + 'px',
            });
            // Mouse select event.
            this.alignChart.on('selectchanged', function (params) {
                var selectionArray = [];
                for(var i = 0; i < params.selected.length; i++){
                    const seriesIndex = params.selected[i].seriesIndex;
                    const dataIndexArray = params.selected[i].dataIndex;
                    const seriesData = dataSeriesArray[seriesIndex].data;
                    for(var j = 0; j < dataIndexArray.length; j++){
                        const dataIndex = dataIndexArray[j];
                        const xIndex = seriesData[dataIndex].value[0];
                        selectionArray.push([yLegend[seriesIndex], xLegend[xIndex]]);
                    }
                }
                that.alignChartSelection = selectionArray;
                console.log('Change align chart selection')
                console.log(that.alignChartSelection)
            });
        }
    }
</script>
 
<style>

</style>