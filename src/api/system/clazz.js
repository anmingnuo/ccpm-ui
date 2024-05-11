import request from '@/utils/request'

export function getGradeList(){
  return request({
    url: '/system/clazz/gradeList',
    method: 'get',
  })
}
export function getDirectionList(){
  return request({
    url: '/system/clazz/directionList',
    method: 'get',
  })
}
// 查询班级列表
export function listClazz(query) {
  return request({
    url: '/system/clazz/list',
    method: 'get',
    params: query
  })
}

// 查询班级详细
export function getClazz(id) {
  return request({
    url: '/system/clazz/' + id,
    method: 'get'
  })
}

// 新增班级
export function addClazz(data) {
  return request({
    url: '/system/clazz',
    method: 'post',
    data: data
  })
}

// 修改班级
export function updateClazz(data) {
  return request({
    url: '/system/clazz',
    method: 'put',
    data: data
  })
}

// 删除班级
export function delClazz(id) {
  return request({
    url: '/system/clazz/' + id,
    method: 'delete'
  })
}
