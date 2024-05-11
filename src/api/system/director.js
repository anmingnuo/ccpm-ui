import request from '@/utils/request'


export function getCourseList(){
  return request({
    url:'/system/director/getCourseList',
    method:'get'
  })
}
// 查询课程负责人管理列表
export function listDirector(query) {
  return request({
    url: '/system/director/list',
    method: 'get',
    params: query
  })
}

// 查询课程负责人管理详细
export function getDirector(id) {
  return request({
    url: '/system/director/' + id,
    method: 'get'
  })
}

// 新增课程负责人管理
export function addDirector(data) {
  return request({
    url: '/system/director',
    method: 'post',
    data: data
  })
}

// 修改课程负责人管理
export function updateDirector(data) {
  return request({
    url: '/system/director',
    method: 'put',
    data: data
  })
}

// 删除课程负责人管理
export function delDirector(id) {
  return request({
    url: '/system/director/' + id,
    method: 'delete'
  })
}
