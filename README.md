# suoyan.pro

Parallel Text Alignment Tool | 平行语料对齐工具

Neo4j + Vue.js + NestJS

![](https://github.com/TienZhao/suoyan.pro/raw/main/readme.example.gif)

## Introduction

### Product Introduction

- Suoyan.pro is a text alignment tool powered by artificial intelligence, offering linguistics and translation researchers an efficient solution to build bilingual parallel courpus. 
- Suoyan.pro currently supports the following language pairs: Chinese-English, Chinese-Spanish, Chinese-German, Chinese-French, and Chinese-Russian.
- In small sample tests, suoyan.pro has achieved very high alignment accuracy. And the developer hopes to collaborate with other professionals to carry out larger scale experiments.
- The code of suoyan.pro is open source with MIT license and is freely available to all.

### Technology Introduction

- The technical structure of suoyan.pro includes three parts: Neo4j database, NestJS back-end and Vue front-end. It also uses the services of natural language processing and machine translation offered by Tencent Cloud.

#### Docker

- `docker-compose.yml` is located in the root directory, where you can run the whole project with`docker-compose up` command.

#### Neo4j

- The Neo4j graph database is located in the `neo4j` directory. Neo4j runs at `localhost:7474` by default and it can be be accessed through a browser.
- Before running the NestJS backend, you also need to configure the account, password, and port of Neo4j in the `server\apps\admin\src\admin.credentials.ts` file. The example is as follows.

```typescript
export const Neo4jCredential: Neo4jConfig = {
    scheme : 'bolt',
    host : 'localhost',
    port : 7687,
    username : '', // Your username here.
    password : '', // Your password here.
  }
```

#### NestJS

- The NestJS backend framework is located in the `server` directory, in which you can run NestJS in hot reload mode with the `nest start -w admin` command. NestJS runs at `localhost:3000` by default, and the interface documentation Swagger runs at `localhost:3000/api-docs/`, both of which can be be accessed through a browser.
- NestJS code is written in Typescript.

#### Vue

- ,The Vue front-end framework is located in the `admin` directory, in which you can run Vue with the `npm run serve` command on `localhost:8080` and access it with a browser.
- Vue code is written in Typescript. It uses Element UI and Echarts component libraries .

#### Nginx

- `nginx.config` is located in `admin` directory.
- Nginx runs the built Vue code in `admin/dist` and forwards it to`localhost:8081`.

#### Tencent Cloud Service

- For security reasons, the account password of Tencent Cloud is not included in the scope of git. You need to register your own account in Tencent Cloud and add the configurations in the `server\apps\admin\src\admin.credentials.ts` file, in order to use the related services. 

- If the interface call exceeds the free quota, Tencent Cloud will charge your account and the developer of suoyan.pro is not involved in this process. 

- The configuration example is as follows.

```typescript
export const TencentcloudCredential: ClientConfig = {
    credential: {
      secretId: "", // Your Secret ID here.
      secretKey: "", // Your Secret key here.
    },
    region: "ap-guangzhou", // Tencentcloud NLP service only available in this region.
    profile: {
      signMethod: "HmacSHA256",
      httpProfile: {
        reqMethod: "POST",
        reqTimeout: 30,
      },
    }
  }
```

### Future Steps

The developer of suoyan.pro wants to work with other professionals to make progress in the following fields.

- Deploying suoyan.pro to a server and run it for everyone.
- Adding more language pairs by using NLP services from Google Cloud and other global cloud service providers.
- Run Bert models for text Embedding on local server through TensorflowJS, leading to better scalability and lower price.
- Add user account system and customized lexicon feature.
- Translate the page UI into more languages.



## 介绍

### 产品简介

所言是一款双语平行语料对齐工具，基于人工智能技术研发，为语言学和翻译学专业人士提供便捷高效的语料对齐解决方案。
所言目前支持的语言对包括：汉语-英语、汉语-西班牙语、汉语-法语、汉语-德语、汉语-俄语。
所言在小样本测试中取得了非常高的对齐精确度，开发者希望能够和专业人士合作，进行更大规模的实验。
所言的程序代码基于MIT协议开源，所有人可以自由使用。

### 技术简介

所言的技术架构包括Neo4j数据库、NestJS后端、Vue前端、Nginx服务器，运行于4个独立的Docker容器内。所言也使用腾讯云的自然语言处理和机器翻译服务。

#### Docker

`docker-compose.yml`文件位于根目录中，可以使用`docker-compose up`命令运行整个项目。

#### Neo4j

Neo4j图数据库位于`neo4j`目录中，默认运行在`localhost:7474`，可以通过浏览器进行访问。
运行NestJS后端之前，需要配置`server\apps\admin\src\admin.credentials.ts`文件中的Neo4j账号、密码、端口。示例如下：

```typescript
export const Neo4jCredential: Neo4jConfig = {
    scheme : 'bolt',
    host : 'localhost',
    port : 7687,
    username : '', // Your username here.
    password : '', // Your password here.
  }
```

#### NestJS

NestJS后端框架位于`server`目录中，可以在该目录下使用`nest start -w admin`命令进行热重载运行，NestJS默认运行在`localhost:3000`，接口文档Swagger运行在`localhost:3000/api-docs/`，可以通过浏览器进行访问。
NestJS代码以Typescript语言撰写。

#### Vue

Vue前端框架位于`admin`目录中，可以在该目录下，使用`npm run serve`命令运行到`localhost:8080`，并通过浏览器进行访问。
Vue代码以Typescript语言撰写，使用了Element UI和Echarts组件库。

#### Nginx

`nginx.config`位于`admin`目录中。

Nginx运行`admin/dist`中编译后的Vue代码，并转发到`localhost:8081`。

#### 腾讯云

出于安全原因，腾讯云的账号密码未被收录在git范围内，你需要在腾讯云注册自己的账号，并将账号密码填写在`server\apps\admin\src\admin.credentials.ts`文件中，进而使用相关的服务。如果接口调用超出免费额度，腾讯云将会对您的账号计费。配置示例如下：

```typescript
export const TencentcloudCredential: ClientConfig = {
    credential: {
      secretId: "", // Your Secret ID here.
      secretKey: "", // Your Secret key here.
    },
    region: "ap-guangzhou", // Tencentcloud NLP service only available in this region.
    profile: {
      signMethod: "HmacSHA256",
      httpProfile: {
        reqMethod: "POST",
        reqTimeout: 30,
      },
    }
  }
```

### 未来展望

开发者希望能够和其他开发者一起合作，在以下方向上取得进步：

- 将网站部署到服务器并上线运行。
- 使用Google Cloud或其他云服务提供商的自然语言处理、机器翻译服务，从而增加更多语言对的支持。
- 通过TensorflowJS，运行本地的Bert模型，进行文本Embedding，从而增加更多语言对的支持，同时降低大规模使用成本。
- 增加用户体系和自定义词库。
- 增加更多语言的页面UI。