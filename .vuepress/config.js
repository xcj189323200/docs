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
    editLinks: true,

    nav: [
      {
        text: "前端",
        items: [
          {
            text: "vue",
            link: "/src/web/vue/vuex"
          },
        ]
      },
      {
        text: "后端",
        items: [
          {
            text: "node",
            link: "/src/web/node/express"
          }
        ]
      },
      { text: "规范", link: "/src/rules/rules" },
      { text: "关于我", link: "/src/html/about" }
    ],
    sidebar: {
      "/src/web/vue/vuex": [
        {
          title: "vue",
          collapsable: true,
          children: ["/src/web/vue/vuex"]
        }
      ],
      "/src/web/node/": [
        {
          title: "NODE",
          collapsable: true,
          children: ["/src/web/node/express"]
        }
      ]
    }
  },
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { permalink: false },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2] },
    config: md => {
      // 使用更多 markdown-it 插件！
      md.use(require("markdown-it"));
    }
  }
};
