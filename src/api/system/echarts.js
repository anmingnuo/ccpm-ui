import request from "@/utils/request";

export function getLibraryCategoryECharts() {
  return request({
    url: '/system/category/getCategoryLibraryCount',
    method: 'get'
  })
}
export function getLibrarySectionECharts() {
  return request({
    url: '/system/selection/getLibrarySectionECharts',
    method: 'get'
  })
}
export function getLibraryViewECharts() {
  return request({
    url: '/system/library/getLibraryViewECharts',
    method: 'get'
  })
}
