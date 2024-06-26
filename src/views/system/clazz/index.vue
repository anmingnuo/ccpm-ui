<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级名称" prop="clazzName">
        <el-input
          v-model="queryParams.clazzName"
          placeholder="请输入班级名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年级名称" prop="gradeId">
        <el-select placeholder="请选择年级" v-model="queryParams.gradeId">
          <el-option :label="grade.gradeName" :value="grade.id" v-for="(grade,index) in gradeList"
                     :key="grade.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="方向名称" prop="directionId">
        <el-select placeholder="请选择方向" v-model="queryParams.directionId">
          <el-option :label="direction.directionName" :value="direction.id" v-for="(direction,index) in directionList"
                     :key="direction.id"></el-option>
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
          v-hasPermi="['system:clazz:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:clazz:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:clazz:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:clazz:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="clazzList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级id" align="center" prop="id" />
      <el-table-column label="班级名称" align="center" prop="clazzName" />
      <el-table-column label="方向名称" align="center" prop="direction.directionName" />
      <el-table-column label="年级名称" align="center" prop="grade.gradeName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:clazz:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:clazz:remove']"
          >删除</el-button>
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

    <!-- 添加或修改班级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名称" prop="clazzName">
          <el-input v-model="form.clazzName" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="方向" prop="directionId">
          <el-select placeholder="请选择方向" v-model="form.directionId">
            <el-option :label="direction.directionName" :value="direction.id" v-for="(direction,index) in directionList"
                       :key="direction.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
          <el-select placeholder="请选择年级" v-model="form.gradeId">
            <el-option :label="grade.gradeName" :value="grade.id" v-for="(grade,index) in gradeList"
                       :key="grade.id"></el-option>
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
import {listClazz, getClazz, delClazz, addClazz, updateClazz, getGradeList, getDirectionList} from "@/api/system/clazz";

export default {
  name: "Clazz",
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
      // 班级表格数据
      clazzList: [],
      gradeList:[],
      directionList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clazzName: null,
        directionId: null,
        gradeId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        clazzName: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ],
        directionId: [
          { required: true, message: "方向id不能为空", trigger: "blur" }
        ],
        gradeId: [
          { required: true, message: "年级id不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getGradeList();
    this.getDirectionList();
  },
  methods: {
    getGradeList() {
      getGradeList().then(response=>{
        this.gradeList = response.data
      })
    },
    getDirectionList(){
      getDirectionList().then(response=>{
        this.directionList = response.data
      })
    },
    /** 查询班级列表 */
    getList() {
      this.loading = true;
      listClazz(this.queryParams).then(response => {
        this.clazzList = response.rows;
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
        clazzName: null,
        directionId: null,
        gradeId: null,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班级";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getClazz(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班级";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateClazz(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClazz(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除班级编号为"' + ids + '"的数据项？').then(function() {
        return delClazz(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/clazz/export', {
        ...this.queryParams
      }, `clazz_${new Date().getTime()}.xlsx`)
    }
  },
};
</script>
