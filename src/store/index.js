import Vue from 'vue'
import Vuex from 'vuex'
import users from './model/user.js'
import login from './model/login.js'


Vue.use(Vuex);

export default new Vuex.Store ({
   modules:{
     users,
     login,
   }
})
