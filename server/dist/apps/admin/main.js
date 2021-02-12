/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const admin_module_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(19);
async function bootstrap() {
    const app = await core_1.NestFactory.create(admin_module_1.AdminModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Yanyes-API')
        .setDescription('服务端API')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(3000);
    console.log('http://localhost:3000/api-docs');
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");;

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(3);
const admin_controller_1 = __webpack_require__(4);
const admin_service_1 = __webpack_require__(5);
const neo4j_module_1 = __webpack_require__(22);
const tencentcloud_module_1 = __webpack_require__(24);
const sbd_module_1 = __webpack_require__(27);
const xlsx_module_1 = __webpack_require__(28);
const admin_credentials_1 = __webpack_require__(29);
const align_module_1 = __webpack_require__(30);
const align_service_1 = __webpack_require__(20);
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    common_1.Module({
        imports: [
            align_module_1.AlignModule,
            xlsx_module_1.XlsxModule,
            sbd_module_1.SbdModule,
            neo4j_module_1.Neo4jModule.forRoot(admin_credentials_1.Neo4jCredential),
            tencentcloud_module_1.TencentcloudModule.forRoot(admin_credentials_1.TencentcloudCredential)
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, align_service_1.AlignService],
    })
], AdminModule);
exports.AdminModule = AdminModule;


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");;

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(3);
const admin_service_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(19);
const align_service_1 = __webpack_require__(20);
let AdminController = class AdminController {
    constructor(adminService, alignService) {
        this.adminService = adminService;
        this.alignService = alignService;
    }
    async getHello() {
        const greeting = await this.adminService.getHello();
        return greeting;
    }
    async postHello() {
        const post = await this.adminService.postHello();
        return post;
    }
    lexicalAnalysis(body) {
        const req = {
            Text: body.text
        };
        const postRes = this.adminService.lexicalAnalysis(req);
        return postRes;
    }
    sbd(body) {
        const postRes = this.adminService.sbd(body);
        return JSON.parse(JSON.stringify(postRes));
    }
    text_similarity(body) {
        console.log(body);
        const sbd_body = [{
                text: body.tgt,
                lang: 'zh'
            }];
        const sbd_res = this.adminService.sbd(sbd_body);
        body.tgtArray = sbd_res[0].sentenceArray;
        const req = {
            SrcText: body.src,
            TargetText: body.tgtArray,
        };
        const postRes = this.adminService.textSimilarity(req);
        return postRes;
    }
    text_translate(body) {
        const req = {
            SourceText: body.src,
            Source: 'auto',
            Target: 'zh',
            ProjectId: 0
        };
        console.log(req);
        const postRes = this.adminService.textTranslaste(req);
        return postRes;
    }
    align(req) {
        const postRes = this.alignService.alignArticles(req);
        return postRes;
    }
    align_test(req) {
        const postRes = this.alignService.alignArticlesTest();
        return postRes;
    }
    export(data) {
        const postRes = this.adminService.ExportXlsx(data);
        return postRes;
    }
};
__decorate([
    common_1.Get('get_hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], AdminController.prototype, "getHello", null);
__decorate([
    common_1.Post('post'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AdminController.prototype, "postHello", null);
__decorate([
    common_1.Post('lexical_analysis'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "lexicalAnalysis", null);
__decorate([
    common_1.Post('sbd'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sbd", null);
__decorate([
    common_1.Post('text_similarity'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "text_similarity", null);
__decorate([
    common_1.Post('text-translate'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "text_translate", null);
__decorate([
    common_1.Post('align'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "align", null);
__decorate([
    common_1.Post('align_test'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "align_test", null);
__decorate([
    common_1.Post('export'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "export", null);
AdminController = __decorate([
    common_1.Controller(),
    swagger_1.ApiTags('admin'),
    __metadata("design:paramtypes", [typeof (_c = typeof admin_service_1.AdminService !== "undefined" && admin_service_1.AdminService) === "function" ? _c : Object, typeof (_d = typeof align_service_1.AlignService !== "undefined" && align_service_1.AlignService) === "function" ? _d : Object])
], AdminController);
exports.AdminController = AdminController;


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminService = void 0;
const common_1 = __webpack_require__(3);
const neo4j_service_1 = __webpack_require__(6);
const sbd_service_1 = __webpack_require__(10);
const tencentcloud_service_1 = __webpack_require__(12);
const xlsx_service_1 = __webpack_require__(17);
let AdminService = class AdminService {
    constructor(neo4jService, tencentcloudService, sbdService, xlsxService) {
        this.neo4jService = neo4jService;
        this.tencentcloudService = tencentcloudService;
        this.sbdService = sbdService;
        this.xlsxService = xlsxService;
    }
    async getHello() {
        const result = this.neo4jService.read('MATCH (n) RETURN count(n) AS COUNT', {});
        const count = (await result).records[0].get('COUNT');
        return `Hello Neo4j User! There are ${count} nodes in the database`;
    }
    async postHello() {
        const timestamp = Date.parse(new Date().toString());
        const cypherSentence = "CREATE (Hello:Movie {timestamp:'" + timestamp + "', user:'admin'})";
        const result = this.neo4jService.write(cypherSentence, {});
        const res = await result;
        return `${res}`;
    }
    async lexicalAnalysis(req) {
        const result = await this.tencentcloudService.lexicalAnalysis(req);
        return result;
    }
    async textSimilarity(req) {
        const result = await this.tencentcloudService.textSimilarity(req);
        return result;
    }
    async textTranslaste(req) {
        console.log(req);
        console.log(this.tencentcloudService.getTmtClient());
        const result = await this.tencentcloudService.textTranslate(req);
        return result;
    }
    sbd(body) {
        const result = this.sbdService.splitSentence(body);
        return result;
    }
    ExportXlsx(data) {
        const result = this.xlsxService.exportXlsx(data);
        return result;
    }
};
AdminService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof neo4j_service_1.Neo4jService !== "undefined" && neo4j_service_1.Neo4jService) === "function" ? _a : Object, typeof (_b = typeof tencentcloud_service_1.TencentcloudService !== "undefined" && tencentcloud_service_1.TencentcloudService) === "function" ? _b : Object, typeof (_c = typeof sbd_service_1.SbdService !== "undefined" && sbd_service_1.SbdService) === "function" ? _c : Object, typeof (_d = typeof xlsx_service_1.XlsxService !== "undefined" && xlsx_service_1.XlsxService) === "function" ? _d : Object])
], AdminService);
exports.AdminService = AdminService;


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Neo4jService = void 0;
const common_1 = __webpack_require__(3);
const neo4j_config_interface_1 = __webpack_require__(7);
const neo4j_contants_1 = __webpack_require__(8);
const neo4j_driver_1 = __webpack_require__(9);
let Neo4jService = class Neo4jService {
    constructor(config, driver) {
        this.config = config;
        this.driver = driver;
    }
    async neo4jSentenceTranslation(req) {
        const cypherSentence = `MATCH (m: Sentence {text: '${req.srcText}', lang: '${req.srcLang}'})-[r:TRANSL]->(n: Sentence {lang: '${req.tgtLang}'}) RETURN m,r,n`;
        const result = await this.read(cypherSentence, {});
        var translation = '';
        if (result.records.length > 0) {
            translation = result.records[0].get('n').properties.text;
        }
        return translation;
    }
    async neo4jSentenceSimilarity(req) {
        const cypherSentence = `MATCH (a:Sentence)-[r:SIM]-(b:Sentence) WHERE a.text = '${req.srcSentence}' AND b.text = '${req.tgtSentence}'  RETURN r.score`;
        const result = await this.read(cypherSentence, {});
        var score = 0;
        if (result.records.length > 0) {
            score = result.records[0].get('r.score');
        }
        return score;
    }
    async neo4jCreateSentenceNode(req) {
        const cypherSentenceSearch = `MATCH (a:Sentence {text: '${req.text}', lang: '${req.lang}', gene: '${req.gene}'}) RETURN a`;
        const searchResult = await this.read(cypherSentenceSearch, {});
        var res;
        if (searchResult.records.length == 0) {
            const cypherSentenceWrite = `CREATE (a:Sentence {text: '${req.text}', lang: '${req.lang}', gene: '${req.gene}', project: 'suoyan.pro', user: 'yanyes'}) RETURN a`;
            res = this.write(cypherSentenceWrite, {});
        }
        else {
            res = searchResult.records[0];
        }
        return res;
    }
    async neo4jCreateTranslation(req) {
        const cypherSentence = `MATCH (a:Sentence) WHERE a.text = '${req.srcSentence}' AND a.lang = '${req.srcLang}' CREATE (a)-[r:TRANSL {gene: '${req.gene}', provider: '${req.provider}'}]->(b:Sentence {text: '${req.tgtSentence}', lang: '${req.tgtLang}', gene: '${req.gene}', project: 'suoyan.pro', user: 'yanyes'}) RETURN r,b`;
        const res = this.write(cypherSentence, {});
        return res;
    }
    async neo4jCreateSimilarity(req) {
        const cypherSentence = `MATCH (a:Sentence),(b:Sentence) WHERE a.text = '${req.srcSentence}' AND b.text = '${req.tgtSentence}' MERGE (a)-[r:SIM {score: ${req.score}, provider: '${req.provider}'}]->(b) RETURN r`;
        const res = this.write(cypherSentence, {});
        return res;
    }
    getDriver() {
        return this.driver;
    }
    getConfig() {
        return this.config;
    }
    getReadSession(database) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j_driver_1.default.session.READ
        });
    }
    getWriteSession(database) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j_driver_1.default.session.WRITE
        });
    }
    read(cypher, params, database) {
        const session = this.getReadSession(database);
        return session.run(cypher, params);
    }
    write(cypher, params, database) {
        const session = this.getWriteSession(database);
        return session.run(cypher, params);
    }
};
Neo4jService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(neo4j_contants_1.NEO4J_CONFIG)),
    __param(1, common_1.Inject(neo4j_contants_1.NEO4J_DRIVER)),
    __metadata("design:paramtypes", [typeof (_a = typeof neo4j_config_interface_1.Neo4jConfig !== "undefined" && neo4j_config_interface_1.Neo4jConfig) === "function" ? _a : Object, typeof (_b = typeof neo4j_driver_1.Driver !== "undefined" && neo4j_driver_1.Driver) === "function" ? _b : Object])
], Neo4jService);
exports.Neo4jService = Neo4jService;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NEO4J_DRIVER = exports.NEO4J_CONFIG = void 0;
exports.NEO4J_CONFIG = 'NEO4J_CONFIG';
exports.NEO4J_DRIVER = 'NEO4J_DRIVER';


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("neo4j-driver");;

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SbdService = void 0;
const common_1 = __webpack_require__(3);
let SbdService = class SbdService {
    splitSentence(body) {
        body.forEach(async (item) => {
            switch (item.lang) {
                case 'en':
                case 'es':
                case 'fr':
                case 'de':
                case 'it':
                case 'pt':
                case 'ru':
                    item = await this.en(item);
                case 'zh':
                    item = this.zh(item);
            }
        });
        return body;
    }
    en(item) {
        var tokenizer = __webpack_require__(11);
        var optional_options = {
            "newline_boundaries": true,
            "html_boundaries": false,
            "sanitize": false,
            "allowed_tags": false,
            "preserve_whitespace": false,
            "abbreviations": null
        };
        var text = item.text;
        item.sentenceArray = tokenizer.sentences(text, optional_options);
        item.sentenceLineBreak = item.sentenceArray.join('\n');
        return JSON.parse(JSON.stringify(item));
    }
    zh(item) {
        var text = item.text;
        text = text.replace(/([。！？\?])([^”’])/g, '$1\n$2');
        text = text.replace(/(\.{6})([^”’])/g, '$1\n$2');
        text = text.replace(/(\…{2})([^”’])/g, '$1\n$2');
        text = text.replace(/([。！？\?][”’])([^，。！？\?])/g, '$1\n$2');
        text = text.trim();
        item.sentenceLineBreak = text;
        item.sentenceArray = text.split('\n');
        return item;
    }
};
SbdService = __decorate([
    common_1.Injectable()
], SbdService);
exports.SbdService = SbdService;


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("sbd");;

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TencentcloudService = void 0;
const common_1 = __webpack_require__(3);
const tencentcloud_contants_1 = __webpack_require__(13);
const interface_1 = __webpack_require__(14);
const nlp_client_1 = __webpack_require__(15);
const tmt_client_1 = __webpack_require__(16);
let TencentcloudService = class TencentcloudService {
    constructor(config, nlpClient, tmtClient) {
        this.config = config;
        this.nlpClient = nlpClient;
        this.tmtClient = tmtClient;
    }
    getNlpClient() {
        return this.nlpClient;
    }
    getTmtClient() {
        return this.tmtClient;
    }
    getConfig() {
        return this.config;
    }
    async lexicalAnalysis(req) {
        const res = await this.nlpClient.LexicalAnalysis(req);
        return res;
    }
    async textSimilarity(req) {
        const res = await this.nlpClient.TextSimilarity(req);
        return res;
    }
    async textTranslate(req) {
        const res = await this.tmtClient.TextTranslate(req);
        return res;
    }
    async languageDetect(req) {
        const res = await this.tmtClient.LanguageDetect(req);
        return res;
    }
};
TencentcloudService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(tencentcloud_contants_1.TENCENTCLOUD_CONFIG)),
    __param(1, common_1.Inject(tencentcloud_contants_1.TENCENTCLOUD_CLIENT)),
    __param(2, common_1.Inject(tencentcloud_contants_1.TENCENTCLOUD_TMT_CLIENT)),
    __metadata("design:paramtypes", [typeof (_a = typeof interface_1.ClientConfig !== "undefined" && interface_1.ClientConfig) === "function" ? _a : Object, typeof (_b = typeof nlp_client_1.Client !== "undefined" && nlp_client_1.Client) === "function" ? _b : Object, typeof (_c = typeof tmt_client_1.Client !== "undefined" && tmt_client_1.Client) === "function" ? _c : Object])
], TencentcloudService);
exports.TencentcloudService = TencentcloudService;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TENCENTCLOUD_TMT_CLIENT = exports.TENCENTCLOUD_CLIENT = exports.TENCENTCLOUD_CONFIG = void 0;
exports.TENCENTCLOUD_CONFIG = 'TENCENTCLOUD_CONFIG';
exports.TENCENTCLOUD_CLIENT = 'TENCENTCLOUD_CLIENT';
exports.TENCENTCLOUD_TMT_CLIENT = 'TENCENTCLOUD_TMT_CLIENT';


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("tencentcloud-sdk-nodejs/tencentcloud/common/interface");;

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("tencentcloud-sdk-nodejs/tencentcloud/services/nlp/v20190408/nlp_client");;

/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_client");;

/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XlsxService = void 0;
const common_1 = __webpack_require__(3);
const node_xlsx_1 = __webpack_require__(18);
let XlsxService = class XlsxService {
    testExportXlsx() {
        var xlsx = __webpack_require__(18).default;
        const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
        var buffer = xlsx.build([{ name: "mySheetName", data: data }]);
        return buffer;
    }
    exportXlsx(data) {
        var buffer = node_xlsx_1.default.build([{ name: "mySheetName", data: data }]);
        return buffer;
    }
};
XlsxService = __decorate([
    common_1.Injectable()
], XlsxService);
exports.XlsxService = XlsxService;


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("node-xlsx");;

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");;

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlignService = void 0;
const common_1 = __webpack_require__(3);
const neo4j_service_1 = __webpack_require__(6);
const sbd_service_1 = __webpack_require__(10);
const tencentcloud_service_1 = __webpack_require__(12);
const align_test_1 = __webpack_require__(21);
let AlignService = class AlignService {
    constructor(neo4jService, tencentcloudService, sbdService) {
        this.neo4jService = neo4jService;
        this.tencentcloudService = tencentcloudService;
        this.sbdService = sbdService;
    }
    alignArticlesTest() {
        return align_test_1.ALIGN_RESPONSE;
    }
    async alignArticles(alignReq) {
        for (var i = 0; i < alignReq.articles.length; i++) {
            const ldReq = {
                Text: alignReq.articles[i].text,
                ProjectId: 0,
            };
            const ldRes = await this.tencentcloudService.languageDetect(ldReq);
            if (alignReq.articles[i].lang == 'auto') {
                alignReq.articles[i].lang = ldRes.Lang;
            }
            else {
                if (ldRes.Lang != alignReq.articles[i].lang) {
                    console.log(`Input language of article ${i} seems incorrect!`);
                    throw new common_1.HttpException(`Input language of article ${i} seems incorrect! For safety reasons, Suoyan.pro (alpha) blocks any request with a language parameter different from the language detection result of the text.`, common_1.HttpStatus.BAD_REQUEST);
                }
            }
        }
        var newArticles = [];
        for (var i = 0; i < alignReq.articles.length; i++) {
            const sbdReq = {
                text: alignReq.articles[i].text,
                lang: alignReq.articles[i].lang,
            };
            const sbdRes = this.sbdService.splitSentence([sbdReq])[0];
            sbdRes.sentenceArray.forEach(sentence => {
                this.neo4jService.neo4jCreateSentenceNode({
                    text: sentence,
                    lang: sbdRes.lang,
                    gene: 'human'
                });
            });
            newArticles.push(sbdRes);
        }
        alignReq.articles = newArticles;
        for (var i = 0; i < alignReq.articles.length; i++) {
            if (alignReq.articles[i].lang == 'zh') {
                continue;
            }
            else {
                alignReq.articles[i].translLang = 'zh';
                alignReq.articles[i] = await this.articleTranslate(alignReq.articles[i]);
                break;
            }
        }
        var directArticleIndex;
        var relayedArticleIndex;
        var relationArray = [];
        for (var i = 0; i < alignReq.articles.length; i++) {
            if (alignReq.articles[i].lang == 'zh') {
                directArticleIndex = i;
                continue;
            }
            else {
                relayedArticleIndex = i;
                break;
            }
        }
        let relayedArticleSentences = alignReq.articles[relayedArticleIndex].translSentenceArray;
        let directArticleSentences = alignReq.articles[directArticleIndex].sentenceArray;
        let directArticleLength = directArticleSentences.length;
        const LOOKBACK = 2;
        const LOOKFORWARD = 3;
        var lastHitIndex = -1;
        var lastHitScore = 0;
        const HITSCORETHRESHOLD = 0.7;
        for (var i = 0; i < relayedArticleSentences.length; i++) {
            var lastHitScore = 0;
            var selectionStartIndex = (lastHitIndex + 1 - LOOKBACK);
            if (selectionStartIndex < 0) {
                selectionStartIndex = 0;
            }
            var selectionEndIndex = lastHitIndex + 1 + LOOKFORWARD;
            if (selectionEndIndex > directArticleLength) {
                selectionEndIndex = directArticleLength;
            }
            const similarityReq = {
                SrcText: relayedArticleSentences[i],
                TargetText: directArticleSentences.slice(selectionStartIndex, selectionEndIndex)
            };
            const similarityRes = await this.textSimilarity(similarityReq);
            for (var j = 0; j < similarityRes.Similarity.length; j++) {
                let sim = similarityRes.Similarity[j];
                const newRelation = {
                    nodes: [{
                            articleIndex: relayedArticleIndex,
                            sentenceIndex: i,
                            text: similarityReq.SrcText,
                            lang: alignReq.articles[relayedArticleIndex].lang
                        }, {
                            articleIndex: directArticleIndex,
                            sentenceIndex: selectionStartIndex + j,
                            text: sim.Text,
                            lang: 'zh'
                        }],
                    similarity: sim.Score,
                    method: 'tmt-relay',
                    hit: false,
                };
                relationArray.push(newRelation);
                if (sim.Score > lastHitScore || sim.Score >= HITSCORETHRESHOLD) {
                    lastHitScore = sim.Score;
                    lastHitIndex = selectionStartIndex + j;
                }
            }
        }
        relationArray.forEach(relation => {
            if (relation.similarity >= HITSCORETHRESHOLD) {
                relation.hit = true;
            }
        });
        relationArray.forEach(relationA => {
            const xA = relationA.nodes[0].sentenceIndex;
            const yA = relationA.nodes[1].sentenceIndex;
            const zA = relationA.similarity;
            var hit = relationArray.every(relationB => {
                const xB = relationB.nodes[0].sentenceIndex;
                const yB = relationB.nodes[1].sentenceIndex;
                const zB = relationB.similarity;
                if ((xA == xB || yA == yB) && zA < zB) {
                    return false;
                }
                else {
                    return true;
                }
            });
            if (hit) {
                relationA.hit = true;
            }
        });
        alignReq.relations = relationArray;
        console.log(alignReq);
        return alignReq;
    }
    sbd(body) {
        const result = this.sbdService.splitSentence([body]);
        return result;
    }
    async articleTranslate(article) {
        var translatedSentenceArray = [];
        var toBeTranslatedSentenceArray = [];
        for (var i = 0; i < article.sentenceArray.length; i++) {
            const req = {
                srcText: article.sentenceArray[i],
                srcLang: article.lang,
                tgtLang: article.translLang,
            };
            var res = await this.neo4jService.neo4jSentenceTranslation(req);
            if (res == '') {
                toBeTranslatedSentenceArray[i] = req.srcText;
            }
            else {
                translatedSentenceArray[i] = res;
            }
        }
        if (toBeTranslatedSentenceArray.length > 0) {
            const onlineTranslateReq = {
                SourceText: toBeTranslatedSentenceArray.join('\n'),
                Source: article.lang,
                Target: 'zh',
                ProjectId: 0
            };
            const onlineTraslateRes = await this.tencentTextTranslate(onlineTranslateReq);
            const onlineTraslatedSentenceArray = onlineTraslateRes.TargetText.split('\n');
            for (var i = 0; i < article.sentenceArray.length; i++) {
                if (translatedSentenceArray[i] === undefined) {
                    translatedSentenceArray[i] = onlineTraslatedSentenceArray[i];
                }
            }
        }
        article.translSentenceArray = translatedSentenceArray;
        article.translSentenceLineBreak = translatedSentenceArray.join('\n');
        return article;
    }
    async tencentTextTranslate(req) {
        if (req.SourceText.length > 2000) {
            req.SourceText = req.SourceText.substr(2000);
        }
        const result = await this.tencentcloudService.textTranslate(req);
        const srcSentenceArray = req.SourceText.split('\n');
        const resSentenceArray = result.TargetText.split('\n');
        for (var i = 0; i < srcSentenceArray.length; i++) {
            if (srcSentenceArray[i] != '' && resSentenceArray[i] != '') {
                const neo4jReq = {
                    srcSentence: srcSentenceArray[i],
                    srcLang: req.Source,
                    tgtSentence: resSentenceArray[i],
                    tgtLang: req.Target,
                    gene: 'machine',
                    provider: 'tencent',
                };
                this.neo4jService.neo4jCreateTranslation(neo4jReq);
            }
        }
        return result;
    }
    async textSimilarity(req) {
        var similarityArrayTBD = JSON.parse(JSON.stringify(req.TargetText));
        var similarityArrayTBS = [];
        var similarityArraySorted = [];
        for (i = 0; i < similarityArrayTBD.length; i++) {
            const score = await this.neo4jService.neo4jSentenceSimilarity({
                srcSentence: req.SrcText,
                tgtSentence: similarityArrayTBD[i],
            });
            if (score > 0) {
                var similarity = {
                    Score: score,
                    Text: similarityArrayTBD[i],
                };
                similarityArrayTBD.splice(i, 1);
                similarityArrayTBS.push(similarity);
            }
        }
        var newReq = {
            SrcText: req.SrcText,
            TargetText: similarityArrayTBD,
        };
        var response = await this.tencentcloudService.textSimilarity(newReq);
        similarityArrayTBS.push.apply(similarityArrayTBS, response.Similarity);
        for (var i = 0; i < req.TargetText.length; i++) {
            for (var j = 0; j < similarityArrayTBS.length; j++) {
                if (req.TargetText[i] == similarityArrayTBS[j].Text) {
                    similarityArraySorted.push(similarityArrayTBS[j]);
                    break;
                }
            }
        }
        response.Similarity = similarityArraySorted;
        similarityArraySorted.forEach(similarity => {
            this.neo4jService.neo4jCreateSimilarity({
                srcSentence: req.SrcText,
                tgtSentence: similarity.Text,
                score: similarity.Score,
                provider: 'tencent'
            });
        });
        return response;
    }
    async lexicalAnalysis(body) {
        const text = body.text;
        const result = await this.tencentcloudService.lexicalAnalysis(text);
        return result;
    }
};
AlignService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof neo4j_service_1.Neo4jService !== "undefined" && neo4j_service_1.Neo4jService) === "function" ? _a : Object, typeof (_b = typeof tencentcloud_service_1.TencentcloudService !== "undefined" && tencentcloud_service_1.TencentcloudService) === "function" ? _b : Object, typeof (_c = typeof sbd_service_1.SbdService !== "undefined" && sbd_service_1.SbdService) === "function" ? _c : Object])
], AlignService);
exports.AlignService = AlignService;


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ALIGN_RESPONSE = void 0;
exports.ALIGN_RESPONSE = {
    "articles": [
        {
            "text": "多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。最初他们带来了磁石。一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。“万物皆有灵，”吉卜赛人用嘶哑的嗓音宣告，“只需唤起它们的灵性。”",
            "lang": "zh",
            "sentenceLineBreak": "多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。\n那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。\n世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。\n每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。\n最初他们带来了磁石。\n一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。\n他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。\n“万物皆有灵，”吉卜赛人用嘶哑的嗓音宣告，“只需唤起它们的灵性。”",
            "sentenceArray": [
                "多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。",
                "那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。",
                "世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。",
                "每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。",
                "最初他们带来了磁石。",
                "一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。",
                "他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。",
                "“万物皆有灵，”吉卜赛人用嘶哑的嗓音宣告，“只需唤起它们的灵性。”"
            ]
        },
        {
            "text": "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos. El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo. Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos. Primero llevaron el imán. Un gitano corpulento, de barba montaraz y manos de gorrión, que se presentó con el nombre de Melquiades, hizo una truculenta demostración pública de lo que él mismo llamaba la octava maravilla de los sabios alquimistas de Macedonia. Fue de casa en casa arrastrando dos lingotes metálicos, y todo el mundo se espantó al ver que los calderos, las pailas, las tenazas y los anafes se caían de su sitio, y las maderas crujían por la desesperación de los clavos y los tornillos tratando de desenclavarse, y aun los objetos perdidos desde hacía mucho tiempo aparecían por donde más se les había buscado, y se arrastraban en desbandada turbulenta detrás de los fierros mágicos de Melquíades. «Las cosas, tienen vida propia -pregonaba el gitano con áspero acento-, todo es cuestión de despertarles el ánima.»",
            "lang": "es",
            "sentenceArray": [
                "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.",
                "Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos.",
                "El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo.",
                "Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos.",
                "Primero llevaron el imán.",
                "Un gitano corpulento, de barba montaraz y manos de gorrión, que se presentó con el nombre de Melquiades, hizo una truculenta demostración pública de lo que él mismo llamaba la octava maravilla de los sabios alquimistas de Macedonia.",
                "Fue de casa en casa arrastrando dos lingotes metálicos, y todo el mundo se espantó al ver que los calderos, las pailas, las tenazas y los anafes se caían de su sitio, y las maderas crujían por la desesperación de los clavos y los tornillos tratando de desenclavarse, y aun los objetos perdidos desde hacía mucho tiempo aparecían por donde más se les había buscado, y se arrastraban en desbandada turbulenta detrás de los fierros mágicos de Melquíades.",
                "«Las cosas, tienen vida propia -pregonaba el gitano con áspero acento-, todo es cuestión de despertarles el ánima.»"
            ],
            "sentenceLineBreak": "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos. El mundo era tan reciente, que muchas cosas carecían de nombre, y para mencionarlas había que señalarlas con el dedo. Todos los años, por el mes de marzo, una familia de gitanos desarrapados plantaba su carpa cerca de la aldea, y con un grande alboroto de pitos y timbales daban a conocer los nuevos inventos. Primero llevaron el imán. Un gitano corpulento, de barba montaraz y manos de gorrión, que se presentó con el nombre de Melquiades, hizo una truculenta demostración pública de lo que él mismo llamaba la octava maravilla de los sabios alquimistas de Macedonia. Fue de casa en casa arrastrando dos lingotes metálicos, y todo el mundo se espantó al ver que los calderos, las pailas, las tenazas y los anafes se caían de su sitio, y las maderas crujían por la desesperación de los clavos y los tornillos tratando de desenclavarse, y aun los objetos perdidos desde hacía mucho tiempo aparecían por donde más se les había buscado, y se arrastraban en desbandada turbulenta detrás de los fierros mágicos de Melquíades. «Las cosas, tienen vida propia -pregonaba el gitano con áspero acento-, todo es cuestión de despertarles el ánima.»",
            "sentenceTranslatedLineBreak": "许多年后，在行刑队面前，奥雷利亚诺·布恩迪亚上校不得不记得那个遥远的下午，当时他的父亲带他去了解冰层。\n马孔多当时是一个由20座泥浆和甘蔗建造的村庄，建在一条透明的河岸上，河水奔涌而过，河床上铺着抛光的白色巨石，就像史前的鸡蛋一样。\n世界是如此之近，以至于很多东西都没有名字，要提到它们，你必须用手指指出它们。\n每年的三月份，都会有一家四分五裂的吉普赛人在村子附近搭起帐篷，伴随着一片喧嚣，他们把这些新发明公之于众。\n他们先拿走了磁铁。\n一位胖乎乎的吉普赛人，留着胡须，手是麻雀的手，化名梅尔奎德斯(Melquiades)，粗暴地公开展示了他自己所说的马其顿智慧炼金术士的第八大奇迹。\n他挨家挨户地拖着两个金属锭，每个人都吓坏了，看到大锅、水桶、钳子和腰果从他们的地方掉了出来，森林因为钉子和螺丝试图松开钉子的绝望而吱吱作响，甚至很长时间丢失的东西都出现在他们最想要的地方，在梅尔金神奇的熨斗后面乱七八糟地腐烂。\n“万物，他们有自己的生活，”吉普赛人带着刺耳的口音喊道，“这一切都是唤醒他们灵魂的问题。”",
            "sentenceTranslatedArray": [
                "许多年后，在行刑队面前，奥雷利亚诺·布恩迪亚上校不得不记得那个遥远的下午，当时他的父亲带他去了解冰层。",
                "马孔多当时是一个由20座泥浆和甘蔗建造的村庄，建在一条透明的河岸上，河水奔涌而过，河床上铺着抛光的白色巨石，就像史前的鸡蛋一样。",
                "世界是如此之近，以至于很多东西都没有名字，要提到它们，你必须用手指指出它们。",
                "每年的三月份，都会有一家四分五裂的吉普赛人在村子附近搭起帐篷，伴随着一片喧嚣，他们把这些新发明公之于众。",
                "他们先拿走了磁铁。",
                "一位胖乎乎的吉普赛人，留着胡须，手是麻雀的手，化名梅尔奎德斯(Melquiades)，粗暴地公开展示了他自己所说的马其顿智慧炼金术士的第八大奇迹。",
                "他挨家挨户地拖着两个金属锭，每个人都吓坏了，看到大锅、水桶、钳子和腰果从他们的地方掉了出来，森林因为钉子和螺丝试图松开钉子的绝望而吱吱作响，甚至很长时间丢失的东西都出现在他们最想要的地方，在梅尔金神奇的熨斗后面乱七八糟地腐烂。",
                "“万物，他们有自己的生活，”吉普赛人带着刺耳的口音喊道，“这一切都是唤醒他们灵魂的问题。”"
            ]
        }
    ],
    "relations": [
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 0,
                    "text": "许多年后，在行刑队面前，奥雷利亚诺·布恩迪亚上校不得不记得那个遥远的下午，当时他的父亲带他去了解冰层。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 0,
                    "text": "多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.9640255934168331,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 0,
                    "text": "许多年后，在行刑队面前，奥雷利亚诺·布恩迪亚上校不得不记得那个遥远的下午，当时他的父亲带他去了解冰层。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 1,
                    "text": "那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5809431335773242,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 0,
                    "text": "许多年后，在行刑队面前，奥雷利亚诺·布恩迪亚上校不得不记得那个遥远的下午，当时他的父亲带他去了解冰层。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 2,
                    "text": "世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.46346410188444953,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 1,
                    "text": "马孔多当时是一个由20座泥浆和甘蔗建造的村庄，建在一条透明的河岸上，河水奔涌而过，河床上铺着抛光的白色巨石，就像史前的鸡蛋一样。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 0,
                    "text": "多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5381040967367505,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 1,
                    "text": "马孔多当时是一个由20座泥浆和甘蔗建造的村庄，建在一条透明的河岸上，河水奔涌而过，河床上铺着抛光的白色巨石，就像史前的鸡蛋一样。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 1,
                    "text": "那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.7472110548936419,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 1,
                    "text": "马孔多当时是一个由20座泥浆和甘蔗建造的村庄，建在一条透明的河岸上，河水奔涌而过，河床上铺着抛光的白色巨石，就像史前的鸡蛋一样。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 2,
                    "text": "世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.49612185848291623,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 1,
                    "text": "马孔多当时是一个由20座泥浆和甘蔗建造的村庄，建在一条透明的河岸上，河水奔涌而过，河床上铺着抛光的白色巨石，就像史前的鸡蛋一样。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 3,
                    "text": "每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.514022991321365,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 2,
                    "text": "世界是如此之近，以至于很多东西都没有名字，要提到它们，你必须用手指指出它们。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 0,
                    "text": "多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.49851924998325603,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 2,
                    "text": "世界是如此之近，以至于很多东西都没有名字，要提到它们，你必须用手指指出它们。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 1,
                    "text": "那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.480054400287351,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 2,
                    "text": "世界是如此之近，以至于很多东西都没有名字，要提到它们，你必须用手指指出它们。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 2,
                    "text": "世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.8544605127769109,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 2,
                    "text": "世界是如此之近，以至于很多东西都没有名字，要提到它们，你必须用手指指出它们。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 3,
                    "text": "每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5232330392970047,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 2,
                    "text": "世界是如此之近，以至于很多东西都没有名字，要提到它们，你必须用手指指出它们。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 4,
                    "text": "最初他们带来了磁石。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.4836785348514172,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 3,
                    "text": "每年的三月份，都会有一家四分五裂的吉普赛人在村子附近搭起帐篷，伴随着一片喧嚣，他们把这些新发明公之于众。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 1,
                    "text": "那时的马孔多是一个二十户人家的村落，泥巴和芦苇盖成的屋子沿河岸排开，湍急的河水清澈见底，河床里卵石洁白光滑宛如史前巨蛋。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5367023376810451,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 3,
                    "text": "每年的三月份，都会有一家四分五裂的吉普赛人在村子附近搭起帐篷，伴随着一片喧嚣，他们把这些新发明公之于众。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 2,
                    "text": "世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5337726649644312,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 3,
                    "text": "每年的三月份，都会有一家四分五裂的吉普赛人在村子附近搭起帐篷，伴随着一片喧嚣，他们把这些新发明公之于众。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 3,
                    "text": "每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5955344850178599,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 3,
                    "text": "每年的三月份，都会有一家四分五裂的吉普赛人在村子附近搭起帐篷，伴随着一片喧嚣，他们把这些新发明公之于众。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 4,
                    "text": "最初他们带来了磁石。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.44306764415258926,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 3,
                    "text": "每年的三月份，都会有一家四分五裂的吉普赛人在村子附近搭起帐篷，伴随着一片喧嚣，他们把这些新发明公之于众。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 5,
                    "text": "一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5724190121645596,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 4,
                    "text": "他们先拿走了磁铁。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 2,
                    "text": "世界新生伊始，许多事物还没有名字，提到的时候尚需用手指指点点。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5212825481126934,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 4,
                    "text": "他们先拿走了磁铁。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 3,
                    "text": "每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5399788387235259,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 4,
                    "text": "他们先拿走了磁铁。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 4,
                    "text": "最初他们带来了磁石。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.6131389421867188,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 4,
                    "text": "他们先拿走了磁铁。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 5,
                    "text": "一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.47576295432426596,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 4,
                    "text": "他们先拿走了磁铁。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 6,
                    "text": "他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5716933218633556,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 5,
                    "text": "一位胖乎乎的吉普赛人，留着胡须，手是麻雀的手，化名梅尔奎德斯(Melquiades)，粗暴地公开展示了他自己所说的马其顿智慧炼金术士的第八大奇迹。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 3,
                    "text": "每年三月前后，一家衣衫褴褛的吉卜赛人都会来到村边扎下帐篷，击鼓鸣笛，在喧闹欢腾中介绍新近的发明。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5045177679746256,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 5,
                    "text": "一位胖乎乎的吉普赛人，留着胡须，手是麻雀的手，化名梅尔奎德斯(Melquiades)，粗暴地公开展示了他自己所说的马其顿智慧炼金术士的第八大奇迹。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 4,
                    "text": "最初他们带来了磁石。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.4656380569697931,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 5,
                    "text": "一位胖乎乎的吉普赛人，留着胡须，手是麻雀的手，化名梅尔奎德斯(Melquiades)，粗暴地公开展示了他自己所说的马其顿智慧炼金术士的第八大奇迹。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 5,
                    "text": "一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.8441228250421051,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 5,
                    "text": "一位胖乎乎的吉普赛人，留着胡须，手是麻雀的手，化名梅尔奎德斯(Melquiades)，粗暴地公开展示了他自己所说的马其顿智慧炼金术士的第八大奇迹。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 6,
                    "text": "他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5194889050572544,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 5,
                    "text": "一位胖乎乎的吉普赛人，留着胡须，手是麻雀的手，化名梅尔奎德斯(Melquiades)，粗暴地公开展示了他自己所说的马其顿智慧炼金术士的第八大奇迹。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 7,
                    "text": "“万物皆有灵，”吉卜赛人用嘶哑的嗓音宣告，“只需唤起它们的灵性。”",
                    "lang": "zh"
                }
            ],
            "similarity": 0.4884725489655688,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 6,
                    "text": "他挨家挨户地拖着两个金属锭，每个人都吓坏了，看到大锅、水桶、钳子和腰果从他们的地方掉了出来，森林因为钉子和螺丝试图松开钉子的绝望而吱吱作响，甚至很长时间丢失的东西都出现在他们最想要的地方，在梅尔金神奇的熨斗后面乱七八糟地腐烂。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 4,
                    "text": "最初他们带来了磁石。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.49302958651901985,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 6,
                    "text": "他挨家挨户地拖着两个金属锭，每个人都吓坏了，看到大锅、水桶、钳子和腰果从他们的地方掉了出来，森林因为钉子和螺丝试图松开钉子的绝望而吱吱作响，甚至很长时间丢失的东西都出现在他们最想要的地方，在梅尔金神奇的熨斗后面乱七八糟地腐烂。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 5,
                    "text": "一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5482225228013886,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 6,
                    "text": "他挨家挨户地拖着两个金属锭，每个人都吓坏了，看到大锅、水桶、钳子和腰果从他们的地方掉了出来，森林因为钉子和螺丝试图松开钉子的绝望而吱吱作响，甚至很长时间丢失的东西都出现在他们最想要的地方，在梅尔金神奇的熨斗后面乱七八糟地腐烂。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 6,
                    "text": "他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.7996917122815171,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 6,
                    "text": "他挨家挨户地拖着两个金属锭，每个人都吓坏了，看到大锅、水桶、钳子和腰果从他们的地方掉了出来，森林因为钉子和螺丝试图松开钉子的绝望而吱吱作响，甚至很长时间丢失的东西都出现在他们最想要的地方，在梅尔金神奇的熨斗后面乱七八糟地腐烂。",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 7,
                    "text": "“万物皆有灵，”吉卜赛人用嘶哑的嗓音宣告，“只需唤起它们的灵性。”",
                    "lang": "zh"
                }
            ],
            "similarity": 0.4949195077849855,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 7,
                    "text": "“万物，他们有自己的生活，”吉普赛人带着刺耳的口音喊道，“这一切都是唤醒他们灵魂的问题。”",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 5,
                    "text": "一个身形肥大的吉卜赛人，胡须蓬乱，手如雀爪，自称梅尔基亚德斯，当众进行了一场可惊可怖的展示，号称是出自马其顿诸位炼金大师之手的第八大奇迹。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.5362431015437898,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 7,
                    "text": "“万物，他们有自己的生活，”吉普赛人带着刺耳的口音喊道，“这一切都是唤醒他们灵魂的问题。”",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 6,
                    "text": "他拖着两块金属锭走家串户，引发的景象使所有人目瞪口呆：铁锅、铁盆、铁钳、小铁炉纷纷跌落，木板因钉子绝望挣扎、螺丝奋力挣脱而吱嘎作响，甚至连那些丢失多日的物件也在久寻不见的地方出现，一窝蜂似的追随在梅尔基亚德斯的魔铁后面。",
                    "lang": "zh"
                }
            ],
            "similarity": 0.4780962106621851,
            "method": "tmt-relay"
        },
        {
            "nodes": [
                {
                    "articleIndex": 1,
                    "sentenceIndex": 7,
                    "text": "“万物，他们有自己的生活，”吉普赛人带着刺耳的口音喊道，“这一切都是唤醒他们灵魂的问题。”",
                    "lang": "es"
                },
                {
                    "articleIndex": 0,
                    "sentenceIndex": 7,
                    "text": "“万物皆有灵，”吉卜赛人用嘶哑的嗓音宣告，“只需唤起它们的灵性。”",
                    "lang": "zh"
                }
            ],
            "similarity": 0.7162904912371234,
            "method": "tmt-relay"
        }
    ]
};


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Neo4jModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Neo4jModule = void 0;
const common_1 = __webpack_require__(3);
const neo4j_service_1 = __webpack_require__(6);
const neo4j_contants_1 = __webpack_require__(8);
const neo4j_util_1 = __webpack_require__(23);
let Neo4jModule = Neo4jModule_1 = class Neo4jModule {
    static forRoot(config) {
        return {
            module: Neo4jModule_1,
            providers: [
                neo4j_service_1.Neo4jService,
                {
                    provide: neo4j_contants_1.NEO4J_CONFIG,
                    useValue: config,
                },
                {
                    provide: neo4j_contants_1.NEO4J_DRIVER,
                    inject: [neo4j_contants_1.NEO4J_CONFIG],
                    useFactory: async (config) => neo4j_util_1.createDriver(config),
                }
            ],
            exports: [
                neo4j_service_1.Neo4jService,
            ]
        };
    }
};
Neo4jModule = Neo4jModule_1 = __decorate([
    common_1.Module({})
], Neo4jModule);
exports.Neo4jModule = Neo4jModule;


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDriver = void 0;
const neo4j_driver_1 = __webpack_require__(9);
const createDriver = async (config) => {
    const driver = neo4j_driver_1.default.driver(`${config.scheme}://${config.host}:${config.port}`, neo4j_driver_1.default.auth.basic(config.username, config.password));
    await driver.verifyConnectivity();
    return driver;
};
exports.createDriver = createDriver;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TencentcloudModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TencentcloudModule = void 0;
const common_1 = __webpack_require__(3);
const tencentcloud_service_1 = __webpack_require__(12);
const tencentcloud_contants_1 = __webpack_require__(13);
const tencentcloud_util_1 = __webpack_require__(25);
let TencentcloudModule = TencentcloudModule_1 = class TencentcloudModule {
    static forRoot(config) {
        return {
            module: TencentcloudModule_1,
            providers: [
                tencentcloud_service_1.TencentcloudService,
                {
                    provide: tencentcloud_contants_1.TENCENTCLOUD_CONFIG,
                    useValue: config,
                },
                {
                    provide: tencentcloud_contants_1.TENCENTCLOUD_CLIENT,
                    inject: [tencentcloud_contants_1.TENCENTCLOUD_CONFIG],
                    useFactory: async (config) => tencentcloud_util_1.createClient(config),
                },
                {
                    provide: tencentcloud_contants_1.TENCENTCLOUD_TMT_CLIENT,
                    inject: [tencentcloud_contants_1.TENCENTCLOUD_CONFIG],
                    useFactory: async (config) => tencentcloud_util_1.createTmtClient(config),
                },
            ],
            exports: [
                tencentcloud_service_1.TencentcloudService,
            ]
        };
    }
};
TencentcloudModule = TencentcloudModule_1 = __decorate([
    common_1.Module({
        providers: [tencentcloud_service_1.TencentcloudService],
        exports: [tencentcloud_service_1.TencentcloudService],
    })
], TencentcloudModule);
exports.TencentcloudModule = TencentcloudModule;


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTmtClient = exports.createClient = void 0;
const tencentcloud = __webpack_require__(26);
const createClient = async (config) => {
    const nlpClient = new tencentcloud.nlp.v20190408.Client(config);
    return nlpClient;
};
exports.createClient = createClient;
const createTmtClient = async (config) => {
    const tmtClient = new tencentcloud.tmt.v20180321.Client(config);
    return tmtClient;
};
exports.createTmtClient = createTmtClient;


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("tencentcloud-sdk-nodejs");;

/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SbdModule = void 0;
const common_1 = __webpack_require__(3);
const sbd_service_1 = __webpack_require__(10);
let SbdModule = class SbdModule {
};
SbdModule = __decorate([
    common_1.Module({
        providers: [sbd_service_1.SbdService],
        exports: [sbd_service_1.SbdService],
    })
], SbdModule);
exports.SbdModule = SbdModule;


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XlsxModule = void 0;
const common_1 = __webpack_require__(3);
const xlsx_service_1 = __webpack_require__(17);
let XlsxModule = class XlsxModule {
};
XlsxModule = __decorate([
    common_1.Module({
        providers: [xlsx_service_1.XlsxService],
        exports: [xlsx_service_1.XlsxService],
    })
], XlsxModule);
exports.XlsxModule = XlsxModule;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Neo4jCredential = exports.TencentcloudCredential = void 0;
exports.TencentcloudCredential = {
    credential: {
        secretId: "AKIDvfDKC4Y9NWd56shlfbYXGSQWbQr0ZZgf",
        secretKey: "v74sTKSOBvT2MSMyMVQ5VekQL0OWWKsA",
    },
    region: "ap-guangzhou",
    profile: {
        signMethod: "HmacSHA256",
        httpProfile: {
            reqMethod: "POST",
            reqTimeout: 30,
        },
    }
};
exports.Neo4jCredential = {
    scheme: 'bolt',
    host: 'localhost',
    port: 7687,
    username: 'neo4j',
    password: 'FengTu',
};


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlignModule = void 0;
const common_1 = __webpack_require__(3);
const neo4j_module_1 = __webpack_require__(22);
const tencentcloud_module_1 = __webpack_require__(24);
const sbd_module_1 = __webpack_require__(27);
const admin_credentials_1 = __webpack_require__(29);
const align_service_1 = __webpack_require__(20);
let AlignModule = class AlignModule {
};
AlignModule = __decorate([
    common_1.Module({
        imports: [
            sbd_module_1.SbdModule,
            neo4j_module_1.Neo4jModule.forRoot(admin_credentials_1.Neo4jCredential),
            tencentcloud_module_1.TencentcloudModule.forRoot(admin_credentials_1.TencentcloudCredential)
        ],
        providers: [align_service_1.AlignService],
    })
], AlignModule);
exports.AlignModule = AlignModule;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(0);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;