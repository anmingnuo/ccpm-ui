import request from '@/utils/request'
export function getLibraryListByGoalId(goalId){
  return request({
    url: '/system/goal/getLibraryListByGoalId/'+goalId,
    method: 'get',
  })
}
export function getTeacherList(userId){
  return request({
    url: '/system/goal/getTeacherList/'+userId,
    method: 'get',
  })
}
export function getDirectorList(userId){
  return request({
    url: '/system/goal/getDirectorList/'+userId,
    method: 'get',
  })
}
export function getDirectorCourseList(userId){
  return request({
    url: '/system/goal/getDirectorCourseList/'+userId,
    method: 'get',
  })
}
export function getAdminCourseList(){
  return request({
    url: '/system/goal/getAdminCourseList',
    method: 'get',
  })
}
// 查询思政目标列表
export function listGoal(query) {
  return request({
    url: '/system/goal/list',
    method: 'get',
    params: query
  })
}

// 查询思政目标详细
export function getGoal(id) {
  return request({
    url: '/system/goal/' + id,
    method: 'get'
  })
}

// 新增思政目标
export function addGoal(data) {
  return request({
    url: '/system/goal',
    method: 'post',
    data: data
  })
}

// 修改思政目标
export function updateGoal(data) {
  return request({
    url: '/system/goal',
    method: 'put',
    data: data
  })
}

// 删除思政目标
export function delGoal(id) {
  return request({
    url: '/system/goal/' + id,
    method: 'delete'
  })
}
