<template>
  <div class="changeUserPassword">
    <div class="passwordForm">
      <el-form :model="myForm" :rules="rules" ref="myForm" label-width="100px" class="demo-myForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="myForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="myForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="conformPassword">
          <el-input type="password" v-model="myForm.conformPassword" autocomplete="off"></el-input>
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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.myForm.conformPassword !== '') {
            this.$refs.myForm.validateField('conformPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.myForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        fullscreenLoading:false,
        myForm: {
          id: '',
          oldPassword: '',
          password: '',
          conformPassword: ''
        },
        rules: {
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          conformPassword: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    created(){
        this.myForm.id=this.$store.getters.loginResult.object.id;
        //获取登录时的websocket
        this.webSocket = this.$store.getters.webSocket;
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.fullscreenLoading=true;
            this.$store.dispatch('changeManagerPassword',this.myForm).then(res => {
              this.fullscreenLoading=false;
                if(res.data.code===0){
                        this.$message({
                            message:res.data.msg,
                            type:"success"
                        })
                        // this.$store.dispatch('logout');//登出操作
                        this.webSocket.close();
                        this.$router.push({ path: '/' })
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
            });
          } else {
            this.$message.error('有必填项未填')
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
  .passwordForm{
    filter:alpha(Opacity=90);-moz-opacity:0.9;opacity: 0.9; 
    position: absolute;
    top: 10px;
    left: 30%;
    z-index: 666;
    border-radius: 15px;
    background-clip: padding-box;
    margin: 80px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    font-family: 'Courier New', Courier, monospace
  }
  .changeUserPassword{
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
