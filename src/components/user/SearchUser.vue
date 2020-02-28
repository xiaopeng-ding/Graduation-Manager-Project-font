<template>
    <div>
        <div style="margin-top: 30px; margin-left: 30px; margin-bottom: 30px;" class="inputS">
            <el-input :placeholder="select" v-model="info" class="input-with-select">
                <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:120px">
                    <el-option label="用户ID" value="请输入用户ID"></el-option>
                    <el-option label="用户昵称" value="请输入用户昵称"></el-option>
                </el-select>
                <el-button 
                    slot="append" 
                    icon="el-icon-search"  
                    @click="search" 
                    :disabled="disableSearch"
                    v-loading="searchLoad"
                    ></el-button>
                <el-button slot="append" icon="el-icon-refresh" @click="reset"></el-button>
            </el-input>
        </div>
        <div v-if="userInfoShow" class="userInfoShowStyle">
            <div>
                <div class="avatarStyle" >
                    <img :src="userInfo.avatar" style="border-radius: 7px;margin-top: 30px;" height="100" width="100">
                </div>
                <div style="color:black" class="infoDetal">
                    <table border="0">
                        <tr>
                            <td>用户昵称：</td>
                            <td>{{userInfo.username}}</td>
                        </tr>
                        <tr>
                            <td>签&nbsp;&nbsp;&nbsp;&nbsp;名：</td>
                            <td>{{userInfo.sign}}</td>
                        </tr>
                        <tr>
                            <td>注册时间：</td>
                            <td>{{userInfo.created}}</td>
                        </tr>
                        <tr>
                            <td>在线状态：</td>
                            <td>
                                <el-switch
                                    active-text="在线"
                                    inactive-text="离线"
                                    active-color="#00DB00"
                                    inactive-color="#8E8E8E"
                                    v-model="userInfo.online"
                                    v-loading="offlineLoading"
                                    :disabled="!userInfo.online" 
                                    @change=forceOffline()>
                                </el-switch>
                            </td>
                        </tr>
                        <tr>
                            <td>账户状态：</td>
                            <td>
                                <el-switch
                                    active-text="正常"
                                    inactive-text="封禁"
                                    active-color="#5B7BFA"
                                    inactive-color="#FF0000"
                                    v-model="userInfo.isdisable" 
                                    @change=isDisable()></el-switch>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">
                                <el-button type="danger" @click="warnSend" :disabled="!userInfo.online">违规警告</el-button>
                            </th>
                        </tr>
                    </table>    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //  v-loading="offlineLoading"  :disabled="!status" 
            searchInfo:{
                userId:'',
                username:''
            },
            info:'',
            select: '',
            userInfo:{
                userId:'',
                username:'',
                avatar:'',
                sign:'',
                created:'',
                online:'',
                isdisable:'',
            },
            warnSendInfo:{
                id:'',
            },
            disableUserInfo:{
                id:'',
                isdisable:''
            },
            userInfoShow: false,
            disableSearch: false,
            searchLoad: false,
            offlineLoading: false,
        }
    },
    created(){
        //获取登录时的websocket
        this.webSocket = this.$store.getters.webSocket;

        //由于需要实时同步在线状态，所以初始化消息接收监听
        this.webSocket.onmessage = this.websocketonmessage;
        // this.initWebSocket();
    },
    methods:{
        search(){
            var newInfo = this.info.trim();
            if(this.select==null||this.select.length==0){
                this.$alert("请选择输入项", '警告', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
            }else if(newInfo==null||newInfo.length==0){
                this.$alert(this.select, '警告', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
            }else{
                if(this.select=="请输入用户ID"){
                    this.searchInfo.userId=this.info;
                }else if(this.select=="请输入用户昵称"){
                    this.searchInfo.userId=0;
                    this.searchInfo.username=this.info.trim();
                }
                this.disableSearch=true;
                this.searchLoad=true;
                this.$store.dispatch('friendByUsernameOrId',this.searchInfo).then(res => {
                    this.disableSearch=false;
                    this.searchLoad=false;
                    if(res.data.code==0){
                        if(res.data.friend.id==null){
                            this.$alert("查询无果！", '警告', {
                                confirmButtonText: '确定',
                                type: 'warning',
                            });
                        }else{
                            this.userInfo.userId=res.data.friend.id;
                            this.userInfo.username=res.data.friend.username;
                            this.userInfo.avatar=res.data.friend.avatar;
                            if(res.data.friend.sign.length>8){
                                this.userInfo.sign=res.data.friend.sign.substring(0,8)+"…";
                            }else{
                                this.userInfo.sign=res.data.friend.sign;
                            }
                            var date = new Date(res.data.friend.created);
                            var y = date.getFullYear();
                            var m = date.getMonth()+1;
                            var d = date.getDate();
                            var h = date.getHours();
                            var mm = date.getMinutes();
                            var s = date.getSeconds();
                            this.userInfo.created= y+'-'+m+'-'+d+' '+h+':'+mm+':'+s;
                            this.userInfo.online=res.data.friend.online;
                            if(res.data.friend.isdisable=="yes"){
                                this.userInfo.isdisable = false;
                            }else{
                                this.userInfo.isdisable = true;
                            }
                            this.userInfoShow = true;
                        }                        
                    }else{
                        this.$alert("查询无果！", '警告', {
                            confirmButtonText: '确定',
                            type: 'warning',
                        });
                    }
                })
                
            }
            console.log("点击搜索");
        },
        reset(){
            this.userInfoShow = false;
            this.info='',
            this.select= '',
            console.log("点击重置");
        },
        websocketonmessage(message){
            const redata = JSON.parse(message.data);
            if(redata.type==="changeOnlineStatus"){
                const dataDeal = this.users;
                console.log(dataDeal);
                //实时接收好友中的状态信息（上下线）
                if(this.userInfo.userId==redata.userId){
                    if(redata.status=="online"){
                        this.userInfo.online=true;
                    }else{
                        this.userInfo.online=false;
                    }
                }
            }else if(redata.type==="updateInfo"){
                const dataDeal = this.users;
                //实时接收好友中的状态信息（上下线）
                if(this.userInfo.userId==redata.userId){
                    this.userInfo.username=redata.mineName;
                    if(redata.sign.length>8){
                        this.userInfo.sign=redata.sign.substring(0,8)+"..."
                    }else{
                        this.userInfo.sign=redata.sign;
                    }
                }
            }
            console.log("收到数据："+message.data);
        },
        forceOffline(){
            this.offlineLoading = true;
            this.warnSendInfo.id=this.userInfo.userId
            this.$store.dispatch('forceOffline',this.warnSendInfo).then(res => {
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
            // console.log(this.lineStatus);
        },
        isDisable(){
            this.disableUserInfo.id=this.userInfo.userId;
            this.disableUserInfo.isdisable=this.userInfo.isdisable;
            this.$store.dispatch('isDisable',this.disableUserInfo).then(res => {
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
            // console.log(this.ableStatus);
        },
        warnSend(){
            this.warnSendInfo.id=this.userInfo.userId
            this.$store.dispatch('sendWarn',this.warnSendInfo).then(res => {
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
            console.log("警告");
        }
    }
}
</script>
<style scoped>
    .el-select .el-input {
        width: 130px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .inputS{
        width: 500px
    }
    .userInfoShowStyle{
        margin-left: 30px;
        width: 900px;
        height: 380px;
        border-radius: 20px;
        box-shadow: 4px 4px 10px 5px rgb(49, 49, 49);
        background-color: rgb(228, 228, 228);
        /* opacity: 0.8; */
        color: #fff;
        font-weight:bold
    }
    .avatarStyle{
        width: 900px;
        text-align: center
    }
    .infoDetal{
        width: 900px;
        margin-top: 30px;
        margin-left: 270px;
        color:black;
        font-size: x-large;
        
    }
</style>
