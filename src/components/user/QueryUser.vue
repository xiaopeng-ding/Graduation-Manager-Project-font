<template>
  <div class="queryUser">
    <div class="title">
      所有用户实时状态&nbsp;&nbsp;&nbsp;
      <el-button 
        type="primary" 
        size="mini" 
        icon="el-icon-refresh" 
        @click="refresh"
        :disabled="disableRefrsh"
        ></el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="users.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      border
      >
      <el-table-column
        prop='username'
        label='用户名称'
        align='center'
        >
      </el-table-column>
      <el-table-column
        prop='sign'
        label='签名'
        align='center'
        >
      </el-table-column>
      <el-table-column
        prop='created'
        label='创建时间'
        align='center'
        >
      </el-table-column>

      <el-table-column
        align='center'
        prop='status'
        label="操作"
        >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click="sendWarn(scope.$index,scope.row)"
            :disabled="!scope.row.status"
            >违规警告</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop='status'
        label='在线状态'
        align='center'
        >
        <template slot-scope="scope">
          <el-switch
            active-text="在线"
            inactive-text="离线"
            active-color="#00DB00"
            inactive-color="#8E8E8E"
            v-model="scope.row.status"
            v-loading="offlineLoading"
            :disabled="!scope.row.status" 
            @change=forceOffline(scope.$index,scope.row)></el-switch>
        </template>

      </el-table-column>

      
      <el-table-column
        align='center'
        label="用户状态"
        property="isdisable"
          >
        <template slot-scope="scope">
          <el-switch
            active-text="正常"
            inactive-text="封禁"
            active-color="#5B7BFA"
            inactive-color="#FF0000"
            v-model="scope.row.isdisable" 
            @change=isDisable(scope.$index,scope.row)></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[3,5,7]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="users.length">
    </el-pagination>
    <router-view/>
  </div>
</template>

<script>

  export default {
    
    data(){
      return {
        offlineLoading:false,
        disableRefrsh:false,
        value:true,
        currentPage:1, //初始页
        pagesize:3,    //每页的数据
        search:'',
        users:[],
        gridData:[],
        loading:true
      }
    },
    created(){

      //获取登录时的websocket
      this.webSocket = this.$store.getters.webSocket;

      //由于需要实时同步在线状态，所以初始化消息接收监听
      this.webSocket.onmessage = this.websocketonmessage;
      // this.initWebSocket();


      this.$store.dispatch('getUsers').then(res => {
        var newUser = res.data.users
        for(var i=0;i<newUser.length;i++){
          if(newUser[i].status=="online"){
            newUser[i].status=true;
          }else{
            newUser[i].status=false;
          }
          var date = new Date(newUser[i].created);
          var y = date.getFullYear();
          var m = date.getMonth()+1;
          var d = date.getDate();
          var h = date.getHours();
          var mm = date.getMinutes();
          var s = date.getSeconds();
          newUser[i].created= y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
          if(newUser[i].isdisable=="no"){
            newUser[i].isdisable=true;
          }else{
            newUser[i].isdisable=false;
          }

          var newSgin = newUser[i].sign
          if(newUser[i].sign.length>9){
            newUser[i].sign=newSgin.substring(0,9)+"..."
          }
        }
        this.users = newUser
        this.loading = false;
      });
    },
    methods:{
      isDisable(index,row){
        this.$store.dispatch('isDisable',row).then(res => {
          if(res.data.code===0){
            this.$message({
              message:res.data.msg,
              type:"success"
            })
          }else{
            this.$message({
              message:res.data.msg,
              type:"error"
            })
          }
          // this.users = res.data.object
        });
      },
      forceOffline(index,row){
        this.offlineLoading = true;
        this.$store.dispatch('forceOffline',row).then(res => {
          this.offlineLoading = false;
          if(res.data.code===0){
            this.$message({
              message:res.data.msg,
              type:"success"
            })
          }else{
            this.$message({
              message:"强制下线失败，请重试",
              type:"error"
            })
          }
        });
      },
      handleSizeChange: function (size) {
        this.pagesize = size;
      },
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
      },
      sendWarn(index,row) {
        this.$store.dispatch('sendWarn',row).then(res => {
          if(res.data.code===0){
            this.$message({
              message:res.data.msg,
              type:"success"
            })
          }else{
            this.$message({
              message:"警告失败，请重试",
              type:"error"
            })
          }
        });
      },
      refresh(){
        this.loading = true;
        this.disableRefrsh = true;
        this.$store.dispatch('getUsers').then(res => {
          this.disableRefrsh = false;
          if(res.data.code===0){
            this.$message({
              message:"刷新成功",
              type:"success"
            })
            var newUser = res.data.users
            for(var i=0;i<newUser.length;i++){
              if(newUser[i].status=="online"){
                newUser[i].status=true;
              }else{
                newUser[i].status=false;
              }
              var date = new Date(newUser[i].created);
              var y = date.getFullYear();
              var m = date.getMonth()+1;
              var d = date.getDate();
              var h = date.getHours();
              var mm = date.getMinutes();
              var s = date.getSeconds();
              newUser[i].created= y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
              if(newUser[i].isdisable=="no"){
                newUser[i].isdisable=true;
              }else{
                newUser[i].isdisable=false;
              }

              var newSgin = newUser[i].sign
              if(newUser[i].sign.length>9){
                newUser[i].sign=newSgin.substring(0,9)+"..."
              }
            }
            this.users = newUser
            this.loading = false;
          }
        });
      },
      websocketonmessage(message){
        const redata = JSON.parse(message.data);
        if(redata.type==="changeOnlineStatus"){
          const dataDeal = this.users;
          console.log(dataDeal);
          //实时接收好友中的状态信息（上下线）
          for(var i=0;i<dataDeal.length;i++){
            if(dataDeal[i].id==redata.userId){
              if(redata.status=="online"){
                this.users[i].status=true;
              }else{
                this.users[i].status=false;
              }
            }
          }
        }else if(redata.type==="updateInfo"){
          const dataDeal = this.users;
          //实时接收好友中的状态信息（上下线）
          for(var i=0;i<dataDeal.length;i++){
            if(dataDeal[i].id==redata.userId){
              this.users[i].username=redata.mineName;
              if(redata.sign.length>9){
                this.users[i].sign=redata.sign.substring(0,9)+"..."
              }else{
                this.users[i].sign=redata.sign;
              }
            }
          }
        }else if(redata.type==="register"){
          this.$alert(redata.message, '提示', {
            confirmButtonText: '确定',
          });
          var newUser = redata.users
          for(var i=0;i<newUser.length;i++){
            if(newUser[i].status=="online"){
              newUser[i].status=true;
            }else{
              newUser[i].status=false;
            }
            var date = new Date(newUser[i].created);
            var y = date.getFullYear();
            var m = date.getMonth()+1;
            var d = date.getDate();
            var h = date.getHours();
            var mm = date.getMinutes();
            var s = date.getSeconds();
            newUser[i].created= y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
            if(newUser[i].isdisable=="no"){
              newUser[i].isdisable=true;
            }else{
              newUser[i].isdisable=false;
            }

            var newSgin = newUser[i].sign
            if(newUser[i].sign.length>9){
              newUser[i].sign=newSgin.substring(0,9)+"..."
            }
          }
          this.users = newUser
        }
        //console.log("收到数据："+message.data);
      },
    }
  }
</script>

<style lang="less" scoped>
  .queryUser{
    background-color: #ccc;
    width: 100%;
    top: 0;
    left: 0;
    font-family: 'Courier New', Courier, monospace
  }
  .title{
    color: #409EFF;
    height: 32px;
    line-height:32px;
    // margin: 10px;
    text-align: center;
    font-weight:bold
  }
</style>
