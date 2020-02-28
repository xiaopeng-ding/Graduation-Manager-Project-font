<template>
    <div class="admin" :style="note">
        <div class="adminTitel">
            <h1>欢迎使用后台管理系统</h1>
        </div>
        <div class="logout">
            <el-button 
            size="mini"
            type="warning"
            @click="logout">注销</el-button>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user:{},
                webSocket:{},
                note: {
                    backgroundImage: "url(" + require("../../../static/img/bg.jpg") + ") ",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }
            }
        },
        created(){
            //获取登录时的websocket
            this.webSocket = this.$store.getters.webSocket;
            //由于需要实时同步在线状态，所以初始化消息接收监听
            this.webSocket.onmessage = this.websocketonmessage;

            
        },
        methods:{
            logout(){
                // this.$store.dispatch('logout');
                this.webSocket.close();
                this.$router.push({ path: '/' })
                // this.$router.push({ path: '/' })
            },
            websocketonmessage(message){
            const redata = JSON.parse(message.data);
            if(redata.type==="forceOffline"){
                this.webSocket.close();
                this.$router.push({ path: '/' })
                // this.$message({
                //     message:redata.message,
                //     type:"error"
                // })
                this.$alert(redata.message, '警告', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
                // MessageBox('警告', redata.message);
            }
            // redata.userId;
            // redata.status;
            // console.log(this.friendDatas);
            console.log("收到数据："+message.data);
        }
        }
    }
</script>

<style scoped>
    
    .admin{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .adminTitel{
        /* position: relative; */
        text-align: center;
        font-family: \6977\4F53;
        color: rgb(255, 255, 255);
        width: 100%;
    }

    .logout{
        position:fixed;
        top: 26px;
        /* left: 0; */
        right: 2.5%;
    }
</style>
