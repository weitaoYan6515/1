<template>
  <div class="brand-container" id="container">
    <div class="tableHead">
      <el-form :inline="true">
        <el-form-item label="品牌：">
          <el-input v-model="brand"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="add">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBody">
      <el-table :data="list" :key="random" style="width: 100%" ref="table">
        <el-table-column
          label="LOGO"
        >
          <template slot-scope="scope">
            <img :src="url+'Site/QueryImg?FileName='+scope.row.LogoImg+'&FileType=APP&t='+new Date().getTime()" style="width:80px;height: 80px" :preview="scope.row.Id" />
          </template>
        </el-table-column>
        <el-table-column
          prop="Brand"
          label="品牌"
        />
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
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-count="Math.ceil(total/pageSize)"
        :hide-on-single-page="true"
      ></el-pagination>
    </div>
    <el-dialog
      title="添加汽车品牌"
      :visible.sync="newForm"
      :close-on-click-modal="true"
      class="edit-form"
      :before-close="newClose"
    >
      <el-form
        :model="newData"
        label-width="140px"
        ref="newForm"
        :rules="rules"
      >
        <el-form-item label="品牌名称：" prop="Brand">
          <el-input v-model="newData.Brand" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="首字母（A~Z）：" prop="Initial">
          <el-input v-model="newData.Initial" auto-complete="off" @input="toUp"></el-input>
        </el-form-item>
        <el-form-item label="LOGO：" required>
          <cosUpload :refs="refs" :imgList="newData.imgList" :multiple="multiple" :limit="limit" :file-size="fileSize" :file-type="fileType" :isCropper="isCropper" :autoCropWidth="autoCropWidth" :autoCropHeight="autoCropHeight" :fixedBox="fixedBox" :fixed="fixed" ></cosUpload>
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
        label-width="140px"
        ref="editForm"
        :rules="rules"
      >
        <!-- <el-form-item label="产品类型：" prop="Type">
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
        </el-form-item> -->
        <el-form-item label="品牌名称：" prop="Brand">
          <el-input v-model="editData.Brand" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="首字母（A~Z）：" prop="Initial">
          <el-input v-model="editData.Initial" auto-complete="off" @input="toUp"></el-input>
        </el-form-item>
        <el-form-item label="LOGO：" required>
          <cosUpload :refs="refs" :imgList="editData.imgList" :multiple="multiple" :limit="limit" :file-size="fileSize" :file-type="fileType" :isCropper="isCropper" :autoCropWidth="autoCropWidth" :autoCropHeight="autoCropHeight" :fixedBox="fixedBox" :fixed="fixed" ></cosUpload>
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
  name: 'Brand',
  components:{
    cosUpload
  },
  data() {
    return {
      random:"",
      url:"",
      brand:"",
      tableDatas: [],
      tableData: [],
      total: 1000, //默认数据总数
      pageSize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      rules: {
        Brand: [{ required: true, message: "请输入汽车品牌", trigger: "blur" }],
        Initial: [
          { required: true, message: "请输入首字母", trigger: "blur" },
          { max: 1, message: '请输入最多1个字符', trigger: 'blur' },
          { pattern: /^[A-Z]/, message: '请输入字母' }
        ],
        imgList: [{ type:'array', required: true, message: "请选择图片", trigger: "blur" }],
      },
      newForm: false,
      newData: {},
      editForm: false,
      editData: {},

      refs:'upload',
      multiple:false,//是否批量添加
      limit:1,//限制文件数量
      fileSize:2,//限制文件大小
      fileType:["jpeg", "jpg", "png"],//支持格式
      isCropper:true, //是否裁切 需要multiple为false
      autoCropWidth:100,//裁切宽度
      autoCropHeight:100,//裁切高度
      fixedBox:true,//裁切框不可改变
      fixed:false,//是否按比例裁切
      oldList:[],//原图片
    };
  },
  computed: {
    list:function(){
      return this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
    }
  },
  methods: {
    toUp(){
      if(this.newForm){
        this.$set(this.newData,'Initial',this.newData.Initial.toUpperCase())
      }
      if(this.editForm){
        this.$set(this.editData,'Initial',this.editData.Initial.toUpperCase())
      }
    },
    search() {
      var that=this
      that.currentPage = 1;
      var arr=[]
      that.tableDatas.map((item)=>{
        if(eval("/"+this.brand+"/ig").test(item.Brand)){
          arr.push(item)
        }
      })
      that.total = arr.length;
      that.tableData=arr
    },
    reset() {
      this.brand='';
      this.currentPage=1;
      this.init()
      this.tableData=deepClone(this.tableDatas)
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
          let formData = new FormData();
          formData.append("file", that.newData.imgList[0].raw);
          formData.append("logoimg", that.newData.imgList[0].name);
          formData.append("brand", that.newData.Brand);
          formData.append("initial", that.newData.Initial);
          that._api.CAR.BRAND.addTable(formData)
          .then((res) => {
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
      this.editData = Object.assign({"imgList":[{"name":row.Img,"url":this.url+'Site/QueryImg?FileName='+row.LogoImg+'&FileType=APP'}]}, row)
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
          let formData = new FormData();
          formData.append("id", that.editData.Id);
          formData.append("file", that.editData.imgList[0].raw);
          formData.append("logoimg", that.editData.LogoImg);
          formData.append("brand", that.editData.Brand);
          formData.append("initial", that.editData.Initial);
          that._api.CAR.BRAND.editTable(formData)
            .then((res) => {
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
        that._api.CAR.BRAND.delTable({
          Id: row.Id
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
      // this.init();
    },
    getTable() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.CAR.BRAND.getTable()
          .then((res) => {
            that.total = res.CbList.length;
            that.tableDatas = res.CbList;
            that.tableData = res.CbList;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    init() {
      var that = this;
      that.random=new Date().getTime()
      that.url=that._api.url
      that.getTable().then((res) => {}).catch((err) => {});
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style lang="scss" scoped>

</style>
