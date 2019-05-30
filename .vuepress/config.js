module.exports = {
  title: "博客",
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
      { text: "前端", link: "/apiword" },
      { text: "后段", link: "/api" },
      { text: "附录：错误码", link: "/error" }
    ],
    sidebar: [
      {
        title: "前端",
        collapsable: true,
        children: ["/src/web/vuex","/src/web/express"]
      },
      {
        title: "Group 2",
        children: [
          /* ... */
        ]
      }
    ]
  }
};
