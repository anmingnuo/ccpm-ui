<template>
  <el-row>
    <el-col :span="24" class="card-box"  style="width: 50%">
      <el-card>
        <LibraryCategoryECharts/>
      </el-card>
    </el-col >
    <el-col :span="24" class="card-box" style="width: 50%">
      <el-card>
        <LibrarySectionECharts/>
      </el-card>
    </el-col>
    <el-col :span="24" class="card-box" style="width: 100%">
      <el-card>
        <LibraryViewECharts/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import LibraryCategoryECharts from "@/views/system/echarts/LibraryCategoryECharts.vue";
import LibrarySectionECharts from "@/views/system/echarts/LibrarySectionECharts.vue";
import LibraryViewECharts from "@/views/system/echarts/LibraryViewECharts.vue";

export default {
  components: {LibraryViewECharts, LibrarySectionECharts, LibraryCategoryECharts}

}
</script>

<style lang="scss" scoped>

</style>
