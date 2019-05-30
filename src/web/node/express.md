# express

## express 是什么

Express 是目前最流行的基于 Node.js 的 Web 开发框架，可以快速地搭建一个完整功能的网站。

## express 中间件

中间件（middleware）就是处理 HTTP 请求的函数。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。App 实例在运行过程中，会调用一系列的中间件。

每个中间件可以从 App 实例，接收三个参数，依次为 request 对象（代表 HTTP 请求）、response 对象（代表 HTTP 回应），next 回调函数（代表下一个中间件）。每个中间件都可以对 HTTP 请求（request 对象）进行加工，并且决定是否调用 next 方法，将 request 对象再传给下一个中间件。

一个不进行任何操作、只传递 request 对象的中间件，就是下面这样。

```javascript
function uselessMiddleware(req, res, next) {
  next();
}
```

上面代码的 next 就是下一个中间件。如果它带有参数，则代表抛出一个错误，参数为错误文本。

```javascript
function uselessMiddleware(req, res, next) {
  next("出错了！");
}
```

## express 运行原理

Express 框架建立在 node.js 内置的 http 模块上。http 模块生成服务器的原始代码如下。

```javascript
var http = require("http");

var app = http.createServer(function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello world!");
});

app.listen(3000, "localhost");
```

上面代码的关键是 http 模块的 createServer 方法，表示生成一个 HTTP 服务器实例。该方法接受一个回调函数，该回调函数的参数，分别为代表 HTTP 请求和 HTTP 回应的 request 对象和 response 对象。

Express 框架的核心是对 http 模块的再包装。上面的代码用 Express 改写如下。

```javascript
var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.send("Hello world!");
});

app.listen(3000);
```

比较两段代码，可以看到它们非常接近。原来是用 http.createServer 方法新建一个 app 实例，现在则是用 Express 的构造方法，生成一个 Epress 实例。两者的回调函数都是相同的。Express 框架等于在 http 模块之上，加了一个中间层。

---

# express 准备工作

利用 express 自带的生成器初始化项目
npm install express-generator -g

> express-generator 是 Express4 自带的命令行工具，用来初始化 Express 项目，所以只需要将其全局安装，而不需要将整个 Express 全局安装，这和 Express3 不同，在 Express3 中，命令行集成在整个 Express 项目中，所以必须将 Express3 全局安装。

使用 express 命令初始化项目

```javascript
express --git -f
```

express 命令有一些可选参数，具体可以参看官方文档。这里我们只用到了两个。

> –git ：告知 express 生成.gitignore 文件，这个文件定义了 git 需要忽略控制的文件，通常 node_mondules 会被写到此文件里。

> -f ：当目标文件夹不为空时，仍然强制执行。这里加此选项的原因是因为我们 clone 下来的项目里原本含有 LICENSE 和 README.md 两个文件。

然后 `npm install` 安装依赖即可

启动这个应用（MacOS 或 Linux 平台）：

```javascript
DEBUG=myapp npm start
```

Windows 平台使用如下命令：

```javascript
set DEBUG=myapp & npm start
```

然后在浏览器中打开 http://localhost:3000/ 网址就可以看到这个应用了。

---

# Express 的方法

## use() 方法

use 是 express 注册中间件的方法，它返回一个函数。下面是一个连续调用两个中间件的例子。

```javascript
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
```

上面代码使用 app.use 方法，注册了两个中间件。收到 HTTP 请求后，先调用第一个中间件，在控制台输出一行信息，然后通过 next 方法，将执行权传给第二个中间件，输出 HTTP 回应。由于第二个中间件没有调用 next 方法，所以 request 对象就不再向后传递了。

use 方法内部可以对访问路径进行判断，据此就能实现简单的路由，根据不同的请求网址，返回不同的网页内容。

```javascript
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
```

上面代码通过 request.url 属性，判断请求的网址，从而返回不同的内容。注意，app.use 方法一共登记了三个中间件，只要请求路径匹配，就不会将执行权交给下一个中间件。因此，最后一个中间件会返回 404 错误，即前面的中间件都没匹配请求路径，找不到所要请求的资源。

除了在回调函数内部判断请求的网址，use 方法也允许将请求网址写在第一个参数。这代表，只有请求路径匹配这个参数，后面的中间件才会生效。无疑，这样写更加清晰和方便。

```javascript
app.use("/path", someMiddleware);
```

## all 方法和 HTTP 动词方法

针对不同的请求，Express 提供了 use 方法的一些别名。比如，上面代码也可以用别名的形式来写。

```javascript
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
```

上面代码的 all 方法表示，所有请求都必须通过该中间件，参数中的“\*”表示对所有路径有效。get 方法则是只有 GET 动词的 HTTP 请求通过该中间件，它的第一个参数是请求的路径。由于 get 方法的回调函数没有调用 next 方法，所以只要有一个中间件被调用了，后面的中间件就不会再被调用了。

除了 get 方法以外，Express 还提供 post、put、delete 方法，即 HTTP 动词都是 Express 的方法。

这些方法的第一个参数，都是请求的路径。除了绝对匹配以外，Express 允许模式匹配。

> 注意：app.all() 是一个特殊的路由方法，没有任何 HTTP 方法与其对应，它的作用是对于一个路径上的所有请求加载中间件。

```javascript
app.all("/secret", function(req, res, next) {
  console.log("Accessing the secret section ...");
  next(); // pass control to the next handler
});
```

### set 方法

set 方法用于指定变量的值。

```javascript
app.set("views", __dirname + "/views");

app.set("view engine", "jade");
```

上面代码使用 set 方法，为系统变量“views”和“view engine”指定值。

### response 对象

#### 1. response.redirect 方法:

> response.redirect 方法允许网址的重定向。

```javascript
response.redirect("/hello/anime");
response.redirect("http://www.example.com");
response.redirect(301, "http://www.example.com");
```

#### 2. response.sendFile 方法:

> response.sendFile 方法用于发送文件。以八位字节流的形式发送文件。

```javascript
response.sendFile("/path/to/anime.mp4");
```

#### 3. response.render 方法:

> response.render 方法用于渲染网页模板。

```javascript
app.get("/", function(request, response) {
  response.render("index", { message: "Hello World" });
});
//上面代码使用render方法，将message变量传入index模板，渲染成HTML网页。
```

#### 4. response.render 方法:

> response.render 方法用于渲染网页模板。下面代码使用 render 方法，将 message 变量传入 index 模板，渲染成 HTML 网页。

```javascript
app.get("/", function(request, response) {
  response.render("index", { message: "Hello World" });
});
```

#### 5. res.json 方法:

> 发送一个 JSON 格式的响应。

#### 6.res.end 方法:

> 终结响应处理流程。

#### 7.res.sendStatus 方法:

> 设置响应状态代码，并将其以字符串形式作为响应体的一部分发送。

```javascript
res.sendStatus(200); // equivalent to res.status(200).send('OK')
res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
res.sendStatus(500); // equivalent to res.status(500).send('Internal ServerError')
```

#### 8.res.cookie(name, value [, options])方法:

##### cookie 的创建:

express 直接提供了 api,只需要在需要使用的地方调用如下 api 即可

```javascript
function(req, res, next){
    ...
    res.cookie(name, value [, options]);
    ...
}
```

express 就会将其填入 Response Header 中的 Set-Cookie，达到在浏览器中设置 cookie 的作用。

- name: 类型为 String
- value: 类型为 String 和 Object，如果是 Object 会自动调用 JSON.stringify 对其进行处理
- Option: 类型为对象，可使用的属性如下：

  > domain：cookie 在什么域名下有效，类型为 String,。默认为网站域名
  > expires: cookie 过期时间，类型为 Date。如果没有设置或者设置为 0，那么该 cookie 只在这个这个 session 有效，即关闭浏览器后，这个 cookie 会被浏览器删除。
  > httpOnly: 只能被 web server 访问，类型 Boolean。
  > maxAge: 实现 expires 的功能，设置 cookie 过期的时间，类型为 String，指明从现在开始，多少毫秒以后，cookie 到期。
  > path: cookie 在什么路径下有效，默认为'/'，类型为 String
  > secure：只能被 HTTPS 使用，类型 Boolean，默认为 false
  > signed:使用签名，类型 Boolean，默认为 false。`express会使用req.secret来完成签名，需要cookie-parser配合使用`

```javascript
res.cookie("name", "koby", {
  domain: ".example.com",
  path: "/admin",
  secure: true
});
//cookie的有效期为900000ms
res.cookie("rememberme", "1", {
  expires: new Date(Date.now() + 900000),
  httpOnly: true
});
//cookie的有效期为900000ms
res.cookie("rememberme", "1", { maxAge: 900000, httpOnly: true });

//cookie的value为对象
res.cookie("cart", { items: [1, 2, 3] });
res.cookie("cart", { items: [1, 2, 3] }, { maxAge: 900000 });

res.cookie("name", "tobi", { signed: true });
```

##### cookie 的删除

express 直接提供了 api 删除浏览器中的 cookie,只需要在需要使用的地方调用如下 api 即可

```javascript
function(req, res, next){
    ...
    res.clearCookie(name [, options]);
    ...
}
```

利用 cookie-parser 读取 cookie

```javascript
npm install cookie-parser --save
```

> cookie-parser 是一个非常好用方便的插件，可以直接用在 express 和 connect 中，官文地址为https://www.npmjs.com/package/cookie-parser。npm安装命令

```javascript
var express = require("express");
var cookieParser = require("cookie-parser");

var app = express();
//不使用签名
app.use(cookieParser()); //挂载中间件，可以理解为实例化

//若需要使用签名，需要指定一个secret,字符串,否者会报错
app.use(cookieParser("Simon"));
```

获取 cookie(无签名)

> var cookies = req.cookies # 获取 cookie 集合
> var value = req.cookies.key # 获取名称为 key 的 cookie 的值

获取 cookie(有签名)

> var cookies = req.signedCookies # 获取 cookie 集合
> var value = req.signedCookies.key # 获取名称为 key 的 cookie 的值

exmple:

```javascript
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");

//不使用签名
// app.use(cookieParser());  //挂载中间件，可以理解为实例化

//若需要使用签名，需要指定一个secret,字符串,否者会报错
app.use(cookieParser("simon"));

// 设置cookie
app.get("/setCookie", function(req, res, next) {
  req.secret = "simon"; //签名不能做到加密 只能做到防止篡改
  res.cookie("name", "iwen");
  res.cookie("signed1", "signed2", { signed: true });
  res.cookie("rememberme", "1", {
    expires: new Date(Date.now() + 900000),
    httpOnly: true
  });
  res.cookie("cart", { items: [1, 2, 3] }, { maxAge: 900000 });

  console.log("无签名的", req.cookies);
  console.log("有签名的", req.signedCookies);
  res.send("设置成功");
});

app.listen(3333, function() {
  console.log("执行了");
});
```

#### 9.res.session 方法:

```javascript
npm install cookie-session
```

cookieSession 之前需要使用 cookieParser 中间件

```javascript
var express = require("express");
var app = express();
app.use(express.cookieParser("S3CRE7"));
app.use(express.cookieSession(opt));
```

中间件传递参数如下：

> key : cookie 键，session_id；
> secret : 加密 cookie 值的字符串，与 cookieParser 中的 secret 功能完全相同，如果 cookieParser 没有传入 secret 参数，此处必须传入。个人角度为了主观上的感觉，采用了两个不同的值。
> cookie ： 设置 cookie 的相关参数，即除 KV 对之外的 expire/maxAge,httpOnly,path 值
> proxy ： 是否信任反向代理，默认 false

example:

```javascript
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

/* 使用session */
var session_arr = [];
for (var i = 0; i < 100000; i++) {
  session_arr.push("keys_" + Math.random());
}
app.use(cookieParser());
app.use(cookieSession({ name: "api_session_id", keys: session_arr }));

// 设置cookie
app.get("/setSession", function(req, res, next) {
  if (!req.session["count"]) {
    req.session["count"] = 1;
  } else {
    req.session["count"]++;
  }

  console.log("访问次数", req.session["count"]);
  res.send("设置成功");
});

app.listen(3333, function() {
  console.log("执行了");
});
```

### requst 对象

#### request.ip

> request.ip 属性用于获得 HTTP 请求的 IP 地址。

#### request.files

> request.files 用于获取上传的文件。

#### req.body

```javascript
npm install body-parse --save
```

> 1.  bodyParser.json(options): 解析 json 数据

1. bodyParser.raw(options): 解析二进制格式(Buffer 流数据)
2. bodyParser.text(options): 解析文本数据
3. bodyParser.urlencoded(options): 解析 UTF-8 的编码的数据。

```javascript
var bodyParser = require("body-parser");
//创建 application/json 解析
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/post", function(req, res) {
  var params = req.body;
  console.log(params);
  //{ params1: 'post_p1', params2: 'post_p2' }
});
```

##### bodyParser.json(options) :返回一个仅解析 json 格式数据的中间件。

option 可选对象:

> 1.  inflate - 设置为 true 时，deflate 压缩数据会被解压缩；设置为 true 时，deflate 压缩数据会被拒绝。默认为 true。

2. limit - 设置请求的最大数据量。默认为'100kb'
3. reviver - 传递给 JSON.parse()方法的第二个参数，详见 JSON.parse()
4. strict - 设置为 true 时，仅会解析 Array 和 Object 两种格式；设置为 false 会解析所有 JSON.parse 支持的格式。默认为 true
5. type - 该选项用于设置为指定 MIME 类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用 type-is 来查找 MIMI 类型；当为函数是，中间件会通过 fn(req)来获取实际值。默认为 application/json。
6. verify - 这个选项仅在 verify(req, res, buf, encoding)时受支持

##### bodyParser.urlencoded(options) 解析 UTF-8 的编码的数据。

返回一个处理 urlencoded 数据的中间件。
option 可选值：

> 1. extended - 当设置为 false 时，会使用 querystring 库解析 URL 编码的数据；当设置为 true 时，会使用 qs 库解析 URL 编码的数据。后没有指定编码时，使用此编码。默认为 true

2. inflate - 设置为 true 时，deflate 压缩数据会被解压缩；设置为 true 时，deflate 压缩数据会被拒绝。默认为 true。
3. limit - 设置请求的最大数据量。默认为'100kb'
4. parameterLimit - 用于设置 URL 编码值的最大数据。默认为 1000
5. type - 该选项用于设置为指定 MIME 类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用 type-is 来查找 MIMI 类型；当为函数是，中间件会通过 fn(req)来获取实际值。默认为 application/octet-stream。
6. verify - 这个选项仅在 verify(req, res, buf, encoding)时受支持

#### req.query

> 可以获得 get 请求参数

---

# Express.Router 用法

从 Express 4.0 开始，路由器功能成了一个单独的组件 Express.Router。它好像小型的 express 应用程序一样，有自己的 use、get、param 和 route 方法。

## 基本用法

首先，Express.Router 是一个构造函数，调用后返回一个路由器实例。然后，使用该实例的 HTTP 动词方法，为不同的访问路径，指定回调函数；最后，挂载到某个路径。

```javascript
var router = express.Router();

router.get("/", function(req, res) {
  res.send("首页");
});

router.get("/about", function(req, res) {
  res.send("关于");
});

app.use("/", router);
```

上面代码先定义了两个访问路径，然后将它们挂载到根目录。如果最后一行改为 app.use(‘/app’, router)，则相当于为/app 和/app/about 这两个路径，指定了回调函数。

这种路由器可以自由挂载的做法，为程序带来了更大的灵活性，既可以定义多个路由器实例，也可以为将同一个路由器实例挂载到多个路径。

## router 中间件

use 方法为 router 对象指定中间件，即在数据正式发给用户之前，对数据进行处理。下面就是一个中间件的例子。

```javascript
router.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});
```

上面代码中，回调函数的 next 参数，表示接受其他中间件的调用。函数体中的 next()，表示将数据传递给下一个中间件。

注意，中间件的放置顺序很重要，等同于执行顺序。而且，中间件必须放在 HTTP 动词方法之前，否则不会执行。

## 对路径参数的处理

router 对象的 param 方法用于路径参数的处理，可以

```javascript
router.param("name", function(req, res, next, name) {
  // 对name进行验证或其他处理……
  console.log(name);
  req.name = name;
  next();
});

router.get("/hello/:name", function(req, res) {
  res.send("hello " + req.name + "!");
});
```

上面代码中，get 方法为访问路径指定了 name 参数，param 方法则是对 name 参数进行处理。注意，param 方法必须放在 HTTP 动词方法之前。

