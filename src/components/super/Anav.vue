<template>
  <div class="adNavi">
    <div class="Details">
      <h2>&nbsp;&nbsp;&nbsp;管理控制台</h2>
      <div class="adminDetails">
        <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;管理员，{{date}}</h4>
      </div>
    </div>
    <div class="navigation">
      <el-row>
        <el-col >
          <el-menu
            @open="handleOpen"
            @close="handleClose"
            background-color="#023364"
            text-color="#fff"
            active-text-color="#ffd04b">
            
            <el-menu-item index="1" @click="userVindicate">
              <i class="el-icon-info"></i>
              <span slot="title" >用户维护</span>
            </el-menu-item>
            <el-menu-item index="2" @click="SearchUser">
              <i class="el-icon-search"></i>
              <span slot="title" >搜索用户</span>
            </el-menu-item>
            <el-menu-item index="3" @click="announcement">
              <i class="el-icon-bell"></i>
              <span slot="title" >发布公告</span>
            </el-menu-item>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span>修改管理员信息</span>
              </template>
              <el-menu-item-group>
                <!-- <template slot="title">分组一</template> -->
                <el-menu-item index="4-1" @click="changeAdminInfo">修改管理员信息</el-menu-item>
                <el-menu-item index="4-2" @click="ChangeAdminPassword">修改管理员密码</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="Adata">
      <router-view />
    </div>
  </div>
  
</template>

<script>
  export default {
    data(){
      return {
        date:''
      }
    },
    
    created(){
      this.user=this.$store.getters.loginResult.user;
      var date = new Date();
      var hour = date.getHours(); //获取时间的方法，一定要带括号
      var time = '';
      if(hour > '6' & hour < '12'){
        time = '早上好！'
      }else if(hour == 12){
        time = '中午好'
      }else if(hour > 12 & hour <19){
        time = '下午好'
      }else if(hour >= 19 & hour <= 23){
        time = '晚上好'
      }else{
        time = '凌晨时间，你不睡觉吗？'
      }
      this.date = time;
    },
    updated(){
      this.user=this.$store.getters.loginResult.user;
    },
    methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      userVindicate(){
        this.$router.push({ path: '/Super/Anav/QueryUser' })
      },
      SearchUser(){
        this.$router.push({ path: '/Super/Anav/SearchUser' })
      },
      mamagerVindicate(){
        this.$router.push({ path: '/Super/Anav/QueryManager' })
      },
      announcement(){
        this.$router.push({ path: '/Super/Anav/announcement' })
      },
      setDeleteCode(){
         this.$router.push({ path: '/Super/Anav/SetDeleteCodeByName' })
      },
      changeAdminInfo(){
        this.$router.push({
          name:'ChangeUserInfo'
        });
      },
      ChangeAdminPassword(){
        this.$router.push({
          name:'ChangeUserPassword'
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .adNavi{
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    font-family: \6977\4F53;
    color: rgb(255, 255, 255);
  }
  .adminDetails{
    border-bottom:2px inset  white;
  }
  .navigation{
    top: 0;
    height: 100%;
    width: 200px;
    background-color:#023364;
    font-family: 'Courier New', Courier, monospace
  }
  *{
    margin:0px;
    padding:0px;
  }
  .Adata{
    left: 200px;
    top: 128px;
    position: absolute;
    width: 85%;
    height: 100%;
  }
  .Details{
    
    background-color: #023364;
  }
</style>
