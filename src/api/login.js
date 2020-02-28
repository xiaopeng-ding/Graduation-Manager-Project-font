import request from '@/utils/request.js'


//登录功能
export function login(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/admin/login',
    method: 'post',
    data:'username='+username+'&password='+password
  })
}
