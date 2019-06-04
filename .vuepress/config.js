var Router = require("./router/index");
module.exports = {
  title: "前端FE技术文档",
  description: "Just playing around",

  themeConfig: {
    // 假定 GitHub。也可以是一个完整的 GitLab 网址
    repo: "https://github.com/xcj189323200/docs",
    // 如果你的文档不在仓库的根部
    docsDir: "docs",
    // 可选，默认为 master
    docsBranch: "master",
    // 默认为 true，设置为 false 来禁用
    // editLinks: true,

    nav: [
      {
        text: "前端",
        items: [
          {
            text: "vue",
            link: Router.VUE.VUEX
          },
          {
            text: "typescript",
            link: Router.TS.BASE_TYPES
          }
        ]
      },
      {
        text: "后端",
        items: [
          {
            text: "node",
            link: Router.NODE.EXPRESS
          }
        ]
      },
      { text: "规范", link: "/src/rules/rules" },
      { text: "关于我", link: "/src/html/about" }
    ],
    sidebar: {
      [Router.TS.BASE]: [
        {
          title: "typeScript",
          collapsable: true,
          children: [
            Router.TS.INTRODUCE,
            Router.TS.BASE_TYPES,
            Router.TS.BASE_INTERFACE_TYPES
          ]
        }
      ],
      [Router.VUE.BASE]: [
        {
          title: "vue",
          collapsable: true,
          children: [Router.VUE.VUEX]
        }
      ],
      [Router.NODE.BASE]: [
        {
          title: "NODE",
          collapsable: true,
          children: [Router.NODE.EXPRESS]
        }
      ]
    }
  },
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { permalink: false },
    // markdown-it-toc 的选项
    // toc: { includeLevel: [1, 2, 3, 4, 5] },
    config: md => {
      // 使用更多 markdown-it 插件！
      md.use(require("markdown-it"));
    }
  }
};
