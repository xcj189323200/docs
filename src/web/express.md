---
title: Express
copyright: true
password:
tags:
 - NODE
 - Express
categories:
 - 后端
 - NODE
 - Express
comments: true
---
# express
## express 是什么
Express是目前最流行的基于Node.js的Web开发框架，可以快速地搭建一个完整功能的网站。

## express 中间件
中间件（middleware）就是处理HTTP请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。App实例在运行过程中，会调用一系列的中间件。

每个中间件可以从App实例，接收三个参数，依次为request对象（代表HTTP请求）、response对象（代表HTTP回应），next回调函数（代表下一个中间件）。每个中间件都可以对HTTP请求（request对象）进行加工，并且决定是否调用next方法，将request对象再传给下一个中间件。

一个不进行任何操作、只传递request对象的中间件，就是下面这样。

    function uselessMiddleware(req, res, next) {
          next();
    }

上面代码的next就是下一个中间件。如果它带有参数，则代表抛出一个错误，参数为错误文本。

    function uselessMiddleware(req, res, next) {
      next('出错了！');
    }

## express 运行原理

Express框架建立在node.js内置的http模块上。http模块生成服务器的原始代码如下。

    var http = require("http");

    var app = http.createServer(function(request, response) {
      response.writeHead(200, {"Content-Type": "text/plain"});
      response.end("Hello world!");
    });

    app.listen(3000, "localhost");

上面代码的关键是http模块的createServer方法，表示生成一个HTTP服务器实例。该方法接受一个回调函数，该回调函数的参数，分别为代表HTTP请求和HTTP回应的request对象和response对象。

Express框架的核心是对http模块的再包装。上面的代码用Express改写如下。

    var express = require('express');
    var app = express();

    app.get('/', function (req, res) {
      res.send('Hello world!');
    });

    app.listen(3000);

比较两段代码，可以看到它们非常接近。原来是用http.createServer方法新建一个app实例，现在则是用Express的构造方法，生成一个Epress实例。两者的回调函数都是相同的。Express框架等于在http模块之上，加了一个中间层。

-------------

# express 准备工作
利用express 自带的生成器初始化项目
    npm install express-generator -g
> express-generator是Express4自带的命令行工具，用来初始化Express项目，所以只需要将其全局安装，而不需要将整个Express全局安装，这和Express3不同，在Express3中，命令行集成在整个Express项目中，所以必须将Express3全局安装。

使用express命令初始化项目

    express --git -f

express命令有一些可选参数，具体可以参看官方文档。这里我们只用到了两个。

> –git ：告知express生成.gitignore文件，这个文件定义了git需要忽略控制的文件，通常node_mondules会被写到此文件里。

> -f ：当目标文件夹不为空时，仍然强制执行。这里加此选项的原因是因为我们clone下来的项目里原本含有LICENSE 和 README.md两个文件。

然后 `npm install ` 安装依赖即可

 启动这个应用（MacOS 或 Linux 平台）：

    DEBUG=myapp npm start

Windows 平台使用如下命令：

    set DEBUG=myapp & npm start

然后在浏览器中打开 http://localhost:3000/ 网址就可以看到这个应用了。

--------------------------

# Express 的方法

## use() 方法
use是express注册中间件的方法，它返回一个函数。下面是一个连续调用两个中间件的例子。

    var express = require("express");
    var http = require("http");

    var app = express();

    app.use(function(request, response, next) {
      console.log("In comes a " + request.method + " to " + request.url);
      next();
    });

    app.use(function(request, response) {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.end("Hello world!\n");
    });

    http.createServer(app).listen(1337);

上面代码使用app.use方法，注册了两个中间件。收到HTTP请求后，先调用第一个中间件，在控制台输出一行信息，然后通过next方法，将执行权传给第二个中间件，输出HTTP回应。由于第二个中间件没有调用next方法，所以request对象就不再向后传递了。

use方法内部可以对访问路径进行判断，据此就能实现简单的路由，根据不同的请求网址，返回不同的网页内容。

    var express = require("express");
    var http = require("http");

    var app = express();

    app.use(function(request, response, next) {
      if (request.url == "/") {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("Welcome to the homepage!\n");
      } else {
        next();
      }
    });

    app.use(function(request, response, next) {
      if (request.url == "/about") {
        response.writeHead(200, { "Content-Type": "text/plain" });
      } else {
        next();
      }
    });

    app.use(function(request, response) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 error!\n");
    });

    http.createServer(app).listen(1337);

上面代码通过request.url属性，判断请求的网址，从而返回不同的内容。注意，app.use方法一共登记了三个中间件，只要请求路径匹配，就不会将执行权交给下一个中间件。因此，最后一个中间件会返回404错误，即前面的中间件都没匹配请求路径，找不到所要请求的资源。

除了在回调函数内部判断请求的网址，use方法也允许将请求网址写在第一个参数。这代表，只有请求路径匹配这个参数，后面的中间件才会生效。无疑，这样写更加清晰和方便。

    app.use('/path', someMiddleware);

## all方法和HTTP动词方法

针对不同的请求，Express提供了use方法的一些别名。比如，上面代码也可以用别名的形式来写。

    var express = require("express");
    var http = require("http");
    var app = express();

    app.all("*", function(request, response, next) {
      response.writeHead(200, { "Content-Type": "text/plain" });
      next();
    });

    app.get("/", function(request, response) {
      response.end("Welcome to the homepage!");
    });

    app.get("/about", function(request, response) {
      response.end("Welcome to the about page!");
    });

    app.get("*", function(request, response) {
      response.end("404!");
    });

    http.createServer(app).listen(1337);

上面代码的all方法表示，所有请求都必须通过该中间件，参数中的“*”表示对所有路径有效。get方法则是只有GET动词的HTTP请求通过该中间件，它的第一个参数是请求的路径。由于get方法的回调函数没有调用next方法，所以只要有一个中间件被调用了，后面的中间件就不会再被调用了。

除了get方法以外，Express还提供post、put、delete方法，即HTTP动词都是Express的方法。

这些方法的第一个参数，都是请求的路径。除了绝对匹配以外，Express允许模式匹配。

> 注意：app.all() 是一个特殊的路由方法，没有任何 HTTP 方法与其对应，它的作用是对于一个路径上的所有请求加载中间件。
>
     app.all('/secret', function (req, res, next) {
      console.log('Accessing the secret section ...');
      next(); // pass control to the next handler
    });

### set方法

set方法用于指定变量的值。

    app.set("views", __dirname + "/views");

    app.set("view engine", "jade");

上面代码使用set方法，为系统变量“views”和“view engine”指定值。

### response对象
#### 1.  response.redirect方法:
 > response.redirect方法允许网址的重定向。

    response.redirect("/hello/anime");
    response.redirect("http://www.example.com");
    response.redirect(301, "http://www.example.com");

#### 2.  response.sendFile方法:
> response.sendFile方法用于发送文件。以八位字节流的形式发送文件。

    response.sendFile("/path/to/anime.mp4");

#### 3.  response.render方法:
> response.render方法用于渲染网页模板。

    app.get("/", function(request, response) {
      response.render("index", { message: "Hello World" });
    });
    //上面代码使用render方法，将message变量传入index模板，渲染成HTML网页。

#### 4.  response.render方法:
> response.render方法用于渲染网页模板。下面代码使用render方法，将message变量传入index模板，渲染成HTML网页。

    app.get("/", function(request, response) {
      response.render("index", { message: "Hello World" });
    });

#### 5. res.json方法:
> 发送一个 JSON 格式的响应。

#### 6.res.end方法:
> 终结响应处理流程。

#### 7.res.sendStatus方法:
> 设置响应状态代码，并将其以字符串形式作为响应体的一部分发送。

    res.sendStatus(200); // equivalent to res.status(200).send('OK')
    res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
    res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
    res.sendStatus(500); // equivalent to res.status(500).send('Internal ServerError')

#### 8.res.cookie(name, value [, options])方法:

##### cookie的创建:

 express直接提供了api,只需要在需要使用的地方调用如下api即可

       function(req, res, next){
            ...
            res.cookie(name, value [, options]);
            ...
        }

express就会将其填入Response Header中的Set-Cookie，达到在浏览器中设置cookie的作用。

*   name: 类型为String
*   value: 类型为String和Object，如果是Object会自动调用JSON.stringify对其进行处理
*   Option: 类型为对象，可使用的属性如下：
>    domain：cookie在什么域名下有效，类型为String,。默认为网站域名
   expires: cookie过期时间，类型为Date。如果没有设置或者设置为0，那么该cookie只在这个这个session有效，即关闭浏览器后，这个cookie会被浏览器删除。
   httpOnly: 只能被web server访问，类型Boolean。
   maxAge: 实现expires的功能，设置cookie过期的时间，类型为String，指明从现在开始，多少毫秒以后，cookie到期。
   path: cookie在什么路径下有效，默认为'/'，类型为String
   secure：只能被HTTPS使用，类型Boolean，默认为false
   signed:使用签名，类型Boolean，默认为false。`express会使用req.secret来完成签名，需要cookie-parser配合使用`

    res.cookie('name', 'koby', { domain: '.example.com', path: '/admin', secure: true });
    //cookie的有效期为900000ms
    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
    //cookie的有效期为900000ms
    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true });

    //cookie的value为对象
    res.cookie('cart', { items: [1,2,3] });
    res.cookie('cart', { items: [1,2,3] }, { maxAge: 900000 });

    res.cookie('name', 'tobi', { signed: true });

##### cookie的删除
express直接提供了api删除浏览器中的cookie,只需要在需要使用的地方调用如下api即可


    function(req, res, next){
        ...
        res.clearCookie(name [, options]);
        ...
    }

利用cookie-parser读取cookie

        npm install cookie-parser --save

> cookie-parser是一个非常好用方便的插件，可以直接用在express和connect中，官文地址为https://www.npmjs.com/package/cookie-parser。npm安装命令

    var express = require('express');
    var cookieParser = require('cookie-parser');

    var app = express();
    //不使用签名
    app.use(cookieParser());  //挂载中间件，可以理解为实例化

    //若需要使用签名，需要指定一个secret,字符串,否者会报错
    app.use(cookieParser('Simon'));

 获取cookie(无签名)
> var cookies = req.cookies      # 获取cookie集合
  var value = req.cookies.key    # 获取名称为key的cookie的值

 获取cookie(有签名)
> var cookies = req.signedCookies      # 获取cookie集合
var value = req.signedCookies.key    # 获取名称为key的cookie的值

exmple:

    var express = require('express');
    var app = express();
    var cookieParser = require('cookie-parser');

    //不使用签名
    // app.use(cookieParser());  //挂载中间件，可以理解为实例化

    //若需要使用签名，需要指定一个secret,字符串,否者会报错
    app.use(cookieParser('simon'));

    // 设置cookie
    app.get('/setCookie', function (req, res, next) {
        req.secret = 'simon'; //签名不能做到加密 只能做到防止篡改
        res.cookie('name', 'iwen');
        res.cookie('signed1', 'signed2', {signed: true});
        res.cookie('rememberme', '1', {expires: new Date(Date.now() + 900000), httpOnly: true});
        res.cookie('cart', {items: [1, 2, 3]}, {maxAge: 900000});

        console.log("无签名的",req.cookies);
        console.log("有签名的",req.signedCookies);
        res.send('设置成功')
    });


    app.listen(3333, function () {
        console.log('执行了')
    });



#### 9.res.session方法:
     npm install cookie-session

cookieSession之前需要使用cookieParser中间件

    var express =require('express');
    var app = express();
    app.use(express.cookieParser('S3CRE7'));
    app.use(express.cookieSession(opt));

中间件传递参数如下：

>key : cookie键，session_id；
secret : 加密cookie值的字符串，与cookieParser中的secret功能完全相同，如果cookieParser没有传入secret参数，此处必须传入。个人角度为了主观上的感觉，采用了两个不同的值。
cookie ： 设置cookie的相关参数，即除KV对之外的expire/maxAge,httpOnly,path值
proxy ： 是否信任反向代理，默认false

example:

    var express = require('express');
    var app = express();
    var cookieParser = require('cookie-parser');
    const cookieSession = require('cookie-session');

    /* 使用session */
    var session_arr = [];
    for (var i = 0; i < 100000; i++) {
        session_arr.push('keys_' + Math.random());
    }
    app.use(cookieParser());
    app.use(cookieSession({name: 'api_session_id', keys: session_arr}));

    // 设置cookie
    app.get('/setSession', function (req, res, next) {
        if (!req.session['count']) {
            req.session['count'] = 1;
        } else {
            req.session['count']++;
        }

        console.log("访问次数", req.session['count']);
        res.send('设置成功')
    });


    app.listen(3333, function () {
        console.log('执行了')
    });

### requst对象

#### request.ip

> request.ip属性用于获得HTTP请求的IP地址。

#### request.files
> request.files用于获取上传的文件。

#### req.body
    npm install body-parse --save

>1. bodyParser.json(options): 解析json数据
1. bodyParser.raw(options): 解析二进制格式(Buffer流数据)
2. bodyParser.text(options): 解析文本数据
3. bodyParser.urlencoded(options): 解析UTF-8的编码的数据。


    var bodyParser = require('body-parser');
    //创建 application/json 解析
    app.use(bodyParser.json())
    // 创建 application/x-www-form-urlencoded 解析
    app.use(bodyParser.urlencoded({extended: false}))

    app.post('/post', function (req, res) {
     var params = req.body
      console.log(params)
      //{ params1: 'post_p1', params2: 'post_p2' }
    })

##### bodyParser.json(options) :返回一个仅解析json格式数据的中间件。
option可选对象:

>1. inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
2. limit - 设置请求的最大数据量。默认为'100kb'
3. reviver - 传递给JSON.parse()方法的第二个参数，详见JSON.parse()
4. strict - 设置为true时，仅会解析Array和Object两种格式；设置为false会解析所有JSON.parse支持的格式。默认为true
5. type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/json。
6. verify - 这个选项仅在verify(req, res, buf, encoding)时受支持

##### bodyParser.urlencoded(options) 解析UTF-8的编码的数据。
返回一个处理urlencoded数据的中间件。
option可选值：
> 1. extended - 当设置为false时，会使用querystring库解析URL编码的数据；当设置为true时，会使用qs库解析URL编码的数据。后没有指定编码时，使用此编码。默认为true
2. inflate - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
3. limit - 设置请求的最大数据量。默认为'100kb'
4. parameterLimit - 用于设置URL编码值的最大数据。默认为1000
5. type - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为application/octet-stream。
6. verify - 这个选项仅在verify(req, res, buf, encoding)时受支持


#### req.query
> 可以获得get请求参数

--------------------

# Express.Router用法
从Express 4.0开始，路由器功能成了一个单独的组件Express.Router。它好像小型的express应用程序一样，有自己的use、get、param和route方法。

## 基本用法
首先，Express.Router是一个构造函数，调用后返回一个路由器实例。然后，使用该实例的HTTP动词方法，为不同的访问路径，指定回调函数；最后，挂载到某个路径。

    var router = express.Router();

    router.get('/', function(req, res) {
      res.send('首页');
    });

    router.get('/about', function(req, res) {
      res.send('关于');
    });

    app.use('/', router);

上面代码先定义了两个访问路径，然后将它们挂载到根目录。如果最后一行改为app.use(‘/app’, router)，则相当于为/app和/app/about这两个路径，指定了回调函数。

这种路由器可以自由挂载的做法，为程序带来了更大的灵活性，既可以定义多个路由器实例，也可以为将同一个路由器实例挂载到多个路径。

## router中间件
use方法为router对象指定中间件，即在数据正式发给用户之前，对数据进行处理。下面就是一个中间件的例子。

    router.use(function(req, res, next) {
        console.log(req.method, req.url);
        next();
    });
上面代码中，回调函数的next参数，表示接受其他中间件的调用。函数体中的next()，表示将数据传递给下一个中间件。

注意，中间件的放置顺序很重要，等同于执行顺序。而且，中间件必须放在HTTP动词方法之前，否则不会执行。

## 对路径参数的处理

router对象的param方法用于路径参数的处理，可以

    router.param('name', function(req, res, next, name) {
        // 对name进行验证或其他处理……
        console.log(name);
        req.name = name;
        next();
    });

    router.get('/hello/:name', function(req, res) {
        res.send('hello ' + req.name + '!');
    });

上面代码中，get方法为访问路径指定了name参数，param方法则是对name参数进行处理。注意，param方法必须放在HTTP动词方法之前。

```