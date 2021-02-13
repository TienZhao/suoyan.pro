<template>
    <el-container >
        <Header></Header>
        <el-main height="">
            <!-- Main content -->
            <el-col :span="20" :offset="0">
                <div v-html="imprintText" style="line-height: 180%;"></div>
            </el-col>
        </el-main>
        <el-footer height="">
            <!-- Footer content -->
        </el-footer>
    </el-container>
</template>
 
<script tang = 'ts'>
    import { Component, Vue } from 'vue-property-decorator';
    import Header from '@/components/Header.vue';
    import showdown from 'showdown';
    import * as mdContent from '../markdowns/Imprint.md'

    @Component({
        components: {
            Header,
        },
    })
    export default class Imprint extends Vue {
        // Main content
        imprintText = '';
        mounted(){
            // Render mainText with showdown
            var converter = new showdown.Converter();
            this.imprintText = converter.makeHtml(mdContent);
        }
    }
</script>

<style>
</style>