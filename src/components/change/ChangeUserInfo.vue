<template>
  <div class="changeUserInfo">
    <div class="myform">
      <el-form :model="myForm" :rules="rules" ref="myForm" label-width="100px" class="demo-myForm">
        <el-form-item label-width="140px" label="管理员用户名" prop="username">
          <el-input v-model="myForm.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="submitForm('myForm')"
            v-loading="fullscreenLoading"
            :disabled="fullscreenLoading"
            >修改</el-button>
          <el-button @click="resetForm('myForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        fullscreenLoading:false,
        myForm: {
          username: '',
          id:''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ]
        }
      };
    },
    created(){
        this.myForm.username=this.$store.getters.loginResult.object.username
        this.myForm.id=this.$store.getters.loginResult.object.id;
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
                var username = this.myForm.username.trim();
                if(username.length===0){
                  this.$message.error('不允许填写空格名')
                }else{
                  this.fullscreenLoading=true;
                  this.$store.dispatch('changeManagerInfo',this.myForm).then(res => {
                    this.fullscreenLoading=false;
                    if(res.data.code===0){
                      this.$message({
                          message:res.data.msg,
                          type:"success"
                      })
                      this.$router.push({ path: '/super/Anav' })
                    }else if(res.data.code===1){
                      this.$message({
                          message:res.data.msg,
                          type:"error"
                      })
                    }else{
                      this.$message({
                          message:"出现未知错误，请重试",
                          type:"error"
                      })
                    }
                  });
                }
            } else {
                this.$message.error('有必填项未填')
                console.log('error submit!!');
                return false;
            }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="less" scoped>
  .myform{
    filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9; 
    position: absolute;
    top: 10px;
    left: 30%;
    z-index: 666;
    border-radius: 15px;  //圆角
    background-clip: padding-box;
    margin: 80px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    font-family: 'Courier New', Courier, monospace
  }
  .changeUserInfo{
    position: absolute;
    opacity: 0.9; 
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    background-color: black;
    z-index: 666;
  }
</style>
