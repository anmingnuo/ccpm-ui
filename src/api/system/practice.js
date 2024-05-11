import request from '@/utils/request'

// 查询实践教学案例列表
export function listPractice(query) {
  return request({
    url: '/system/practice/list',
    method: 'get',
    params: query
  })
}

// 查询实践教学案例详细
export function getPractice(id) {
  return request({
    url: '/system/practice/' + id,
    method: 'get'
  })
}

// 新增实践教学案例
export function addPractice(data) {
  return request({
    url: '/system/practice',
    method: 'post',
    data: data
  })
}

// 修改实践教学案例
export function updatePractice(data) {
  return request({
    url: '/system/practice',
    method: 'put',
    data: data
  })
}

// 删除实践教学案例
export function delPractice(id) {
  return request({
    url: '/system/practice/' + id,
    method: 'delete'
  })
}
