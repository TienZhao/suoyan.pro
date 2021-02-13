<template>
    <el-container >
        <Header></Header>
        <el-main height="">
            <!-- Main content -->
            <el-col :span="20" :offset="0">
                <div v-html="privacyText" style="line-height: 180%;"></div>
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
    import * as mdContent from '../markdowns/Privacy.md'

    @Component({
        components: {
            Header,
        },
    })
    export default class Privacy extends Vue {
        // Main content
        privacyText = '';
        mounted(){
            // Render mainText with showdown
            var converter = new showdown.Converter();
            this.privacyText = converter.makeHtml(mdContent);
        }
    }
</script>

<style>
</style>