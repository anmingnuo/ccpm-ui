<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_is_finished"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          v-hasPermi="['system:boppps:add']"
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
          v-hasPermi="['system:boppps:edit']"
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
          v-hasPermi="['system:boppps:remove']"
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
          v-hasPermi="['system:boppps:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bopppsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id"/>
      <el-table-column label="用户名称" align="center" prop="sysUser.userName"/>
      <el-table-column label="课程名称" align="center" prop="course.courseName"/>
      <el-table-column label="章节名称" align="center" prop="chapter.chapterName"/>
      <el-table-column label="元素名称" align="center" prop="library.title"/>
      <el-table-column label="引入描述" align="center" prop="bridge"/>
      <el-table-column label="引入时长" align="center" prop="bridgeTime"/>
      <el-table-column label="目标描述" align="center" prop="object"/>
      <el-table-column label="目标时长" align="center" prop="objectTime"/>
      <el-table-column label="课前摸底" align="center" prop="preAssessment"/>
      <el-table-column label="摸底时长" align="center" prop="preTime"/>
      <el-table-column label="参与式学习" align="center" prop="praticipatoryLearning"/>
      <el-table-column label="参与时长" align="center" prop="praticipatoryTime"/>
      <el-table-column label="课后测验" align="center" prop="postAssessment"/>
      <el-table-column label="测验时长" align="center" prop="postTime"/>
      <el-table-column label="总结" align="center" prop="summary"/>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_is_finished" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:boppps:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:boppps:remove']"
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
    <!-- 添加或修改boppps课程设计对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名称" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择用户名称">
            <el-option :label="user.userName" :value="user.userId" v-for="(user,index) in sysUserList"
                       :key="user.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseId">
          <el-select v-model="form.courseId" placeholder="请选择课程名称" @change="getCourseLibrary(form.courseId)">
            <el-option
              :label="course.courseName" :value="course.id" v-for="(course,index) in courseList"
              :key="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="章节名称" prop="chapterId">
          <el-select v-model="form.chapterId" placeholder="请输入章节名称">
            <el-option :label="chapter.chapterName" :value="chapter.id" v-for="(chapter,index) in chapterList"
                       :key="chapter.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="思政元素" prop="libraryId">
          <el-select v-model="form.libraryId" placeholder="请输入思政元素名称">
            <el-option :label="library.title" :value="library.id" v-for="(library,index) in libraryList"
                       :key="library.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="引入描述" prop="bridge">
          <el-input v-model="form.bridge" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="引入时长" prop="bridgeTime">
          <el-input v-model="form.bridgeTime" placeholder="请输入引入时长"/>
        </el-form-item>
        <el-form-item label="目标描述" prop="object">
          <el-input v-model="form.object" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="目标时长" prop="objectTime">
          <el-input v-model="form.objectTime" placeholder="请输入目标时长"/>
        </el-form-item>
        <el-form-item label="课前摸底" prop="preAssessment">
          <el-input v-model="form.preAssessment" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="摸底时长" prop="preTime">
          <el-input v-model="form.preTime" placeholder="请输入摸底时长"/>
        </el-form-item>
        <el-form-item label="参与式学习" prop="praticipatoryLearning">
          <el-input v-model="form.praticipatoryLearning" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="参与时长" prop="praticipatoryTime">
          <el-input v-model="form.praticipatoryTime" placeholder="请输入参与时长"/>
        </el-form-item>
        <el-form-item label="课后测验" prop="postAssessment">
          <el-input v-model="form.postAssessment" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="测验时长" prop="postTime">
          <el-input v-model="form.postTime" placeholder="请输入测验时长"/>
        </el-form-item>
        <el-form-item label="总结" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
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
  </div>
</template>

<script>
import {
  listBoppps,
  getBoppps,
  delBoppps,
  addBoppps,
  updateBoppps,
  directorListBoppps,
  teacherListBoppps,
  getChapterList,
  directorGetUserList,
  teacherGetUserList,
  directionGetCourseList,
  teacherGetCourseList, directorGetLibraryList, teacherGetLibraryList, getLibraryListByCourseId
} from "@/api/system/boppps";
import user from "@/store/modules/user";
import {directorListSelection, listSelection, teacherListSelection} from "@/api/system/selection";
import teacher from "@/views/system/teacher/index.vue";

export default {
  name: "Boppps",
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
      // boppps课程设计表格数据
      bopppsList: [],
      chapterList: [],
      courseList: [],
      libraryList: [],
      sysUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        userId:null,
        pageNum: 1,
        pageSize: 10,
        state: null,
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
    this.getChapterList();
    this.getUserList();
    this.getCourseList();
  },
  methods: {
    getUserList() {
      if (user.state.roles[0] === 'admin' || user.state.roles[0] === 'administrator') {

      } else if (user.state.roles[0] === 'director') {
        directorGetUserList(user.state.id).then(response => {
          this.sysUserList = response.data
        })
      } else if (user.state.roles[0] === 'teacher') {
        teacherGetUserList(user.state.id).then(response => {
          this.sysUserList = response.data
        })
      } else {

      }
    },
    getCourseLibrary(courseId) {
      this.libraryList=[]
      if (user.state.roles[0] === 'admin' || user.state.roles[0] === 'administrator') {

      } else if (user.state.roles[0] === 'director') {
        getLibraryListByCourseId(courseId).then(response=>{
            this.libraryList=response.data
          })
      } else if (user.state.roles[0] === 'teacher') {
        getLibraryListByCourseId(courseId).then(response=>{
          this.libraryList=response.data
        })
      } else {

      }
    },
    getCourseList() {
      if (user.state.roles[0] === 'admin' || user.state.roles[0] === 'administrator') {

      } else if (user.state.roles[0] === 'director') {
        directionGetCourseList(user.state.courseId).then(response => {
          this.courseList = response.data;
        })
      } else if (user.state.roles[0] === 'teacher') {
        teacherGetCourseList(user.state.id).then(response => {
          this.courseList = response.data;
        })
      } else {

      }
    },
    getChapterList() {
      getChapterList().then(response => {
        this.chapterList = response.data
      })
    },
    /** 查询boppps课程设计列表 */
    getList() {
      this.loading = true;
      if (user.state.roles[0] === 'admin' || user.state.roles[0] === 'administrator') {
        listBoppps(this.queryParams).then(response => {
          this.bopppsList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      } else if (user.state.roles[0] === 'director') {
        this.queryParams.userId = user.state.id
        directorListBoppps(this.queryParams).then(response => {
          this.bopppsList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      } else if (user.state.roles[0] === 'teacher') {
        this.queryParams.userId = user.state.id
        teacherListBoppps(this.queryParams).then(response => {
          this.bopppsList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
      } else {

      }

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
        userId: null,
        courseId: null,
        chapterId: null,
        libraryId: null,
        bridge: null,
        bridgeTime: null,
        object: null,
        objectTime: null,
        preAssessment: null,
        preTime: null,
        praticipatoryLearning: null,
        praticipatoryTime: null,
        postAssessment: null,
        postTime: null,
        summary: null,
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
      this.title = "添加boppps课程设计";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBoppps(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改boppps课程设计";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBoppps(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBoppps(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除boppps课程设计编号为"' + ids + '"的数据项？').then(function () {
        return delBoppps(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/boppps/export', {
        ...this.queryParams
      }, `boppps_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
