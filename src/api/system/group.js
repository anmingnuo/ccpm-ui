import request from '@/utils/request'

export function getTeacherList(){
  return request({
    url: '/system/group/getTeacherList',
    method: 'get',
  })
}
// 查询课程组列表
export function listGroup(query) {
  return request({
    url: '/system/group/list',
    method: 'get',
    params: query
  })
}

// 查询课程组详细
export function getGroup(id) {
  return request({
    url: '/system/group/' + id,
    method: 'get'
  })
}

// 新增课程组
export function addGroup(data) {
  return request({
    url: '/system/group',
    method: 'post',
    data: data
  })
}

// 修改课程组
export function updateGroup(data) {
  return request({
    url: '/system/group',
    method: 'put',
    data: data
  })
}

// 删除课程组
export function delGroup(id) {
  return request({
    url: '/system/group/' + id,
    method: 'delete'
  })
}
