<template>
  <div class="customer-container" id="container">
    <div class="tableHead">
      <el-form :inline="true">
        <el-form-item label="质保时间">
          <el-date-picker
            v-model="time"
            type="daterange"
            @change="timeChange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="客户联系方式：">
          <el-input v-model="customerContact"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：">
          <el-input v-model="carNumber"></el-input>
        </el-form-item>
        <el-form-item label="车架号：">
          <el-input v-model="vin"></el-input>
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
        <el-form-item label="产品类型：">
          <el-select v-model="type" placeholder="--选择产品类型--">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="download">打印</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBody">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="CustomerName" label="客户姓名"> </el-table-column>
        <el-table-column prop="CarModel" label="车型"> </el-table-column>
        <el-table-column prop="PartnerName" label="运营商"></el-table-column>
        <el-table-column
          prop="ProductType"
          label="产品类型"
        ></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{
            scope.row.Status == 0
              ? "等待审核"
              : scope.row.Status == 1
              ? "审核通过"
              : "审核退回"
          }}</template>
        </el-table-column>
        <el-table-column label="上传时间">
          <template slot-scope="scope">{{
            scope.row.CreateTime.slice(0, 10)
          }}</template>
        </el-table-column>
        <el-table-column width="300" prop="" label="操作">
          <template slot-scope="scope">
            <el-button @click="bj(scope.$index, scope.row)" size="small">编辑</el-button>
            <el-button @click="sc(scope.$index, scope.row)" size="small">删除</el-button>
            <el-button @click="sh(scope.$index, scope.row)" size="small" v-if="scope.row.Status == 0">审核</el-button>
            <el-button @click="th(scope.$index, scope.row)" size="small" v-if="scope.row.Status != 2">退回</el-button>
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
      title="修改质保客户"
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
        <el-form-item label="客户姓名：" prop="CustomerName">
          <el-input
            v-model="editData.CustomerName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户号码：" prop="CustomerContact">
          <el-input
            v-model="editData.CustomerContact"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="车型：" prop="CarModel">
          <el-input v-model="editData.CarModel" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：" prop="CarNumber">
          <el-input v-model="editData.CarNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车架号：" prop="VIN">
          <el-input v-model="editData.VIN" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车身颜色：" prop="CarColor">
          <el-input v-model="editData.CarColor" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="施工店：" prop="StoreName">
          <el-input v-model="editData.StoreName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="门店号码：" prop="StoreContact">
          <el-input
            v-model="editData.StoreContact"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="施工时间：" prop="SaleTime">
          <el-input v-model="editData.SaleTime" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格：" prop="Price">
          <el-input v-model="editData.Price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="editData.Remarks" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型：">
          <el-input
            v-model="editData.ProductType"
            auto-complete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="部位："
          v-for="(item, index) in editData.SalePart"
          :key="index"
        >
          <el-input v-model="item.Part" auto-complete="off" disabled></el-input>
          <el-form-item class="ts" style="margin-top: 22px">
            <label class="el-form-item__label" style="width: 250px"
              >产品名称：</label
            >
            <el-input
              v-model="item.Name"
              auto-complete="off"
              disabled
            ></el-input>
            <label class="el-form-item__label" style="width: 200px"
              >膜卷号：</label
            >
            <el-input
              v-model="item.Number"
              auto-complete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="产品图片：">
          <template>
            <el-carousel
              indicator-position="outside"
              :autoplay="false"
              v-loading="imgLoading"
            >
              <el-carousel-item v-for="(item, index) in arrImg" :key="index">
                <img :src="item" alt preview="index" />
                <!-- <div :style="{backgroundImage: 'url('+item+')' ,backgroundPosition:'center',backgroundRepeat:'no-repeat',backgroundSize: 'contain', width: '100%', height: '100%'}"></div> -->
              </el-carousel-item>
            </el-carousel>
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
    <el-dialog
      title="退回"
      :visible.sync="thForm"
      :close-on-click-modal="true"
      class="edit-form"
      :before-close="thClose"
    >
      <el-form
        :model="thData"
        label-width="120px"
        ref="thForm"
        :rules="rules"
      >
        <el-form-item label="退回原因：" prop="yy">
          <el-input type="textarea" :rows="2" v-model="thData.yy"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="thCancel('thForm')">取消</el-button>
        <el-button type="primary" @click.native="thUpdate('thForm')"
          >退回</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Customer',
  data() {
    return {
      time:'',
      startTime:'',
      endTime:'',
      customerContact:'',
      carNumber:'',
      vin:'',
      status:'',
      statusList:[{id:'',name:'全部'},{id:'0',name:'待审核'},{id:'1',name:'审核通过'},{id:'2',name:'审核退回'}],
      type: '',
      typeList: ["漆面膜",'改色膜', "窗膜"],
      tableData: [],
      total: 1000, //默认数据总数
      pageSize: 10, //每页的数据条数
      currentPage: 1, //默认开始页面
      rules: {
        CustomerName: [
          { required: true, message: "请输入客户姓名", trigger: "blur" },
        ],
        CustomerContact: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^1[0-9]{10}$/,
            message: "手机号格式不对",
            trigger: "blur",
          },
        ],
        CarModel: [{ required: true, message: "请输入车型", trigger: "blur" }],
        CarNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
        VIN: [{ required: true, message: "请输入车架号", trigger: "blur" }],
        CarColor: [
          { required: true, message: "请输入车身颜色", trigger: "blur" },
        ],
        StoreName: [
          { required: true, message: "请输入施工门店", trigger: "blur" },
        ],
        StoreContact: [
          { required: true, message: "请输入门店号码", trigger: "blur" },
        ],
        SaleTime: [
          { required: true, message: "请输入施工时间", trigger: "blur" },
        ],
        Price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        yy: [{ required: true, message: "请输入退回原因", trigger: "blur" }],
      },
      editForm: false,
      editData: {},
      thForm: false,
      thData: {},
      arrImg: [],
      imgLoading: true,
    };
  },
  methods: {
    timeChange(e) {
      if (e == null) {
        this.startTime = "";
        this.endTime = "";
        return;
      }
      if (this.time == "") {
        this.startTime = this.firstDateTime(new Date());
        this.endTime = this.lastDateTime(new Date());
      } else {
        this.startTime = this.firstDateTime(this.time[0]);
        this.endTime = this.lastDateTime(this.time[1]);
      }
    },
    firstDateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;

      return y + "-" + m + "-" + d + " " + "00" + ":" + "00" + ":" + "00";
    },
    lastDateTime(inputTime) {
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;

      return y + "-" + m + "-" + d + " " + "23" + ":" + "59" + ":" + "59";
    },
    search() {
      this.currentPage = 1;
      this.getTable();
    },
    reset() {
      this.time = "";
      this.customerContact = "";
      this.carNumber = "";
      this.vin = "";
      this.status = "";
      this.type = "";
      this.currentPage = 1;
      this.init();
    },
    download: function () {
      var that = this;
      that._api.CUSTOMER
        .getDownloadTable({
          CustomerContact: that.customerContact,
          CarNumber: that.carNumber,
          VIN: that.vin,
          Type: that.type,
          Status: that.status,
          PreStatus: 1,
          PartnerId: "",
          StoreId: "",
          StartTime: that.startTime,
          EndTime: that.endTime,
        })
        .then(function (res) {
          res.map(function (item) {
            if (item.PreStatus == 0) {
              item.PreStatus = "等待初审";
            }
            if (item.PreStatus == 1) {
              item.PreStatus = "初审通过";
            }
            if (item.PreStatus == 2) {
              item.PreStatus = "初审退回";
            }
            if (item.Status == 0) {
              item.Status = "等待初审";
            }
            if (item.Status == 1) {
              item.Status = "初审通过";
            }
            if (item.Status == 2) {
              item.Status = "初审退回";
            }
            item.SaleTime = item.SaleTime.slice(0, 10);
            item.CreateTime = item.CreateTime.slice(0, 10);
            var SalePart = "";
            JSON.parse(item.SalePart).map(function (a, b, arr) {
              if (b < arr.length - 1) {
                SalePart =
                  SalePart + a.Part + "," + a.Name + "," + a.Number + ";";
              } else {
                SalePart = SalePart + a.Part + "," + a.Name + "," + a.Number;
              }
            });
            /* var SalePart=JSON.parse(item.SalePart)[0].Part+","+JSON.parse(item.SalePart)[0].Name+","+JSON.parse(item.SalePart)[0].Number
                    if(JSON.parse(item.SalePart).length>1){
                        SalePart=SalePart+';'+JSON.parse(item.SalePart)[1].Part+","+JSON.parse(item.SalePart)[1].Name+","+JSON.parse(item.SalePart)[0].Number
                    }*/
            item.SalePart = SalePart;
          });
          require.ensure([], () => {
            const {
              export_json_to_excel,
            } = require("@/vendor/Export2Excel.js");
            /* const tHeader = ['客户名称', '客户号码','车型','施工店','施工时间','产品类型','施工部位']
                    const filterVal = ['CustomerName', 'CustomerContact','CarModel','StoreName','SaleTime','ProductType','SalePart'] */
            const tHeader = [
              "运营商",
              "客户姓名",
              "客户电话",
              "质保编号",
              "产品类型",
              "施工部位、名称及膜卷号",
              "车型",
              "车牌号",
              "车架号",
              "车身颜色",
              "价格",
              "门店名称",
              "门店电话",
              "施工时间",
              "初审状态",
              "终审状态",
              "上传门店",
              "上传时间",
              "备注",
            ];
            const filterVal = [
              "PartnerName",
              "CustomerName",
              "CustomerContact",
              "ProductNumber",
              "ProductType",
              "SalePart",
              "CarModel",
              "CarNumber",
              "VIN",
              "CarColor",
              "Price",
              "StoreName",
              "StoreContact",
              "SaleTime",
              "PreStatus",
              "Status",
              "UserStoreName",
              "CreateTime",
              "Remarks",
            ];
            const data = _this.formatJson(filterVal, res);
            export_json_to_excel(tHeader, data, "质保客户");
          });
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    bj(index, row) {
      var that=this
      that._cos.getFiles('gpCase',row.FolderID).then((res)=>{
        var arr=[]
        res.map((item)=>{
          arr.push(item.url)
        })
        that.arrImg=arr
        that.imgLoading = false;
      })
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
          that._api.CUSTOMER.editTable({
            ID: that.editForm.ID,
            CustomerName: that.editForm.CustomerName,
            CustomerContact: that.editForm.CustomerContact,
            CarModel: that.editForm.CarModel,
            CarNumber: that.editForm.CarNumber,
            VIN: that.editForm.VIN,
            CarColor: that.editForm.CarColor,
            StoreName: that.editForm.StoreName,
            StoreContact: that.editForm.StoreContact,
            SaleTime: that.editForm.SaleTime,
            Price: that.editForm.Price,
            Remarks: that.editForm.Remarks,
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
            // that.currentPage = 1;
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
        that._api.CUSTOMER.delTable({
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
    sh: function (index, row) {
      // console.log(row.Status)
      var that = this;
      this.$confirm("此操作将通过审核, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that._api.CUSTOMER
            .passTable({
              Id: row.ID,
            })
            .then(function (res) {
              // _this.currentPage=1
              that.$notify({
                title: "提示",
                message: "审核成功",
                type: "success",
                duration: 2000,
              });
              that.init();
            })
            .catch(function (err) {
              // _this.currentPage=1
              that.$notify({
                title: "提示",
                message: err,
                type: "error",
                duration: 2000,
              });
              that.init();
            });
        })
        .catch(() => {
          that.$notify({
            title: '提示',
            message: '已取消审核',
            type: 'info',
            duration: 2000
          })
        });
    },
    th: function (index, row) {
      this.thForm = true;
      this.thData = Object.assign({}, row); // editForm是Dialog弹框的data
    },
    thClose: function (formName) {
      this.thForm = false;
      this.$refs["thForm"].clearValidate();
    },
    thCancel: function (formName) {
      this.thForm = false;
      this.$refs["thForm"].clearValidate();
    },
    thUpdate: function (formName) {
      var that = this;
      // console.log(_this.thyyData)
      this.$refs["thForm"].validate((valid) => {
        if (valid) {
          that._api.CUSTOMER
            .refuseTable({
              Id: that.thData.ID,
            })
            .then(function (res) {
              // _this.currentPage=1
              Refuse.set({
                Module: 1,
                Type: 1,
                CaseId: that.thData.ID,
                Info: that.thData.yy,
              }).then(function (res) {
                that.$notify({
                  title: "提示",
                  message: "审核退回",
                  type: "success",
                  duration: 2000,
                });
                that.thForm = false;
                that.init();
              });
            })
            .catch(function (err) {
              // _this.currentPage=1
              that.$notify({
                title: "提示",
                message: err,
                type: "error",
                duration: 2000,
              });
              that.init();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.init();
    },
    
    getTable() {
      var that = this;
      return new Promise((resolve, reject) => {
        that._api.CUSTOMER.getTable({
          CustomerContact: that.customerContact,
          CarNumber: that.carNumber,
          VIN: that.vin,
          Type: that.type,
          Status: that.status,
          PreStatus: 1,
          PartnerId: "",
          StoreId: "",
          PageNumber: that.currentPage,
          StartTime: that.startTime,
          EndTime: that.endTime,
        })
          .then((res) => {
            var arr = [];
            // console.log(res.data)
            res.List.map(function (item) {
              item.SalePart = JSON.parse(item.SalePart);
              item.SaleTime = item.SaleTime.slice(0, 10);
              arr.push(item);
            });
            that.total = res.Count;
            that.tableData = arr;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    init() {
      var that = this;
     that.getTable()
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style scoped>
  img{
    width: 100%;
  }
  .ts >>> .el-form-item__content{
    display: flex;
  }
</style>
