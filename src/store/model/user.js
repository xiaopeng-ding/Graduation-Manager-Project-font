import types from '../types.js'
import Axios from 'axios';
import { Message } from 'element-ui';
import { getUsers,sendWarn,forceOffline,isDisable,changeManagerPassword,friendByUsernameOrId,sendAnn } from '@/api/data'
import host from '@/utils/webSocket_con.js'


const state = {
  users:[],
}

const getters = {
  users(state){
    return state.users;
  },
}

const actions = {
  getUsers({commit}){
    return new Promise(resolve => {
      getUsers().then(res => {
          const data = res.data;
          commit(types.GET_USER,data);
          resolve(res);
      }).catch(err => {
          Message.error('服务器链接异常 '+err);
      })
    });
  },
  sendWarn({commit},user){
    return new Promise(resolve => {
      sendWarn(user.id).then(res => {
          const data = res.data;
          // commit(types.GET_USER,data);
          resolve(res);
      }).catch(err => {
          Message.error('服务器链接异常 '+err);
      })
    });
  },
  forceOffline({commit},user){
    return new Promise(resolve => {
      forceOffline(user.id).then(res => {
          const data = res.data;
          // commit(types.GET_USER,data);
          resolve(res);
      }).catch(err => {
          Message.error('服务器链接异常 '+err);
      })
    });
  },
  isDisable({commit},user){
    return new Promise(resolve => {
      isDisable(user.id,user.isdisable).then(res => {
          const data = res.data;
          // commit(types.GET_USER,data);
          resolve(res);
      }).catch(err => {
          Message.error('服务器链接异常 '+err);
      })
    });
  },
  changeManagerPassword({commit},user){
    return new Promise(resolve => {
      changeManagerPassword(user.id,user.oldPassword,user.password).then(res => {
          const data = res.data;
          // commit(types.GET_USER,data);
          resolve(res);
      }).catch(err => {
          Message.error('服务器链接异常 '+err);
      })
    });
  },
  friendByUsernameOrId({commit},searchInfo){
    return new Promise(resolve => {
      friendByUsernameOrId(searchInfo.userId,searchInfo.username).then(res => {
          const data = res.data;
          // commit(types.GET_USER,data);
          resolve(res);
      }).catch(err => {
          Message.error('服务器链接异常 '+err);
      })
    });
  },
  sendAnn({commit},str){
    return new Promise(resolve => {
      sendAnn(str).then(res => {
          const data = res.data;
          // commit(types.GET_USER,data);
          resolve(res);
      }).catch(err => {
          Message.error('服务器链接异常 '+err);
      })
    });
  },
  
}

const mutations = {
  [types.GET_USER](state,data){
    state.users=data.object;
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
