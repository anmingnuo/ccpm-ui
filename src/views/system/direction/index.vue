<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="方向名称" prop="directionName">
        <el-input
          v-model="queryParams.directionName"
          placeholder="请输入方向名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专业名称" prop="majorId">
        <el-select placeholder="请选择专业" v-model="queryParams.majorId">
          <el-option :label="major.majorName" :value="major.id" v-for="(major,index) in majorList"
                     :key="major.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:direction:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:direction:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:direction:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:direction:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="directionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="方向id" align="center" prop="id"/>
      <el-table-column label="方向名称" align="center" prop="directionName"/>
      <el-table-column label="专业名称" align="center" prop="major.majorName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="addCourse(scope.row)"
            v-hasPermi="['system:direction:addCourse']"
          >添加课程
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:direction:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:direction:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改专业方向对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="方向名称" prop="directionName">
          <el-input v-model="form.directionName" placeholder="请输入方向名称"/>
        </el-form-item>
        <el-form-item label="专业名称" prop="majorId">
          <el-select placeholder="请选择专业" v-model="form.majorId">
            <el-option :label="major.majorName" :value="major.id" v-for="(major,index) in majorList"
                       :key="major.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改专业方向对话框 -->
    <el-dialog :title="courseTitle" :visible.sync="courseOpen" width="500px" append-to-body>
      <el-form ref="courseForm" :model="courseForm" label-width="80px">
        <el-form-item label="课程名称" prop="courseId">
          <el-select placeholder="请选择课程" v-model="courseForm.courseIdList" multiple>
            <el-option :label="course.courseName" :value="course.id" v-for="(course,index) in courseList"
                       :key="course.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="courseSubmitForm()">确 定</el-button>
        <el-button @click="courseCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listDirection,
  getDirection,
  delDirection,
  addDirection,
  updateDirection,
  getMajorList, addDirectionCourse
} from "@/api/system/direction";
import {addCourse, getCourseList, listCourse} from "@/api/system/course";

export default {
  name: "Direction",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 专业方向表格数据
      directionList: [],
      majorList: [],
      courseList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      courseForm: {},
      courseTitle: '',
      courseOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        directionName: null,
        majorId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createTime: [
          {required: true, message: "创建时间不能为空", trigger: "blur"}
        ],
        updateTime: [
          {required: true, message: "更新时间不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getMajorList();
    this.getCourseList();
  },
  methods: {
    getCourseList(){
      getCourseList(null).then(response=>{
        this.courseList=response.data
      })
    },
    //查询专业列表
    getMajorList() {
      getMajorList().then(response => {
        this.majorList = response.data
      })
    },
    /** 查询专业方向列表 */
    getList() {
      this.loading = true;
      listDirection(this.queryParams).then(response => {
        this.directionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        directionName: null,
        majorId: null,
        createTime: null,
        updateTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.majorId = null
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    addCourse(row) {
      this.courseForm = {
        directionId: row.id,
        courseIdList: null
      }
      this.courseOpen=true
      this.title="添加课程"
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加专业方向";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDirection(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改专业方向";
      });
    },
    courseCancel() {
      this.courseOpen = false;
      this.courseForm = {
        courseIdList: null
      }
    },
    courseSubmitForm() {
      this.$refs["courseForm"].validate(valid => {
        if (valid) {
          console.log(this.courseForm)
          addDirectionCourse(this.courseForm).then(response => {
            this.$modal.msgSuccess("新增成功");
            this.courseOpen = false;
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDirection(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDirection(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除专业方向编号为"' + ids + '"的数据项？').then(function () {
        return delDirection(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/direction/export', {
        ...this.queryParams
      }, `direction_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
