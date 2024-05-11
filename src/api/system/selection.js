import request from '@/utils/request'

export function teacherListSelection(userId) {
  return request({
    url: '/system/selection/teacherListSelection/' + userId,
    method: 'get'
  })
}
export function directorListSelection(userId) {
  return request({
    url: '/system/selection/directorListSelection/' + userId,
    method: 'get'
  })
}
// 查询元素选取列表
export function listSelection(query) {
  return request({
    url: '/system/selection/list',
    method: 'get',
    params: query
  })
}

// 查询元素选取详细
export function getSelection(id) {
  return request({
    url: '/system/selection/' + id,
    method: 'get'
  })
}

// 新增元素选取
export function addSelection(data) {
  return request({
    url: '/system/selection',
    method: 'post',
    data: data,
  })
}

// 修改元素选取
export function updateSelection(data) {
  return request({
    url: '/system/selection',
    method: 'put',
    data: data
  })
}

// 删除元素选取
export function delSelection(id) {
  return request({
    url: '/system/selection/' + id,
    method: 'delete'
  })
}
