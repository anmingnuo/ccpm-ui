import request from '@/utils/request'


export function getMajorList(){
  return request({
    url: '/system/direction/majorList',
    method: 'get',
  })
}
// 查询专业方向列表
export function listDirection(query) {
  return request({
    url: '/system/direction/list',
    method: 'get',
    params: query
  })
}

// 查询专业方向详细
export function getDirection(id) {
  return request({
    url: '/system/direction/' + id,
    method: 'get'
  })
}

export function addDirectionCourse(data) {
  return request({
    url: '/system/direction/addDirectionCourse',
    method: 'post',
    data: data
  })
}
// 新增专业方向
export function addDirection(data) {
  return request({
    url: '/system/direction',
    method: 'post',
    data: data
  })
}

// 修改专业方向
export function updateDirection(data) {
  return request({
    url: '/system/direction',
    method: 'put',
    data: data
  })
}

// 删除专业方向
export function delDirection(id) {
  return request({
    url: '/system/direction/' + id,
    method: 'delete'
  })
}


