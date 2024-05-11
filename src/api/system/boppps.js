import request from '@/utils/request'

export function getLibraryListByCourseId(courseId) {
  return request({
    url: '/system/boppps/getLibraryListByCourseId/' + courseId,
    method: 'get'
  })
}
export function teacherGetCourseList(userId) {
  return request({
    url: '/system/boppps/teacherGetCourseList/' + userId,
    method: 'get'
  })
}
export function directionGetCourseList(courseId) {
  return request({
    url: '/system/boppps/directionGetCourseList/' + courseId,
    method: 'get'
  })
}
export function teacherGetUserList(userId) {
  return request({
    url: '/system/boppps/teacherGetUserList/' + userId,
    method: 'get'
  })
}
export function directorGetUserList(userId) {
  return request({
    url: '/system/boppps/directorGetUserList/' + userId,
    method: 'get'
  })
}
export function getChapterList() {
  return request({
    url: '/system/boppps/getChapterList',
    method: 'get'
  })
}
export function teacherListBoppps(query) {
  return request({
    url: '/system/boppps/teacherListBoppps',
    method: 'get',
    params: query
  })
}
export function directorListBoppps(query) {
  return request({
    url: '/system/boppps/directorListBoppps',
    method: 'get',
    params: query
  })
}
// 查询boppps课程设计列表
export function listBoppps(query) {
  return request({
    url: '/system/boppps/list',
    method: 'get',
    params: query
  })
}

// 查询boppps课程设计详细
export function getBoppps(id) {
  return request({
    url: '/system/boppps/' + id,
    method: 'get'
  })
}

// 新增boppps课程设计
export function addBoppps(data) {
  return request({
    url: '/system/boppps',
    method: 'post',
    data: data
  })
}

// 修改boppps课程设计
export function updateBoppps(data) {
  return request({
    url: '/system/boppps',
    method: 'put',
    data: data
  })
}

// 删除boppps课程设计
export function delBoppps(id) {
  return request({
    url: '/system/boppps/' + id,
    method: 'delete'
  })
}
