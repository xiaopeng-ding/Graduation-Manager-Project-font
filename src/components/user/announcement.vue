<template>
    <div>
        <div class="AnnounStyle">
            <div>
                
            </div>
            <div>  
                <el-input
                    type="textarea" 
                    v-model="desc"
                    :autosize="{ minRows: 2, maxRows: 9}"
                    style="width: 532px; margin-top: 50px;" ></el-input>
            </div>
            <div style="margin-top: 30px;">
                <el-button type="primary" @click="sendAnn">发布公告</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            desc:''
        }
    },
    methods:{
        sendAnn(){
            if(this.desc==null||this.desc.trim().length==0){
                this.$alert("请输入公告内容", '警告', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
            }else{
                this.$store.dispatch('sendAnn',this.desc.trim()).then(res => {
                    if(res.data.code==0){
                        this.$alert(res.data.msg, '成功', {
                            confirmButtonText: '确定',
                            type: 'success',
                        });
                        console.log(this.desc);
                        this.desc=''
                    }else{
                        this.$alert("公告发布失败，请重试。", '警告', {
                            confirmButtonText: '确定',
                            type: 'warning',
                        });
                    }
                })
            }
        }
    }
}
</script>
<style scoped>
    .AnnounStyle{
        margin-left: 30px;
        margin-top: 30px;
        width: 900px;
        height: 380px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 4px 4px 10px 5px rgb(49, 49, 49);
        background-color: rgb(228, 228, 228);
        /* opacity: 0.8; */
        color: #fff;
        font-weight:bold
    }
</style>
