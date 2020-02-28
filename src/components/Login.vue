<template>
  <div>
    <el-form :rules="rules" class="login-container" label-position="left" label-width="0px" ref="loginForm" :model="loginForm">
      <h3 class="login_title">BiuBiu小讯息后台管理</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
        <!-- <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码(敬请期待)</el-checkbox> -->
      <el-form-item style="width: 100%">
        <el-button 
          type="primary" 
          style="width: 47%" 
          @click="login('loginForm')" 
          v-loading.fullscreen.lock="fullscreenLoading"
          >登录</el-button>
        <el-button type="primary" style="width: 48%" @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  
</template>

<script>
  export default {
    data() {
      return {
        fullscreenLoading:false,
        loginForm: {
          username:'',
          password:''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        checked: true,
      }
    },
    methods:{
      login(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.fullscreenLoading=true;
            this.$store.dispatch('login',this.loginForm).then((res) => {
              this.fullscreenLoading=false;
              if(res.data.code===0){
                this.$message({
                  message:res.data.msg,
                  type:"success"
                })
                this.$store.dispatch('setWebSocket',res.data.object.id);
                this.$router.push({ path: '/super/Anav' })
              }else if(res.data.code===1){
                this.$message({
                  message:res.data.msg,
                  type:"error"
                })
              }else{
                this.$message({
                  message:"未知错误",
                  type:"error"
                })
              }
            }).catch(() => {
              this.$message({
                message:"服务器异常",
                type:"error"
              })
            });
          }else{
            this.$message.error('有必填项未填')
            return false;
          }
        })          
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style lang="less" scoped>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
 </style>
