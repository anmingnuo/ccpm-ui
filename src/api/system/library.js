import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";


export function getSecondCategoryList(firstCategoryId){
  return request({
    url: '/system/library/getSecondCategoryList/'+ parseStrEmpty(firstCategoryId),
    method: 'get',
  })
}
export function getFirstCategoryList(){
  return request({
    url: '/system/library/getFirstCategoryList',
    method: 'get',
  })
}
// 查询思政库列表
export function listLibrary(query) {
  return request({
    url: '/system/library/list',
    method: 'get',
    params: query
  })
}
export function viewLibrary(id) {
  return request({
    url: '/system/library/viewLibrary/' + id,
    method: 'get'
  })
}


// 查询思政库详细
export function getLibrary(id) {
  return request({
    url: '/system/library/' + id,
    method: 'get'
  })
}

// 新增思政库
export function addLibrary(data) {
  return request({
    url: '/system/library',
    method: 'post',
    data: data
  })
}

// 修改思政库
export function updateLibrary(data) {
  return request({
    url: '/system/library',
    method: 'put',
    data: data
  })
}

// 删除思政库
export function delLibrary(id) {
  return request({
    url: '/system/library/' + id,
    method: 'delete'
  })
}
