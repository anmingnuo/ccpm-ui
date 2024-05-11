import request from '@/utils/request'

// 查询方向课程列表
export function listDirectionCourse(query) {
  return request({
    url: '/system/directionCourse/list',
    method: 'get',
    params: query
  })
}

// 查询方向课程详细
export function getDirectionCourse(directionId) {
  return request({
    url: '/system/directionCourse/' + directionId,
    method: 'get'
  })
}

// 新增方向课程
export function addDirectionCourse(data) {
  return request({
    url: '/system/directionCourse',
    method: 'post',
    data: data
  })
}

// 修改方向课程
export function updateDirectionCourse(data) {
  return request({
    url: '/system/directionCourse',
    method: 'put',
    data: data
  })
}

// 删除方向课程
export function delDirectionCourse(directionId) {
  return request({
    url: '/system/directionCourse/' + directionId,
    method: 'delete'
  })
}
