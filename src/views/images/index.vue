<template>
  <div class="image-container" id="container">
    <div class="tableHead">
      <el-form :inline="true">
        <el-form-item label="产品类型：">
          <el-select v-model="type" filterable placeholder="--选择类型--">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汽车品牌：">
          <el-select v-model="brand" filterable placeholder="--选择品牌--" @change="brandChange">
            <el-option
              v-for="(item, index) in brandList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汽车型号：">
          <el-select v-model="model" filterable placeholder="--选择型号--">
            <el-option
              v-for="(item, index) in modelList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="status" filterable placeholder="--选择状态--">
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="title"></el-input>
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
        <el-table-column prop="Title" label="标题"></el-table-column>
        <el-table-column prop="Type" label="类型"></el-table-column>
        <el-table-column prop="Brand" label="品牌"></el-table-column>
        <el-table-column prop="Model" label="车型"></el-table-column>
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
      title="添加图片案例"
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
        <el-form-item label="产品类型：" prop="Type">
          <el-select
            v-model="newData.Type"
            filterable
            placeholder="--选择类型--"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案例标题：" prop="Title">
          <el-input v-model="newData.Title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="案例描述：">
          <el-input type="textarea" autosize v-model="newData.Description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="汽车品牌：" prop="Brand">
          <el-input v-model="newData.Brand" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="汽车型号：" prop="Model">
          <el-input v-model="newData.Model" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车身颜色：" prop="Color">
          <el-input v-model="newData.Color" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="imgList">
          <cosUpload :refs="refs" :imgList="newData.imgList" :multiple="multiple" :limit="limit"></cosUpload>
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
      title="修改图片案例"
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
        <el-form-item label="产品类型：" prop="Type">
          <el-select
            v-model="editData.Type"
            filterable
            placeholder="--选择类型--"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案例标题：" prop="Title">
          <el-input v-model="editData.Title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="案例描述：">
          <el-input type="textarea" autosize v-model="editData.Description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="汽车品牌：" prop="Brand">
          <el-input v-model="editData.Brand" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="汽车型号：" prop="Model">
          <el-input v-model="editData.Model" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车身颜色：" prop="Color">
          <el-input v-model="editData.Color" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="imgList">
          <cosUpload :refs="refs" :imgList="editData.imgList" :multiple="multiple" :limit="limit"></cosUpload>
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
import {deepClone} from '@/utils'
import cosUpload from '@/components/Upload'
export default {
  name: "Images",
  components:{
    cosUpload
  },
  data() {
    return {
      title:"",
      type: "",
      typeList: ['漆面膜','改色膜','窗膜'],
      brand: "",
      brandList: [{"name":"全部","id":""}],
      model: "",
      modelList: [{"name":"全部","id":""}],
      status: "",
      statusList:[{id:'',name:'全部'},{id:'0',name:'待审核'},{id:'1',name:'审核通过'},{id:'2',name:'审核退回'}],
      tableData: [],
      total: 1000, //默认数据总数
      pageSize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      rules: {
        Type: [{ required: true, message: "请选择产品类型", trigger: "blur" }],
        Title: [{ required: true, message: "请输入案例标题", trigger: "blur" }],
        Brand: [{ required: true, message: "请输入汽车品牌", trigger: "blur" }],
        Model: [{ required: true, message: "请输入汽车型号", trigger: "blur" }],
        Color: [{ required: true, message: "请输入颜色", trigger: "blur" }],
        imgList: [{ type:'array', required: true, message: "请选择图片", trigger: "blur" }],
      },
      newForm: false,
      newData: {},
      editForm: false,
      editData: {},

      refs:'upload',
      multiple:true,//是否批量添加
      limit:6,//限制文件数量
      oldList:[],//原图片
    };
  },
  methods: {
    brandChange(e){
      var that=this
      that.model=""
      that.getModelList(e)
    },
    search() {
      this.currentPage = 1;
      this.init();
    },
    reset() {
      this.title = "";
      this.type = "";
      this.brand = "";
      this.model = "";
      this.status = "";
      this.currentPage = 1;
      this.init();
    },
    add() {
      if(!this.newData.imgList){
        this.$set(this.newData,'imgList',[])
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
          that._api.IMAGES.addTable({
            type: that.newData.Type,
            brand: that.newData.Brand,
            model: that.newData.Model,
            title: that.newData.Title,
            des: that.newData.Description ? that.newData.Description : "",
            color: that.newData.Color,
            cover: that.newData.imgList[0].name,
            userid: '',
          })
          .then((res) => {
            that._cos.addFiles('imgCase',that.newData.imgList,res).then(()=>{
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
            })
          })
          .catch((err) => {
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
      var that=this
      that._cos.getFiles('imgCase',row.Id).then((res)=>{
        that.oldList = deepClone(res)
        that.editData = Object.assign({'imgList':deepClone(res)}, row)
        that.editForm = true;
      })
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
          that._api.IMAGES.editTable({
            id: that.editData.Id,
            type: that.editData.Type,
            brand: that.editData.Brand,
            model: that.editData.Model,
            color: that.editData.Color,
            title: that.editData.Title,
            des: that.editData.Description,
            cover: that.editData.imgList[0].name,
            userid: that.editData.UserId,
          })
            .then((res) => {
              var newName=[],oldName=[]
              that.editData.imgList.map((item)=>{
                newName.push(item.name)
              })
              that.oldList.map((item)=>{
                oldName.push(item.name)
              })
              var addImg=[],delImg=[]
              addImg = newName.filter(function(v){ return oldName.indexOf(v) === -1 })
              delImg = oldName.filter(function(v){ return newName.indexOf(v) === -1 })
              var addArr=[]
              that.editData.imgList.map((item)=>{
                if(addImg.indexOf(item.name)!=-1){
                  addArr.push(item)
                }
              })
              Promise.all([that._cos.addFiles('imgCase',addArr,that.editData.Id),that._cos.delFiles('imgCase',delImg,that.editData.Id)]).then(()=>{
                that.$notify({
                  title: "提示",
                  message: "修改成功",
                  type: "success",
                  duration: 2000,
                });
                that.editData = {};
                that.$refs["editForm"].clearValidate();
                that.editForm = false;
                that.init();
              })
            })
            .catch((err) => {
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
    sc(index, row) {
      var that = this;
      that.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        that._api.IMAGES.delTable({
          id:row.Id,
          userid:row.UserId
        }).then((res) => {
          that.$notify({
            title: "提示",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          that.init();
        }).catch((err) => {
            that.$notify({
              title: "提示",
              message: err,
              type: "error",
              duration: 2000,
            });
          });
      }).catch(() => {
        that.$notify({
          title: "提示",
          message: "已取消删除",
          type: "info",
          duration: 2000,
        });
      });
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.init();
    },
    getBrandList() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.IMAGES.getBrandList()
          .then((res) => {
            var arr=[{"name":"全部","id":""}]
            res.map((item)=>{
              arr.push({"name":item,"id":item})
            })
            that.brandList = arr;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getModelList(brand) {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.IMAGES.getModelList({
          brand:brand
        }).then((res) => {
          var arr=[{"name":"全部","id":""}]
          res.map((item)=>{
            arr.push({"name":item,"id":item})
          })
          that.modelList = arr;
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    },
    getTable() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.IMAGES.getTable({
          title: that.title,
          type: that.type,
          brand: that.brand,
          model: that.model,
          CarNumber: "",
          VIN: "",
          status: that.status,
          prestatus: 1,
          partnerid: "",
          userid: "",
          pageNumber: that.currentPage,
        })
          .then((res) => {
            that.total = res.Count;
            that.tableData = res.ImgCaseList;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    init() {
      var that = this;
      Promise.all([that.getBrandList(), that.getTable()])
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
