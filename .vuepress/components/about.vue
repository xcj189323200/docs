<template>
  <div>{{auth}}这是关于我</div>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      auth: '徐长剑'
    }
  },
  created() {
    console.log(this.auth, '=====');
  }
}
</script>

