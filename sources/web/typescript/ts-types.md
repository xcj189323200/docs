# 类型

原始数据类型

> typescript 的类型分为两种：原始数据类型和对象类型。
> 原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol。

## 布尔类型

布尔值是最基础的数据类型，在 TypeScript 中，使用 boolean 定义布尔值类型：

```typescript
// 编译通过
// 后面约定，未强调编译错误的代码片段，默认为编译通过

let isDone: boolean = false;

```

注意，使用构造函数 Boolean 创造的对象不是布尔值：

```typescript
//bad
// 后面约定，注释中标出了编译报错的代码片段，表示编译未通过
let createdByNewBoolean: boolean = new Boolean(1);
// index.ts(1,5): error TS2322: Type 'Boolean' is not assignable to type 'boolean'.
```

事实上 new Boolean() 返回的是一个 Boolean 对象：

```typescript
let createdByNewBoolean: Boolean = new Boolean(1);
```

直接调用 Boolean 也可以返回一个 boolean 类型：

```typescript
let createdByBoolean: boolean = Boolean(1);
```

在 TypeScript 中，boolean 是 typescript 中的基本类型，而 Boolean 是 typescript 中的构造函数。其他基本类型（除了 null 和 undefined）一样，不再赘述。

## 数值

使用 number 定义数值类型：

```typescript
let count: number = 0;
```

## 字符串

使用 number 定义数值类型：

```typescript
let name: string = "Tom";
```

## Null 和 Undefined

在 TypeScript 中，可以使用 null 和 undefined 来定义这两个原始数据类型：

```typescript
let u: undefined = undefined;
let n: null = null;
```

undefined 类型的变量只能被赋值为 undefined，null 类型的变量只能被赋值为 null。

## 数组

### 最简单的方法是使用「类型 + 方括号」来表示数组：

```typescript
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

这样声明的话，数组的项中不允许出现其他的类型：

```typescript
//bad
let fibonacci: number[] = [1, "1", 2, 3, 5];

// index.ts(1,5): error TS2322: Type '(number | string)[]' is not assignable to type 'number[]'.Type 'number | string' is not assignable to type 'number'.Type 'string' is not assignable to type 'number'.
```

数组的一些方法的参数也会根据数组在定义时约定的类型进行限制：

```typescript
//bad
let fibonacci: number[] = [1, 1, 2, 3, 5];
fibonacci.push("8");

// index.ts(2,16): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

上例中，push 方法只允许传入 number 类型的参数，但是却传了一个 string 类型的参数，所以报错了。

### 也可以使用数组泛型`Array<elemType>` 来表示数组:

```typescript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

### 用接口表示数组

```typescript
interface NumberArray {
  [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

NumberArray 表示：只要 index 的类型是 number，那么值的类型必须是 number

### 类数组!

类数组（Array-like Object）不是数组类型，比如 arguments：

```typescript
//bad
function sum() {
  let args: number[] = arguments;
}

// index.ts(2,7): error TS2322: Type 'IArguments' is not assignable to type 'number[]'.
//   Property 'push' is missing in type 'IArguments'.
```

事实上常见的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection 等：

```typescript
function sum() {
  let args: IArguments = arguments;
}
```

## 对象

```typescript
let obj: object = {};
```

## 任意类型

任意值（Any）用来表示允许赋值为任意类型。

```typescript
let any: any = {};
```

## 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。

###  基本用法

正确：

```typescript
let myFavoriteNumber: string | number;
myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

错误：

```typescript
//bad
let myFavoriteNumber: string | number;
myFavoriteNumber = true;

// index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

联合类型使用 | 分隔每个类型。

这里的 `let myFavoriteNumber: string | number` 的含义是，允许 `myFavoriteNumber` 的类型是 `string` 或者 `number`，但是不能是其他类型。

### 访问联合类型的属性或方法

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

```typescript
//bad
function getLength(something: string | number): number {
  return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

上例中，length 不是 string 和 number 的共有属性，所以会报错。

访问 string 和 number 的共有属性是没问题的：

```typescript
//good
function getString(something: string | number): string {
  return something.toString();
}
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

```typescript
//bad
let myFavoriteNumber: string | number;
myFavoriteNumber = "seven";
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错

// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```

上例中，第二行的 myFavoriteNumber 被推断成了 string，访问它的 length 属性不会报错。
而第四行的 myFavoriteNumber 被推断成了 number，访问它的 length 属性时就报错了。

### 字符串字面量类型

限制只能输入类型的值

```typescript
function isGender(type: "boy" | "girl") {
  return "this is" + type;
}

// good
isGender("boy");

// bad
isGender("男");

//protect-ts/index.ts(16,10): error TS2345: Argument of type '"男"' is not assignable to parameter of type '"boy" | "girl"'.
```

## 类型推论

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

### 什么是类型推论

以下代码虽然没有指定类型，但是会在编译的时候报错：

```typescript
//bad
let myFavoriteNumber = "seven";
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

事实上，它等价于：

```typescript
//bad
let myFavoriteNumber: string = "seven";
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

**如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：**

```typescript
let myFavoriteNumber;
myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

## 类型断言

类型断言（Type Assertion）可以用来手动指定一个值的类型。

### 语法

```
<类型>值
```

或

```
值 as 类型
```

**在 tsx 语法（React 的 jsx 语法的 ts 版）中必须用后一种。**

### 例子：将一个联合类型的变量指定为一个更加具体的类型

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

```typescript
//bad
function getLength(something: string | number): number {
  return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

而有时候，我们确实需要在还不确定类型的时候就访问其中一个类型的属性或方法，比如：

```typescript
//bad
function getLength(something: string | number): number {
  if (something.length) {
    return something.length;
  } else {
    return something.toString().length;
  }
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
// index.ts(3,26): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

上例中，获取 something.length 的时候会报错。

此时可以使用类型断言，将 something 断言成 string：

```typescript
//good
function getLength(something: string | number): number {
  if ((<string>something).length) {
    return (something as string).length;
  } else {
    return something.toString().length;
  }
}
```

类型断言的用法如上，在需要断言的变量前加上 `<Type>` 即可。

**注意：类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的**

```typescript
//bad
function toBoolean(something: string | number): boolean {
    return <boolean>something;
}

// index.ts(2,10): error TS2352: Type 'string | number' cannot be converted to type 'boolean'.Type 'number' is not comparable to type 'boolean'.
```

## 函数的类型

### 函数声明

在 typescript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）：

```typescript
// 函数声明（Function Declaration）
function sum(x, y) {
  return x + y;
}

// 函数表达式（Function Expression）
let mySum = function(x, y) {
  return x + y;
};
```

一个函数有输入和输出，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到，其中函数声明的类型定义较简单：

```typescript
//good
function sum(x: number, y: number): number {
  return x + y;
}
```

**注意，输入多余的（或者少于要求的）参数，是不被允许的：**

```typescript
//bad
function sum(x: number, y: number): number {
  return x + y;
}
sum(1, 2, 3);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target

sum(1);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target.
```

### 函数表达式

如果要我们现在写一个对函数表达式（Function Expression）的定义，可能会写成这样：

```typescript
let mySum = function(x: number, y: number): number {
  return x + y;
};
```

这是可以通过编译的，不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行类型推论而推断出来的。如果需要我们手动给 mySum 添加类型，则应该是这样：

```typescript
let mySum: (x: number, y: number) => number = function(
  x: number,
  y: number
): number {
  return x + y;
};
```

**注意不要混淆了 TypeScript 中的 => 和 ES6 中的 =>。**

在 TypeScript 的类型定义中，=> 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

### 用接口定义函数的形状

我们也可以使用接口的方式来定义一个函数需要符合的形状：

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  return source.search(subString) !== -1;
};
```

### 可选参数

前面提到，输入多余的（或者少于要求的）参数，是不允许的。那么如何定义可选的参数呢？

与接口中的可选属性类似，我们用 ? 表示可选的参数：

```typescript
//good
function buildName(firstName: string, lastName?: string) {
  if (lastName) {
    return firstName + " " + lastName;
  } else {
    return firstName;
  }
}
let tomcat = buildName("Tom", "Cat");
let tom = buildName("Tom");
```

需要注意的是，可选参数必须接在必需参数后面。换句话说，**可选参数后面不允许再出现必须参数了：**

```typescript
//bad
function buildName(firstName?: string, lastName: string) {
  if (firstName) {
    return firstName + " " + lastName;
  } else {
    return lastName;
  }
}
let tomcat = buildName("Tom", "Cat");
let tom = buildName(undefined, "Tom");

// index.ts(1,40): error TS1016: A required parameter cannot follow an optional parameter.
```

### 剩余参数

ES6 中，可以使用 ...rest 的方式获取函数中的剩余参数（rest 参数）：

```typescript
function push(array, ...items) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```

事实上，items 是一个数组。所以我们可以用数组的类型来定义它：

```typescript
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```
注意，rest 参数只能是最后一个参数，关于 rest 参数，[可以参考 ES6 中的 rest 参数。](http://es6.ruanyifeng.com/#docs/function#rest参数)

### 重载
重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

比如，我们需要实现一个函数 reverse，输入数字 123 的时候，输出反转的数字 321，输入字符串 'hello' 的时候，输出反转的字符串 'olleh'。

利用联合类型，我们可以这么实现：

```typescript
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。

这时，我们可以使用重载定义多个 reverse 的函数类型：

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```
上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。


## 类型别名

类型别名用来给一个类型起个新名字。

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```

上例中，我们使用 type 创建类型别名。

类型别名常用于联合类型。

