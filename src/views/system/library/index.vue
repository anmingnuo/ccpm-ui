<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="一级分类" prop="firstCategoryId">
        <el-select v-model="queryParams.firstCategoryId" placeholder="请选择分类"
                   @change="queryGetSecondCategoryList(queryParams.firstCategoryId)">
          <el-option
            :label="firstCategory.categoryName" :value="firstCategory.id"
            v-for="(firstCategory,index) in firstCategoryList"
            :key="firstCategory.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" prop="secondCategoryId">
        <el-select v-model="queryParams.secondCategoryId" placeholder="请选择分类">
          <el-option
            :label="secondCategory.categoryName" :value="secondCategory.id"
            v-for="(secondCategory,index) in secondCategoryList"
            :key="secondCategory.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选取次数" prop="selectionCount">
        <el-input
          v-model="queryParams.selectionCount"
          placeholder="请输入选取次数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_job_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                   :disabled="(queryParams.firstCategoryId!==''&&queryParams.secondCategoryId==='')">搜索
        </el-button>
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
          v-hasPermi="['system:library:add']"
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
          v-hasPermi="['system:library:edit']"
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
          v-hasPermi="['system:library:remove']"
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
          v-hasPermi="['system:library:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="libraryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="思政库id" align="center" prop="id"/>
      <el-table-column label="思政标题" align="center" prop="title"/>
      <el-table-column label="思政描述" align="center" prop="description" :show-overflow-tooltip="true"/>
      <el-table-column label="选取次数" align="center" prop="selectionCount"/>
      <el-table-column label="浏览量" align="center" prop="views"/>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_job_status" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['system:library:view']"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:library:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:library:remove']"
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

    <!-- 添加或修改思政库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="思政标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入思政标题"/>
        </el-form-item>
        <el-form-item label="思政描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入思政描述" type="textarea"/>
        </el-form-item>
        <el-form-item label="一级分类" prop="firstCategoryId">
          <el-select v-model="form.firstCategoryId" placeholder="请选择分类"
                     @change="formGetSecondCategoryList(form.firstCategoryId)">
            <el-option
              :label="firstCategory.categoryName" :value="firstCategory.id"
              v-for="(firstCategory,index) in firstCategoryList"
              :key="firstCategory.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="secondCategoryId">
          <el-select v-model="form.secondCategoryId" placeholder="请选择分类">
            <el-option
              :label="secondCategory.categoryName" :value="secondCategory.id"
              v-for="(secondCategory,index) in secondCategoryList"
              :key="secondCategory.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.sys_job_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="viewTitle" :visible.sync="viewOpen" width="500px" append-to-body>
      <el-row>
        <el-col class="card-box"  style="width: 20%" >
            思政标题:
        </el-col >
        <el-col  class="card-box" style="width: 80%">
          {{library.title}}
        </el-col>
        <el-col class="card-box"  style="width: 20%">
          思政描述:
        </el-col >
        <el-col  class="card-box" style="width: 80%">
          {{library.description}}
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  listLibrary,
  getLibrary,
  delLibrary,
  addLibrary,
  updateLibrary,
  getFirstCategoryList, getSecondCategoryList, viewLibrary
} from "@/api/system/library";

export default {
  name: "Library",
  dicts: ['sys_job_status'],
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
      // 思政库表格数据
      libraryList: [],
      firstCategoryList: [],
      secondCategoryList: [],
      library: {},
      viewTitle: "",
      viewOpen: false,
      // 弹出标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        selectionCount: null,
        state: null,
        firstCategoryId: null,
        secondCategoryId: null
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
    this.getFirstCategoryList();
  },
  methods: {
    queryGetSecondCategoryList(firstCategoryId) {
      this.queryParams.secondCategoryList = [];
      this.queryParams.secondCategoryId = ''
      getSecondCategoryList(firstCategoryId).then(response => {
        this.secondCategoryList = response.data
      })
    },
    formGetSecondCategoryList(firstCategoryId) {
      this.form.secondCategoryList = [];
      this.form.secondCategoryId = ''
      getSecondCategoryList(firstCategoryId).then(response => {
        this.secondCategoryList = response.data
      })
    },
    getFirstCategoryList() {
      getFirstCategoryList().then(response => {
        this.firstCategoryList = response.data
      })
    },
    /** 查询思政库列表 */
    getList() {
      this.loading = true;
      listLibrary(this.queryParams).then(response => {
        this.libraryList = response.rows;
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
        title: null,
        description: null,
        state: null,
        firstCategoryId: null,
        secondCategoryId: null,
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
      this.title = "添加思政库";
    },
    handleView(row) {
      const id = row.id || this.ids
      viewLibrary(id).then(response => {
        this.library = response.data;
        this.viewOpen = true;
        this.viewTitle = "查看详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLibrary(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改思政库";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLibrary(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLibrary(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除思政库编号为"' + ids + '"的数据项？').then(function () {
        return delLibrary(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/library/export', {
        ...this.queryParams
      }, `library_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
