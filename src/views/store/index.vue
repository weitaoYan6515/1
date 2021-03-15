<template>
  <div class="store-container" id="container">
    <div class="tableHead">
      <el-form :inline="true">
        <el-form-item label="省份">
          <el-select v-model="province" placeholder="--选择省份--" @change="provinceChanged">
            <el-option
              v-for="(item,index) in provinceList"
              :key="index"
              :lable="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：">
          <el-select v-model="city" placeholder="--选择城市--" @change="cityChanged">
            <el-option
              v-for="(item,index) in cityList"
              :key="index"
              :lable="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域：">
          <el-select v-model="county" placeholder="--选择区域--">
            <el-option
              v-for="(item,index) in countyList"
              :key="index"
              :lable="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商：">
          <el-select v-model="partnerId" filterable placeholder="--选择运营商--">
            <el-option
              v-for="(item, index) in partnerLists"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="status" placeholder="--选择状态--">
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：">
          <el-input v-model="store"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="primary" @click="download">打印</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBody">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="PartnerName" label="运营商名称"></el-table-column>
        <el-table-column prop="Name" label="门店名称"></el-table-column>
        <el-table-column prop="Account" label="门店账号"></el-table-column>
          <el-table-column prop="ContactName" label="联系人"></el-table-column>
          <el-table-column prop="Contact" label="联系电话"></el-table-column>
          <el-table-column label="区域" show-overflow-tooltip>
            <template
              slot-scope="scope"
            >{{scope.row.Province==scope.row.City?'':scope.row.Province+'-'}}{{scope.row.City}}-{{scope.row.County}}</template>
          </el-table-column>
          <el-table-column prop="Address" show-overflow-tooltip label="地址"></el-table-column>
        <el-table-column width="280" prop="" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click="bj(scope.$index, scope.row)" size="small"
              >编辑</el-button
            >
            <el-button @click="sc(scope.$index, scope.row)" size="small"
              >删除</el-button
            >
            <el-button @click="cz(scope.$index, scope.row)" size="small" v-if="scope.row.Status == 0"
              >通过</el-button
            >
            <el-button @click="th(scope.$index, scope.row)" size="small" v-if="scope.row.Status != 2"
              >退回</el-button
            >
            <!-- <el-button @click="cz(scope.$index, scope.row)" size="small"
              >重置密码</el-button
            > -->
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
      title="添加门店"
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
        <el-form-item label="区域：" prop="selectedOptions">
          <el-cascader size="large" :options="countyOptions" v-model="newData.selectedOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="Address">
          <el-input v-model.trim="newData.Address"></el-input>
        </el-form-item>

        <el-form-item label="归属运营商：" prop="Account">
          <el-select v-model="newData.PartnerId" filterable placeholder="--选择运营商--">
            <el-option
              v-for="(item, index) in partnerList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：" prop="Name">
          <el-input v-model.trim="newData.Name"></el-input>
        </el-form-item>
        <el-form-item label="门店账号：" prop="Account">
          <el-input v-model.trim="newData.Account"></el-input>
          <span>初始密码：111111</span>
        </el-form-item>
        <el-form-item label="联系人：" prop="ContactName">
          <el-input v-model.trim="newData.ContactName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="ContactNumber">
          <el-input type="number" :maxlength='11' oninput="if(value.length>11)value=value.slice(0,11)"  v-model.trim="newData.ContactNumber"></el-input>
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
      title="修改门店"
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
        <el-form-item label="区域：" prop="selectedOptions">
          <el-cascader size="large" :options="countyOptions" v-model="editData.selectedOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="Address">
          <el-input v-model.trim="editData.Address"></el-input>
        </el-form-item>
        <el-form-item label="归属运营商：" prop="Account">
          <el-select v-model="editData.PartnerId" filterable placeholder="--选择运营商--">
            <el-option
              v-for="(item, index) in partnerList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：" prop="Name">
          <el-input v-model.trim="editData.Name"></el-input>
        </el-form-item>
        <el-form-item label="门店账号：" prop="Account">
          <el-input v-model.trim="editData.Account"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="ContactName">
          <el-input v-model.trim="editData.ContactName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="Contact">
          <el-input  type="number" :maxlength='11' oninput="if(value.length>11)value=value.slice(0,11)" v-model.trim="editData.Contact"></el-input>
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

import { regionData, CodeToText, TextToCode } from "element-china-area-data";
export default {
  name: 'Store',
  data() {
    return {
      province: "",
      provinceList: "",
      city: "",
      cityList: "",
      county: "",
      countyList: "",
      status:"",
      statusList:[{id:'',name:'全部'},{id:'0',name:'待审核'},{id:'1',name:'审核通过'},{id:'2',name:'审核退回'}],
      store:'',
      partnerId:'',
      partnerList: [],
      partnerLists: [],
      countyOptions:regionData,
      tableData: [],
      total: 1000, //默认数据总数
      pageSize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      rules: {
        selectedOptions: [
          { required: true, message: "请选择地区", trigger: "blur" }
        ],
        Address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        PartnerId: [{ required: true, message: "请选择运营商", trigger: "blur" }],
        Account: [
          { required: true, message: "请输入门店账号", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "请输入门店名称", trigger: "blur" }
        ],
        ContactName: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        ContactNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ]
      },
      newForm: false,
      newData: {},
      editForm: false,
      editData: {},
    };
  },
  methods: {
    provinceChanged(e) {
      var that=this;
      that.province=e;
      that.city='';
      that.county='';
      that.getCityList().then((res)=>{
        that.cityList=res
      })
    },
    cityChanged(e) {
      var that=this;
      that.city=e;
      that.county='';
      that.getCountyList().then((res)=>{
        that.countyList=res
      })
    },
    search() {
      this.currentPage = 1;
      this.init();
    },
    reset() {
      this.province = "";
      this.city = "";
      this.county = "";
      this.partnerId="";
      this.status="";
      this.store="";
      this.currentPage = 1;
      this.init();
    },
    download: function () {
      var that = this;
      that._api.STORE
        .getDownloadTable({
          PartnerId: that.partnerId,
          Prov: that.province,
          City: that.city,
          County: that.county,
          Type: "",
          Name: that.store,
          Status: that.status,
        })
        .then(function (res) {
          res.map(function (item) {
            item.Qy = item.Province + item.City + item.County;
            if (item.Status == 0) {
              item.Statuss = "等待审核";
            }
            if (item.Status == 1) {
              item.Statuss = "审核通过";
            }
            if (item.Status == 2) {
              item.Statuss = "审核退回";
            }
            if (item.Type == 1) {
              item.Type = "至尊店";
            }
            if (item.Type == 0) {
              item.Type = "";
            }
          });
          // return
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/vendor/Export2Excel.js");
            const tHeader = [
              "运营商名称",
              "门店名称",
              "门店账号",
              "联系人",
              "联系方式",
              "区域",
              "地址",
              "审核状态",
            ];
            const filterVal = [
              "PartnerName",
              "Name",
              "Account",
              "ContactName",
              "Contact",
              "Qy",
              "Address",
              "Statuss",
            ];
            const data = that.formatJson(filterVal, res);
            export_json_to_excel(tHeader, data, "门店");
          });
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
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
          var Province,City,County
          if(CodeToText[that.newData.selectedOptions[0]]){
              Province=CodeToText[that.newData.selectedOptions[0]]
          }else{
              Province=''
          }
          if(CodeToText[that.newData.selectedOptions[1]]){
              City=CodeToText[that.newData.selectedOptions[1]]=="市辖区"?CodeToText[that.newData.selectedOptions[0]]:CodeToText[that.newData.selectedOptions[1]]
          }else{
              City=''
          }
          if(CodeToText[that.newData.selectedOptions[2]]){
              County=CodeToText[that.newData.selectedOptions[2]]
          }else{
              County=''
          }
          that._api.STORE.addTable({
            Prov: Province,
            City:City,
            County:County,
            Type:'1',
            Address: that.newData.Address,
            Account: that.newData.Account,
            PartnerId: that.newData.PartnerId,
            Name: that.newData.Name,
            ContactName: that.newData.ContactName,
            ContactNumber: that.newData.ContactNumber,
            Logo:''
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
      var selectedOptions=[]
      try {
          selectedOptions[0]=TextToCode[row.Province].code
          if(row.City!=''){
              selectedOptions[1]=TextToCode[row.Province][row.City==row.Province?'市辖区':row.City].code
          }else{
              selectedOptions[1]=''
          }
          if(row.County!=''){
              selectedOptions[2]=TextToCode[row.Province][row.City==row.Province?'市辖区':row.City][row.County].code
          }else{
              selectedOptions[2]=''
          }
      }
      catch (e) {
          selectedOptions=[]
      }
      var arr=[]
      selectedOptions.map((item,index)=>{
          if(item!=''){
              arr.push(item)
          }
      })
        
      this.editData = Object.assign({selectedOptions: arr}, row); // editForm是Dialog弹框的data
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
          var Province,City,County
          if(CodeToText[that.editData.selectedOptions[0]]){
              Province=CodeToText[that.editData.selectedOptions[0]]
          }else{
              Province=''
          }
          if(CodeToText[that.editData.selectedOptions[1]]){
              City=CodeToText[that.editData.selectedOptions[1]]=="市辖区"?CodeToText[that.editData.selectedOptions[0]]:CodeToText[that.editData.selectedOptions[1]]
          }else{
              City=''
          }
          if(CodeToText[that.editData.selectedOptions[2]]){
              County=CodeToText[that.editData.selectedOptions[2]]
          }else{
              County=''
          }
          that._api.STORE.editTable({
            StoreId: that.editData.ID,
            Prov: Province,
            City: City,
            County:County,
            Address: that.editData.Address,
            Type:that.editData.Type,
            PartnerId: that.editData.PartnerId,
            Account: that.editData.Account,
            Name: that.editData.Name,
            ContactName: that.editData.ContactName,
            ContactNumber: that.editData.Contact,
            Logo:''
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
        that._api.STORE.delTable({
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
    cz: function(index, row) {
      var that = this;
      this.$confirm("此操作将重置该运营商密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
         that._api.STORE.resetTable({
            UserId: row.ID
          }).then(function(res) {
            if(res.Code==0){
              that.$notify({
                title: "提示",
                message: "重置成功",
                type: "success",
                duration: 2000,
              });
            }else{
              that.$notify({
                title: '提示',
                message: res.Result,
                type: 'info',
                duration: 2000
              })
            }
            that.init();
          })
          .catch(function(err) {
            that.$notify({
              title: "提示",
              message: err,
              type: "error",
              duration: 2000,
            });
          });
      })
      .catch(() => {
        that.$message({
          type: "info",
          message: "已取消重置"
        });
      });
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.init();
    },
    getPartnerList() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.STORE.getPartnerList({
          Province: ""
        })
          .then((res) => {
            var arrs=[{'name':'全部',id:''}],arr=[]
            for (const key in res) {
              if (Object.hasOwnProperty.call(res, key)) {
                const element = res[key];
                arrs.push({'name':element,id:key})
                arr.push({'name':element,id:key})
              }
            }
            that.partnerLists = arrs;
            that.partnerList = arr;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getProvinceList() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.STORE.getProvinceList({
          Type: ""
        })
          .then((res) => {
            that.provinceList = res;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getCityList() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.STORE.getCityList({
          Province:that.province
        })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getCountyList() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.STORE.getCountyList({
          Province:that.province,
          City:that.city
        })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getTable() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.STORE.getTable({
          PartnerId: that.partnerId,
          Prov: that.province,
          City: that.city,
          County: that.county,
          Name: that.store,
          Type: "",
          Status: that.status,
          PageNumber: that.currentPage,
        })
          .then((res) => {
            that.total = res.Count;
            that.tableData = res.StoreUsers;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    init() {
      var that = this;
      Promise.all([that.getPartnerList(),that.getProvinceList(), that.getTable()])
        .then((res) => {})
        .catch((err) => {});
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style lang="scss" scoped>

</style>
