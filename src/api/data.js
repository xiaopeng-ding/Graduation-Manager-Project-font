import request from '@/utils/request.js'

export function getUsers() {
    return request({
      url: '/admin/getUsers',
      method: 'get'
    })
}

export function sendWarn(userId) {
  return request({
    url: '/admin/warn?userId='+userId,
    method: 'get'
  })
}

export function forceOffline(userId) {
  return request({
    url: '/admin/forceOffline?userId='+userId,
    method: 'get'
  })
}

export function isDisable(userId,isdisable) {
  return request({
    url: '/admin/isDisable?userId='+userId+"&isdisable="+isdisable,
    method: 'get'
  })
}

export function changeManagerPassword(userId,oldPassword,password) {
  return request({
      url: '/admin/changeManagerPassword',
      method: 'post',
      data:'userId='+userId+'&oldPassword='+oldPassword+'&password='+password
  })
}

export function changeManagerInfo(userId,username) {
  return request({
      url: '/admin/changeManagerInfo',
      method: 'post',
      data:'userId='+userId+'&username='+username
  })
}

export function friendByUsernameOrId(userId,username) {
  return request({
    url: '/user/friendByUsernameOrId?username='+username+'&userId='+userId,
    method: 'get'
  })
}

export function sendAnn(str) {
  return request({
      url: '/admin/sendAnn',
      method: 'post',
      data:'str='+str
  })
}