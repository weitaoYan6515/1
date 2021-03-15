<template>
  <div class="prototype-container" id="container">
    <div class="tableHead">
      <el-form :inline="true">
        <el-form-item label="产品类型：">
          <el-select v-model="type" filterable placeholder="--选择类型--">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.Type"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBody">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="Name" label="产品名称"> </el-table-column>
        <el-table-column label="产品类型">
          <template slot-scope="scope">
            {{ scope.row.Type == 1 ? "漆面膜" : "改色膜" }}
          </template>
        </el-table-column>
        <el-table-column label="质保年限">
          <template slot-scope="scope">
            {{ scope.row.GPYear == 99 ? "永久" : scope.row.GPYear }}
          </template>
        </el-table-column>
        <el-table-column prop="GPCount" label="质保次数"> </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.CreateTime.slice(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column width="150" prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="bj(scope.$index, scope.row)" size="small"
              >编辑</el-button
            >
            <el-button @click="sc(scope.$index, scope.row)" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tablePage">
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        @current-change="current_change"
        :hide-on-single-page="true"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="添加产品原型"
      :visible.sync="newForm"
      :close-on-click-modal="true"
      class="edit-form"
      :before-close="newClose"
    >
      <el-form
        :model="newData"
        label-width="120px"
        ref="newForm"
        :rules="rules"
      >
        <el-form-item label="产品名称：" prop="Name">
          <el-input v-model="newData.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型：" prop="Type">
          <el-select v-model="newData.Type" filterable placeholder="--选择类型--" @change="typeChanged">
            <el-option
              v-for="(item, index) in typeList.slice(1)"
              :key="index"
              :label="item.Type"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质保年限：" prop="GPYear">
          <el-input v-model="newData.GPYear" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="质保次数：" prop="GPCount">
          <el-input v-model="newData.GPCount" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="newCancel('newForm')">取消</el-button>
        <el-button type="primary" @click.native="newUpdate('newForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="修改产品原型"
      :visible.sync="editForm"
      :close-on-click-modal="true"
      class="edit-form"
      :before-close="editClose"
    >
      <el-form
        :model="editData"
        label-width="120px"
        ref="editForm"
        :rules="rules"
      >
        <el-form-item label="产品名称：" prop="Name">
          <el-input v-model="editData.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型：" prop="Type">
          <el-select v-model="editData.Type" filterable placeholder="--选择类型--">
            <el-option
              v-for="(item, index) in typeList.slice(1)"
              :key="index"
              :label="item.Type"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质保年限：" prop="GPYear">
          <el-input v-model="editData.GPYear" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="质保次数：" prop="GPCount">
          <el-input v-model="editData.GPCount" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editCancel('editForm')">取消</el-button>
        <el-button type="primary" @click.native="editUpdate('editForm')"
          >更新</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Prototype",
  data() {
    return {
      type: "",
      typeList: [{"Type":"全部","Id":""}],
      tableData: [],
      total: 1000, //默认数据总数
      pageSize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      rules: {
        Name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        Type: [{ required: true, message: "请选择产品类型", trigger: "blur" }],
        GPYear: [
          { required: true, message: "请输入质保年限", trigger: "blur" },
        ],
        GPCount: [
          { required: true, message: "请输入质保次数", trigger: "blur" },
        ],
      },
      newForm: false,
      newData: {},
      editForm: false,
      editData: {},
    };
  },
  methods: {
    typeChanged(e) {
      var GPCount = "";
      this.typeList.map((item) => {
        if (e == item.Id) {
          GPCount = item.GPCount;
        }
      });
      if (this.newForm) {
        this.$set(this.newData, "GPCount", GPCount);
      }
      if (this.editForm) {
        this.$set(this.editData, "GPCount", GPCount);
      }
    },
    search() {
      this.currentPage = 1;
      this.init();
    },
    reset() {
      this.type = "";
      this.currentPage = 1;
      this.init();
    },
    add() {
      this.newForm = true;
    },
    newClose() {
      this.newForm = false;
      this.$refs["newForm"].clearValidate();
    },
    newCancel() {
      this.newForm = false;
      this.$refs["newForm"].clearValidate();
    },
    newUpdate() {
      var that = this;
      that.$refs["newForm"].validate((valid) => {
        if (valid) {
          that._api.PROTOTYPE.addTable({
            Name: that.newData.Name,
            Type: that.newData.Type,
            GPYear: that.newData.GPYear,
            GPCount: that.newData.GPCount,
          }).then((res) => {
            that.$notify({
              title: "提示",
              message: "添加成功",
              type: "success",
              duration: 2000,
            });
            that.newData = {};
            that.$refs["newForm"].clearValidate();
            that.newForm = false;
            that.currentPage = 1;
            that.init();
          }).catch((err)=>{
            that.$notify({
              title: "提示",
              message: err,
              type: "error",
              duration: 2000,
            });
          });
        } else {
          return false;
        }
      });
    },
    bj(index, row) {
      this.editData = Object.assign({}, row); // editForm是Dialog弹框的data
      this.editForm = true;
    },
    editClose() {
      this.editForm = false;
      this.$refs["editForm"].clearValidate();
    },
    editCancel() {
      this.editForm = false;
      this.$refs["editForm"].clearValidate();
    },
    editUpdate() {
      var that = this;
      that.$refs["editForm"].validate((valid) => {
        if (valid) {
          that._api.PROTOTYPE.editTable({
            Id:that.editData.ID,
            Name: that.editData.Name,
            Type: that.editData.Type,
            GPYear: that.editData.GPYear,
            GPCount: that.editData.GPCount,
          }).then((res) => {
            that.$notify({
              title: "提示",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
            that.editData = {};
            that.$refs["editForm"].clearValidate();
            that.editForm = false;
            that.currentPage = 1;
            that.init();
          }).catch((err)=>{
            that.$notify({
              title: "提示",
              message: err,
              type: "error",
              duration: 2000,
            });
          });
        } else {
          return false;
        }
      });
    },
    sc(index,row) {
      var that=this
      that.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that._api.PROTOTYPE.delTable({
          Id:row.ID
        }).then((res) => {
          that.$notify({
            title: "提示",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          that.init();
        }).catch((err)=>{
          that.$notify({
            title: "提示",
            message: err,
            type: "error",
            duration: 2000,
          });
        });
      }).catch(()=>{
        that.$notify({
          title: '提示',
          message: '已取消删除',
          type: 'info',
          duration: 2000
        })
      })
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.init();
    },
    getTypeList() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.PROTOTYPE.getTypeList()
          .then((res) => {
            that.typeList = [{"Type":"全部","Id":""}].concat(res);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getTable() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.PROTOTYPE.getTable({
          Type: that.type,
          PageNumber: that.currentPage,
        })
          .then((res) => {
            that.total = res.Count;
            that.tableData = res.List;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    init() {
      var that = this;
      Promise.all([that.getTypeList(), that.getTable()])
        .then((res) => {})
        .catch((err) => {});
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
</style>
