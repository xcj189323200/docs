# 声明：
> 该协议的前提是将一切可以通过http进行传输的内容当做是信息资源，协议是针对这些具备资源性质（实际上，任何提供http请求的服务都可以抽象成资源，或者与资源相关的内容）的API的约束

# 一、基本约定
- **URL地址采用小写形式，禁止使用驼峰形式的路径**
- **非参数部分的URL地址中的分隔符采用连接号："-"，禁止使用下划线："_"**
- **参数名称一致采用"_"下划线分割的形式**
- **路径或参数名称避免出现中文字样**

# 二、URL的组成
URL（不含参数部分）的基本组成如下：
> http://{domain}/{namespace}/{version}/{resoure}

## 2.1 域名（domain）
`API中心` 统一采用：`http://api-bigdata.huan.tv/`作为域名

## 2.2 项目名（namespace）
默认情况下，`API中心`接口按照项目进行分类，名称由`主题项目名称` + `-api`两部分组成
*示例：*

```
# 正确示例
http://api-bigdata.huan.tv/example-api    示例项目接口
http://api-bigdata.huan.tv/csm-huan-api    实时收视项目接口
http://api-bigdata.huan.tv/tv-zone-api    电视社区项目接口
http://api-bigdata.huan.tv/group-insight-api    睛准洞察接口
```

## 2.3 版本（version）
使用 v{n} 对`API接口`进行版本管理，其中 n 为`大于0`的`整数`值；接口调整时,若仅仅是为资源添加某些属性，且能够兼容之前接口的数据，则不必调整接口版本（即：禁止出现小版本，如1.1,2.3等版本号，但需要注意及时更新接口文档）
*示例：*

```
# 正确示例
/example-api/v1
/csm-huan-api/v2
/tv-zone-api/v1
# 错误示例
/example-api/v1.4
/csm-huan-api/v2.3.7
```

## 2.4 资源（resource）
资源是对作用对象的一种描述，主要可以分为以下三种类型：
- 数据
可以通过`IO流`在网络进行传输，而且可以持久化到计算机中的内容(如：文档，图片，特定的数据等)
*示例：*

```
# 正确示例
GET->/tv-zone-api/v1/reach    电视社区终端到达信息
GET->/csm-huan-api/v1/ratings    实时收视率信息
GET->/insight-api/v1/interests    睛准洞察的兴趣偏好信息【宽泛的资源定义，可以包含多个指标】
```

- 状态
对事情完成程度或事物所处形态的描述信息
*示例：*

```
# 正确示例
GET->/csm-huan-api/v1/ivc-load-status/20181010    加权加载的状态[prepare,loaded]【查看性质的状态】
PUT->/example-api/page-open-status?closed=true    关闭页面，禁止对外开放【更改性质的状态】
```

- 动作（操作）
使用者（一般指使用系统的人）对现有资源采取的行为
**提示：**一般采用动作作用的对象作为资源名词，如果作用对象是系统或系统外的资源，可以直接省略资源名字
*示例：*

```
# 正确示例
DELETE->/insight-api/v1/users/123    删除[用户]
POST->/example-api/v1/login    登录[系统]
```

**提示：**协议使用者应该根据自己的业务场景，确认业务所使用的数据，将其抽象成为以上三种资源中的一种或几种资源，进而进行接口开发

# 三、URL 规范
## 3.1 URL约束（不含参数部分）

- **资源导向**
每个URL都是对某个或某些资源的描述，因此URL中必须是名词性的词语，且必须为名词性复数形式
*示例：*

```
# 正确示例
GET->/example-api/v1/users    获取用户列表
GET->/example-api/v1/channels    获取频道列表
GET->/tv-zone-api/v1/reach    电视社区终端到达信息
GET->/csm-huan-api/v1/ratings    实时收视率信息
GET->/example-api/v1/ratings/20181010    获取2018年10月10日的收视率信息
GET->/insight-api/v1/interests    睛准洞察的兴趣偏好信息【宽泛的资源定义，可以包含多个指标】
# 错误示例
× GET->/example-api/v1/programs/showed    其中 showed 属于非名词性资源,因此可以使用查询参数进行限定
√ GET->/example-api/v1/programs?showed=true
```

- **（资源）范围递减**
URL中的资源需要按照从整体到局部的方式递进，即资源由较大范围向较小范围过渡，形成包含关系。**建议最多有一层递进关系**。
    *示例：*

```
# 正确示例
GET->/csm-huan/v1/channels/35city    获取35城样本对应的所有频道
# 不推荐示例
GET->/csm-huan/v1/audiences/52city/20181010    获取2018年10月10日52城的收视率信息
```

- **（资源）由一般到特殊**
访问某个资源时，要么访问整个资源列表，要么访问具体的某个特定资源
*示例：*

```
# 正确示例
GET->/example-api/v1/channels/    获取所有的频道列表
GET->/example-api/v1/channels/cctv1    获取 channel_code 为 cctv1 的频道信息
GET->/example-api/v1/reach/20181010    获取2018年10月10日的终端到达信息
```

- **减少资源嵌套关系**
URL路径最多出现两层嵌套资源（/example-api/v1/collection/id/collection/id），**推荐使用不嵌套资源的方式**，即：/example-api/v1/collection/id
*示例：*

```
# 正确示例
GET->/example-api/v1/channels/cctv1/programs    获取cctv1频道的节目信息
GET->/example-api/v1/channels/cctv1/reach/20181010    获取cctv1频道2018年10月10日的终端到达信息
# 推荐示例
GET->/example-api/v1/programs?channel_code=cctv1    获取cctv1频道的节目信息
GET->/example-api/v1/reach/20181010?channel_code=cctv1    获取cctv1频道2018年10月10日的终端到达信息
```

- **ID或时间限定资源**
URL中两种资源限定方式：ID性质和时间性质(时间格式为采用：YYYYMMDDHHmmss，不含任何分隔符的形式)
*示例：*
```
# 正确示例
GET->/example-api/v1/channels/antv    获取channel_code是antv的频道信息
GET->/example-api/v1/reach/20181010    获取2018年10月10日的终端到达信息
```

## 3.2 参数规范
参数用来筛选和精确定位资源信息，当采用URL的基本规范无法正确锁定资源时，可以将限制性的操作放置到参数中

- **记录数**
当一个资源集合记录数`大于200`时，推荐添加`limit`参数，以限制结果集的记录条数
*示例：*

```
# 正确示例
GET->/example-api/v1/programs/20181010?limit=50    获取2018年10月10日所有频道的节目单信息中的前50个
```

- **分页查询**
当一个资源集合记录数`大于200`时，推荐添加`page`和`page_size`两个参数,实现`分页查询`功能，以避免一次性加载大量数据导致响应过慢
*示例：*

```
# 正确示例
GET->/example-api/v1/programs/20181010?page=2&page_size=25    获取2018年10月10日第2页（每页25条记录）的节目数据
```

- **TOP查询**
当判断一个资源有可能需要排序时，推荐添加`sort`和`order`两个参数，提供`排序`和`排序方式`的支持，当排序字段大于1时，可以用逗号“,”进行分隔，如果多个排序字段排序方式相同order可以只写1个，否则按照排序字段依次对应，并以逗号“,”分隔；当资源有可能取`TOP`时，推荐添加`top`参数，提供`TopN`功能
*示例：*

```
# 正确示例
GET->/example-api/v1/programs/20181010?sort=channelName&order=asc    获取2018年10月10日的节目信息，并按照频道名称正序输出
GET->/example-api/v1/programs/20181010?sort=channelName,programName&order=asc    获取2018年10月10日的节目信息，并按照频道名称节目名称正序输出
GET->/example-api/v1/programs/20181010?sort=channelName,programName&order=asc,desc    获取2018年10月10日的节目信息，并按照频道名称正序,节目名称倒叙输出
GET->/example-api/v1/programs/20181010?sort=channelName,programName&order=asc&top=50 获取2018年10月10日的节目信息，并按照频道名称节目名称正序输出前50个
```

- **其他过滤**
除ID和时间限定资源外，还可以添加其他限制性的参数
示例：

```
# 正确示例
GET->/data-summary-api/v1/boots/20181010?scene=ub    获取2018年10月10日UB场景数据对应的开机信息
GET->/csm-huan-api/v1/channels?channel_type=cctv    获取所有央视频道信息
```

## 3.3 项目根路径规范
超媒体驱动(通俗解释)
> 通过引入业务的相关链接进行广告的一种方式。通过超媒体链接，你可以告诉用户接下来他（她）该怎么操作（网上下单：选商品->加购物车->结算-推荐附属商品），也可以告诉用户你想让他了解哪方面的业务信息。【概括：用户想知道什么和你想让用户知道什么】

 `API中心` 接口协议按照项目进行分类划分，因此项目级别的路径被视为根路径。当客户端请求根路径时，会返回该项目中常用的接口服务，形成超媒体驱动。比如，使用者可以将自己的项目按照不同的业务线进行规划，然后将业务的起点接口（一般指 top 级别的资源列表接口）列举出来归入根路径接口列表中，让用户可以通过`超媒体链接`逐步深入业务逻辑，获取用户想要的信息或者系统想要让用户知道的信息。
*请求示例：*

> GET->http://api-badata.huan.tv/example-api

*响应示例：*
```json
{
    "users_url":"http://api‐bigdata.huan.tv/example-api/v1/users",  # key 为资源名称复数 + ‘_url’ 组成
    "programs_url":"http://api‐bigdata.huan.tv/example-api/v1/programs"
}
```

## 3.4 请求方法规范
- **GET**
获取某个资源信息
*    * 获取某个特定资源
*请求示例：*
> GET->http://api-bigdata.huan.tv/example-api/v2/users/123

    *响应结果：*
    
```json
{
    "code":200,    # 非2xx的code表示请求响应正常
    "message":"sucess",    # message表示请求结果的状态或提示性信息
    "data":{
        "resource":"users"
        "id":"123",
        "name":"Merry",
        "address":"北京市朝阳区劲松",
        "email":"merry@126.com",
        "mobile":"13388888888"
    }
}
```

*    * 请求某个集合资源
*请求示例：*
> GET->http://api-bigdata.huan.tv/example-api/v2/users

    *响应结果：*
    
```json
{
    "code":200,    # 非2xx的code表示请求响应正常
    "message":"sucess",    # message表示请求结果的状态
    "data":[
        {
            "resource":"users"
            "id":"123",
            "name":"Merry",
            "address":"北京市朝阳区劲松",
            "email":"merry@126.com",
            "mobile":"13388888888"
        }，{
            "resource":"users"
            "id":"234",
            "name":"Jhon",
            "address":"北京市朝阳区劲松",
            "email":"jhon@126.com",
            "mobile":"13388888888"
        },
        ......
    ],
    "props":{
        "total": 239,
        "cur_page": 2,
        "description":"There are many users will disable in a fews days."
    }
}
```

- **POST**
新建一个资源
*请求示例：*
> POST->http://api-bigdata.huan.tv/example-api/v1/users

    *响应结果：*
    
```json
{
    "code":201,
    "message":"created",
    "location":"http://api-bigdata.huan.tv/example-api/v1/users/345"
}
```

- **PUT**
更新已有资源
*请求示例：*
> PUT->http://api-bigdata.huan.tv/example-api/v1/users/123

    *响应结果：*
    
```json
{
    "code":200,    # 非2xx的code表示请求响应正常
    "message":"updated",    # message表示请求结果的状态,更新完成
    "data":{
        "resource":"users"
        "id":"123",
        "name":"Merry",
        "address":"北京市朝阳区劲松",
        "email":"merry@126.com",
        "mobile":"13366666666"
    }
}
```

- **DELETE**
删除一个已有资源
*请求示例：*
> DELETE->http://api-bigdata.huan.tv/example-api/v1/users/123

    *响应结果：*
    
```json
{
    "code":204,    # 非2xx的code表示请求响应正常
    "message":"no content"    # message表示请求结果的状态,删除成功
}
```

- **ERROR**
代码抛异常，需要主动捕获，禁止暴露错误页面给用户
*响应结果：*

```json
{
    "code":500,
    "message":"server error",
    "props":{
        "developer":"张三丰"
    }
}
```

# 四、媒体类型
响应数据时，Content-Type（即媒体类型）统一使用：`application/json;charset=UTF-8`

# 五、响应结果

标准响应格式需要包含以下元素：
- **code**【必须元素】
响应码，int 类型。它用来描述请求结果的响应状态,详见附录：[响应码列表](#附录)。

*示例：*
```json
{
    "code":200,
    ...
}
```

- **message**【必须元素】
提示信息，string 类型。它用来描述请求后的提示性信息。数据正常响应时，给出成功提示，如果没有特殊提示，建议使用`sucess`；数据异常时，该字段需要携带具体的错误原因。
*示例：*

```json
# 数据正常响应
{
    "code":200,
    "message":"success",
    ...
}
# 数据不存在
{
    "code":404,
    "message":"No data!",
    ...
}
```

- **data**【查询请求必须元素】
结果集，object 或 array 类型。用来封装用户请求的数据集结果。必须为结果集中的每个资源添加 `resource` 元素，以表明结果数据属于哪类资源，该元素值与URL路径的资源名词（复数）相一致。
*    * 单个资源
    对应 object 类型。当请求访问的是具有 ID 性质的资源，具备幂等性时，响应的结果往往是一个确定的数据，此时结果集采用 object 表示。
*示例：*

```json
    {
        ...,
        "data":{
            "resource":"programs",    # 资源必须需要添加resource`元素
            "id":"niisinr5cci6ikpxvcj9",
            "programName":"天龙八部",
            "startTime":"2018-10-10 20:00:00", # 时间响应统一采用格式：YYYY-MM-DD HH:mm:ss
            "endTime":"2018-10-10 20:47:00",
            ...
        },
        ...
    }
```
*    * 集合资源
   对应 array 类型。当请求的数据集可能存在大于1的情况时，结果集采用 array 表示。
    *示例：*

```json
{
    ...,
    "data":[
        {
            "resource":"programs",    # 资源必须需要添加resource`元素
            "id":"niisinr5cci6ikpxvcj9",
            "programName":"天龙八部 12",
            "startTime":"2018-10-10 20:00:00",
            "endTime":"2018-10-10 20:47:00",
            ...
        },
        {
            "resource":"programs",    # 资源必须需要添加resource`元素
            "id":"qaisi83kspqcmda120",
            "programName":"天龙八部 13",
            "startTime":"2018-10-10 20:55:00",
            "endTime":"2018-10-10 21:41:00",
            ...
        },
        ...
    ],
    ...
}
```

- **props**（附加属性数据）【非必须元素】
当请求结果中需要额外添加说明，或者结果集中存在需要补充的数据时，推荐添加至该元素中
*示例：*

```json
{
    ...,
    "props":{
        "total_count":  921,
        "month_avg_reach":{
            "201801":28161,
            "201802":17985,
            ...
        },
        ...
    }

}

```

# 六、请求认证
接口认证由网关统一进行控制，请参考 [API 接口网关使用规范](#)（进行中）。 在此之前，需要由各个项目自行添加 `token` 进行安全认证

# 附录
- 响应状态码

| 状态码  | （推荐）响应消息|描述  |
| :------------ |:------------ | :------------ |
| 200  |OK |查询，更新等操作成功  |
| 201  |Created |创建资源成功  |
| 204  |No Content |删除资源成功  |
| 400  |Bad Request| 请求参数异常|
| 401  |Unauthorized |未认证  |
| 402  |Payment Required |待付费  |
| 404  |Not Found |未找到数据  |
| 500  |Server Error |服务异常 |