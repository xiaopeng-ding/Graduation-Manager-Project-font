import types from '../types.js'
import Axios from 'axios';
import { Message } from 'element-ui';
import { login } from '@/api/login'
import {changeManagerInfo} from '@/api/data'
import host from '@/utils/webSocket_con.js'

const state = {
    loginResult:{
        code:'',
        msg:'',
        object:{}
    },
    webSocket:{}
}

const getters = {
    loginResult(state){
        return state.loginResult;
    },
    webSocket(state){
        return state.webSocket
    }
}

const actions = {
    login({commit},userInfo){
        const username = userInfo.username.trim()
        return new Promise(resolve => {
            login(username, userInfo.password).then(res => {
                const data = res.data;
                commit(types.GET_LOGIN,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
    },
    setWebSocket({commit},data){
        return new Promise(resolve => {
            const websocket = new WebSocket("ws://"+host.HOST_NAME+"/websocket/"+data+"/")
            commit(types.SET_WEBSOCKET,websocket);
            resolve(websocket);
        });
    },
    changeManagerInfo({commit},user){
        return new Promise(resolve => {
            const username = user.username.trim()
            changeManagerInfo(user.id,username).then(res => {
                const data = res.data;
                // console.log(data);
                commit(types.GET_LOGIN,data);
                resolve(res);
            }).catch(err => {
                Message.error('服务器链接异常 '+err);
            })
        });
      },
}

const mutations = {
    [types.GET_LOGIN](state,data){
        state.loginResult = data
        // console.log(state.loginResult)
    },
    [types.SET_WEBSOCKET](state,data){
        state.webSocket = data
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
  