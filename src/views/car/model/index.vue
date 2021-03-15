<template>
  <div class="model-container" id="container">
    <div class="tableHead">
      <el-form :inline="true">
        <el-form-item label="品牌：">
          <el-select v-model="brand" filterable placeholder="--选择品牌--">
            <el-option
              v-for="(item, index) in brandList"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="品牌：">
          <el-select v-model="brand" filterable placeholder="--选择品牌--">
            <el-option
              v-for="(item, index) in brandList.slice(1)"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="型号：">
          <el-input v-model="model"></el-input>
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
        <el-table-column prop="Make" label="品牌"> </el-table-column>
        <el-table-column prop="Model" label="型号"> </el-table-column>
        
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
      title="添加型号"
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
        <el-form-item label="品牌：" prop="Brand">
          <el-select v-model="newData.Brand" filterable placeholder="--选择品牌--">
            <el-option
              v-for="(item, index) in brandList.slice(1)"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号：" prop="Model">
          <el-input v-model="newData.Model" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格等级：" prop="CarPrice">
          <el-select v-model="newData.CarPrice" filterable placeholder="--选择等级--">
            <el-option
              v-for="(item, index) in carPriceList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格：" prop="PartList">
        </el-form-item>
        <el-form-item class="ts" label-width="0" prop="PartList">
          <template>
            <div v-for="(item, index) in newData.PartList" :key="index" style="display:flex;width:50%;margin-bottom:22px">
                <label class="el-form-item__label" style="width: 250px">{{item.Name}}：</label>
                <el-input v-model.number="item.Price" auto-complete="off"></el-input>
            </div>
          </template>
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
      title="修改型号"
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
        <el-form-item label="品牌：" prop="Brand">
          <el-select v-model="editData.Brand" filterable placeholder="--选择品牌--">
            <el-option
              v-for="(item, index) in brandList.slice(1)"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号：" prop="Model">
          <el-input v-model="editData.Model" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格等级：" prop="CarPrice">
          <el-select v-model="editData.CarPrice" filterable placeholder="--选择等级--">
            <el-option
              v-for="(item, index) in carPriceList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格：" prop="PartList">
        </el-form-item>
        <el-form-item class="ts" label-width="0" prop="PartList">
          <template>
            <div v-for="(item, index) in editData.PartList" :key="index" style="display:flex;width:50%;margin-bottom:22px">
                <label class="el-form-item__label" style="width: 250px">{{item.Name}}：</label>
                <el-input v-model.number="item.Price" auto-complete="off"></el-input>
            </div>
          </template>
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
  name: 'Model',
  data() {
    return {
      brand:"",
      brandList:[{"Name":"全部","Id":""}],
      model:"",
      type: "",
      typeList: [{"Type":"全部","Id":""}],
      carPriceList:[1,2,3],
      partList: [
          { SortId: 1, Name: "整车", Price: "0" },
          { SortId: 5, Name: "前杠", Price: "0" },
          { SortId: 6, Name: "后杠", Price: "0" },
          { SortId: 7, Name: "机盖", Price: "0" },
          { SortId: 9, Name: "前叶子板", Price: "0" },
          { SortId: 10, Name: "后叶子板", Price: "0" },
          { SortId: 13, Name: "车门", Price: "0" },
          { SortId: 15, Name: "侧裙", Price: "0" },
          { SortId: 16, Name: "车顶", Price: "0" },
          { SortId: 17, Name: "后盖", Price: "0" },
        ],
      tableData: [],
      total: 1000, //默认数据总数
      pageSize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      rules: {
        Brand: [{ required: true, message: "请选择品牌", trigger: "blur" }],
        Model: [{ required: true, message: "请输入型号", trigger: "blur" }],
        CarPrice: [{ required: true, message: "请选择等级", trigger: "blur" }],
        PartList: [{ required: true, message: "请输入价格", trigger: "blur" }],
      },
      newForm: false,
      newData: {},
      editForm: false,
      editData: {},
    }
  },
  methods: {
    search() {
      this.currentPage = 1;
      this.init();
    },
    reset() {
      this.brand = "";
      this.model = "";
      this.currentPage = 1;
      this.init();
    },
    add() {
      if(!this.newData.PartList){
        this.newData.PartList=this.partList
      }
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
          var arr=[]
          that.newData.PartList.map((item)=>{
            arr.push({ SortId: item.SortId, Price: item.Price })
          })
          that._api.CAR.MODEL.addTable({
            Make: that.newData.Brand,
            Model: that.newData.Model,
            CarPrice: that.newData.CarPrice,
            PartPrice: JSON.stringify(arr),
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
      this.getDetails(row.ID).then((res)=>{
        this.editData = Object.assign({}, res)
        this.editForm = true;
      })
      // this.editData = Object.assign({}, row); // editForm是Dialog弹框的data
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
          var arr=[]
          that.editData.PartList.map((item)=>{
            arr.push({ SortId: item.SortId, Price: item.Price })
          })
          that._api.CAR.MODEL.editTable({
            Id:that.editData.ID,
            Make: that.editData.Brand,
            Model: that.editData.Model,
            CarPrice: that.editData.CarPrice,
            PartPrice: JSON.stringify(arr),
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
        that._api.CAR.MODEL.delTable({
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
    getDetails(id){
      var that=this
      return new Promise((resolve,reject)=>{
        that._api.CAR.MODEL.getDetails({
          Id:id
        }).then((res)=>{
          var array=[]
          res.PartList.map((item,index,arr)=>{
            if(that.partList[index]){
              array.push({'SortId':item.SortId,'Price':item.Price,'Name':that.partList[index].Name})
            }
          })
          res.PartList=array
          resolve(res)
        })
      })
    },
    getBrandList(){
      var that=this
      return new Promise((resolve,reject)=>{
        that._api.CAR.MODEL.getBrandList().then((res)=>{
          var arr=[{"Name":"全部","Id":""}]
          res.CbList.map((item)=>{
            arr.push({"Name":item.Brand,"Id":item.Brand})
          })
          that.brandList=arr
        })
      })
    },
    getTable(){
      var that=this
      return new Promise((resolve,reject)=>{
        that._api.CAR.MODEL.getTable({
          Make: that.brand,
          Model: that.model,
          PageNumber: that.currentPage,
        }).then((res)=>{
          that.total=res.Count
          that.tableData=res.List
        })
      })
    },
    init(){
      var that=this
      Promise.all([that.getBrandList(),that.getTable()])
    }
  },
  mounted() {
    this.init()
  },
}
</script>

<style scoped>
  .ts >>> .el-form-item__content{
    display: flex;
    flex-wrap: wrap;
  }
</style>
