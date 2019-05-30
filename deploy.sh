#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
# set -e

nowTime=`date +"%Y-%m-%d %H:%M:%S"`;

# 拉取代码
# git pull
# 添加修改文件
# git add .
# 添加备注
git commit -m "deploy$nowTime"

# 推到远程
git push

# cd -
