<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:goal:add']"
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
          v-hasPermi="['system:goal:edit']"
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
          v-hasPermi="['system:goal:remove']"
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
          v-hasPermi="['system:goal:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="goalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="目标id" align="center" prop="id"/>
      <el-table-column label="课程名称" align="center" prop="course.courseName"/>
      <el-table-column label="类别名称" align="center" prop="category.categoryName"/>
      <el-table-column label="是否完成" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_is_finished" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-position"
            @click="handleSelectionLibrary(scope.row)"
            v-hasPermi="['system:goal:selection']"
          >思政元素选取
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:goal:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:goal:remove']"
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

    <!-- 添加或修改思政目标对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名称" prop="courseId">
          <el-select placeholder="请选择课程" v-model="form.courseId">
            <el-option :label="course.courseName" :value="course.id" v-for="(course,index) in courseList"
                       :key="course.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级分类" prop="firstCategoryId">
          <el-select v-model="form.firstCategoryId" placeholder="请选择分类"
                     @change="handlerFormSecondCategoryList(form.firstCategoryId)">
            <el-option
              :label="firstCategory.categoryName" :value="firstCategory.id"
              v-for="(firstCategory,index) in firstCategoryList"
              :key="firstCategory.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类">
            <el-option
              :label="secondCategory.categoryName" :value="secondCategory.id"
              v-for="(secondCategory,index) in secondCategoryList"
              :key="secondCategory.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否完成" prop="state">
          <el-select v-model="form.state" placeholder="请选择是否完成">
            <el-option
              v-for="dict in dict.type.sys_is_finished"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="selectionLibrary.title" :visible.sync="selectionLibrary.open" width="500px" append-to-body>
      <el-form ref="selection" :model="selection" label-width="80px">
        <el-form-item label="思政元素" prop="libraryId">
          <el-select v-model="selection.libraryId" placeholder="请选择思政元素">
            <el-option v-for="(library,index) in libraryList" :key="library.id"
                       :label="library.title" :value="library.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ensureSelection">确 定</el-button>
        <el-button @click="selectionCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listGoal,
  getGoal,
  delGoal,
  addGoal,
  updateGoal,
  getAdminCourseList,
  getDirectorCourseList, getDirectorList, getTeacherList, getLibraryListByGoalId
} from "@/api/system/goal";
import {getFirstCategoryList, getSecondCategoryList} from "@/api/system/library";
import user from "@/store/modules/user";
import {getCourse, listCourse} from "@/api/system/course";
import {addSelection} from "@/api/system/selection";

export default {
  name: "Goal",
  computed: {
    user() {
      return user
    }
  },
  dicts: ['sys_is_finished'],
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
      // 思政目标表格数据
      goalList: [],
      courseList: [],
      firstCategoryList: [],
      secondCategoryList: [],
      libraryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      selectionLibrary: {
        open: false,
        title: ''
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      selection: {},
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
    this.getFirstCategoryList();
    this.getCourseList()
  },
  methods: {
    getCourseList() {
      if (user.state.roles[0] === 'admin' || user.state.roles[0] === 'administrator') {
        getAdminCourseList().then(response => {
          this.courseList = response.data
        })
      } else if (user.state.roles[0] === 'director') {
        getDirectorCourseList(user.state.id).then(response => {
          this.courseList = response.data
        })
      } else if (user.state.roles[0] === 'teacher') {

      } else {

      }
    },
    getFirstCategoryList() {
      getFirstCategoryList().then(response => {
        this.firstCategoryList = response.data
      })
    },
    handlerFormSecondCategoryList(secondCategoryId) {
      this.form.secondCategoryList = [];
      this.form.categoryId = ''
      getSecondCategoryList(secondCategoryId).then(response => {
        this.secondCategoryList = response.data
      })
    },
    /** 查询思政目标列表 */
    getList() {
      this.loading = true;

      if (user.state.roles[0] === 'admin' || user.state.roles[0] === 'administrator') {
        listGoal(this.queryParams).then(response => {
          this.goalList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      } else if (user.state.roles[0] === 'director') {
        getDirectorList(user.state.id).then(response => {
          this.goalList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      } else if (user.state.roles[0] === 'teacher') {
        getTeacherList(user.state.id).then(response => {
          this.goalList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      } else {

      }

    },
    selectionCancel(){
      this.selectionLibrary.open=false
      this.libraryList=null
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
        courseId: null,
        firstCategoryId: null,
        categoryId: null,
        state: null,
        createTime: null,
        updateTime: null
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加思政目标";
    },
    handleSelectionLibrary(row) {
      this.libraryList = null
      const id = row.id
      getLibraryListByGoalId(id).then(response => {
        this.libraryList = response.data
        this.selectionLibrary.title = "选取思政元素"
        this.selectionLibrary.open = true

      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getGoal(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改思政目标";
      });
    },
    ensureSelection(){
      this.selection.userId=user.state.id
      addSelection(this.selection).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.selectionLibrary.open = false;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateGoal(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGoal(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除思政目标编号为"' + ids + '"的数据项？').then(function () {
        return delGoal(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/goal/export', {
        ...this.queryParams
      }, `goal_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
