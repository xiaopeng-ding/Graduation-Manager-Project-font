<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import QueryUser from './components/user/QueryUser.vue'
  import Login from './components/Login.vue'
  import Admin from './components/super/Admin.vue'
  import ChangeUserInfo from './components/change/ChangeUserInfo.vue'
  import ChangeUserPassword from './components/change/ChangeUserPassword.vue'
  import Anav from './components/super/Anav.vue'
  import SearchUser from './components/user/SearchUser.vue'
  import announcement from './components/user/announcement.vue'
  //announcement
   
  export default {
    components:{
      QueryUser,
      Login,
      Admin,
      ChangeUserInfo,
      ChangeUserPassword,
      Anav,
      SearchUser,
      announcement
    }
  }
</script>

<style>

</style>
