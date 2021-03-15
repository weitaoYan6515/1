<template>
  <div class="product-container" id="container">
    <div class="tableHead">
      <el-form :inline="true">
        <el-form-item label="运营商省份：">
          <el-select
            v-model="Province"
            placeholder="--选择运营商省份--"
            @change="provinceChanged"
          >
            <el-option
              v-for="(item, index) in ProvinceList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商：">
          <el-select
            v-model="Agency"
            placeholder="--选择运营商--"
            @change="agencyChanged"
          >
            <el-option
              v-for="(item, index) in AgencyList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称：">
          <el-select v-model="StoreId" filterable placeholder="--选择门店--">
            <el-option
              v-for="item in StoreList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="膜卷号：">
          <el-input v-model="BatchNumber"></el-input>
        </el-form-item>
        <el-form-item label="产品名称：">
          <el-input v-model="ProductName"></el-input>
        </el-form-item>
        <el-form-item label="产品类型：">
          <el-select v-model="Type" placeholder="--选择产品类型--">
            <el-option
              v-for="(item, index) in TypeList"
              :key="index"
              :label="item.Type"
              :value="item.Type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="primary" @click="add">添加</el-button>
          <el-button type="primary" @click="download">打印</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="Excel：">
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            :on-change="handleChange"
            :on-remove="handleRemove"
            :limit="limitUpload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">
              只 能 上 传 xlsx / xls 文 件
            </div>
          </el-upload>
          <!-- <el-input v-model="file" type="file" id="upload" @change="importfxx()"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ></el-input> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="up">上传</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="down">模板</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBody">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="Agency" label="运营商名称"> </el-table-column>
        <el-table-column prop="BatchNumber" label="膜卷号"> </el-table-column>
        <el-table-column prop="ProductName" label="产品名称"> </el-table-column>
        <el-table-column prop="Type" label="产品类型"> </el-table-column>
        <el-table-column label="质保年限">
          <template slot-scope="scope">
            {{ scope.row.GPYear == 99 ? "永久" : scope.row.GPYear }}
          </template>
        </el-table-column>
        <el-table-column prop="RemainCount" label="剩余质保次数">
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
      title="添加质保产品"
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
        <el-form-item label="膜卷号：" prop="ProductNumber">
            <el-input v-model="newData.ProductNumber" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="ts">
            <!-- <el-form-item label="筛选省份：" style="float:left;width:50%">
                <el-select v-model="newData.Province"  placeholder="--选择省份--" @change="provinceChanged">
                    <el-option v-for="(item,index) in ProvinceList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="运营商：" prop="Agency" style="float:left;width:50%">
                <el-select v-model="newData.Agency" filterable placeholder="--选择运营商--" @change="agencyChanged1">
                    <el-option v-for="(item,index) in AgencyList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="门店：" prop="StoreName"  style="float:left;width:50%" @change="storeChanged1">
                <el-select v-model="newData.StoreName" filterable  placeholder="--选择门店--" >
                    <el-option v-for="(item,index) in StoreLists" :key="index" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </el-form-item> -->
        </el-form-item >
        <el-form-item class="ts">
            <el-form-item label="产品类型：" prop="Type" style="float:left;width:50%">
                <el-select v-model="newData.Type" placeholder="--选择产品类型--" @change="typeChanged">
                <el-option v-for="(item,index) in TypeList" :key="index" :value="item.Type"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="产品名称：" prop="ProductName" style="float:left;width:50%">
                <el-select v-model="newData.ProductName"  placeholder="--选择产品--">
                    <el-option v-for="(item,index) in NameList" :key="index" :label="item.Name" :value="item.Name"></el-option>
                </el-select>
            </el-form-item>
        </el-form-item >
        <!-- <el-form-item label="料号：" prop="MaterialCode">
            <el-input v-model="newForm.MaterialCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格：" prop="Spec">
            <el-input v-model="newForm.Spec" auto-complete="off"></el-input>
        </el-form-item> -->
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
        <el-form-item label="膜卷号：" prop="BatchNumber">
                <el-input v-model="editData.BatchNumber" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item class="ts">
                <!-- <el-form-item label="筛选省份：" style="float:left;width:50%">
                    <el-select v-model="editData.Province"  placeholder="--选择省份--" @change="provinceChanged">
                        <el-option v-for="(item,index) in ProvinceList" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="运营商：" style="float:left;width:50%" prop="Agency">
                    <el-select v-model="editData.Agency"  placeholder="--选择运营商--" @change="agencyChanged1" >
                        <el-option v-for="(item,index) in AgencyList" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form-item >
            <el-form-item class="ts">
                <el-form-item label="产品类型：" style="float:left;width:50%">
                    <el-select v-model="editData.Type" placeholder="--选择产品类型--" @change="typeChanged" disabled>
                    <el-option v-for="(item,index) in TypeList" :key="index" :value="item.Type"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="产品名称：" style="float:left;width:50%">
                    <el-select v-model="editData.ProductName"  placeholder="--选择产品--" @change="nameChanged" disabled>
                        <el-option v-for="(item,index) in NameList" :key="index" :label="item.Name" :value="item.Name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form-item >
            <!-- <el-form-item label="料号：" prop="MaterialCode">
                <el-input v-model="editForm.MaterialCode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="规格：" prop="Spec">
                <el-input v-model="editForm.Spec" auto-complete="off"></el-input>
            </el-form-item> -->
            <el-form-item label="质保年限：">
                <el-input v-model="editData.GPYear" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="质保总次数：">
                <el-input v-model="editData.GPCount" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="质保剩余次数：" prop="RemainCount">
                <el-input v-model="editData.RemainCount" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否质保：" >
                <el-input v-model="editData.IsSale" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="创建时间：">
                <el-input v-model="editData.CreateTime" auto-complete="off" disabled></el-input>
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
  name: "Product",
  data() {
    return {
      BatchNumber:'',
        ProductName:'',
        Province:'',
        ProvinceList:[],
        Agency:'',
        AgencyList:{},
        StoreId:'',
        StoreList:[],
        StoreLists:[],
        Type:'',
        TypeList:[],
        Name:'',
        NameList:[],
        fileTemp:null,
        limitUpload:1,
        editForm: false,//编辑弹框
        editData:{},//编辑弹框数据
        newForm: false,//添加弹框
        newData:{},//添加弹框数据
        loading:true,
        total:1000,//默认数据总数
        pageSize:10,//每页的数据条数
        currentPage:1,//默认开始页面
        tableData:[],
        rules:{
            BatchNumber:[
                    { required: true, message: '请输入膜卷号', trigger: 'blur' },
            ],
          ProductNumber:[
            { required: true, message: '请输入膜卷号', trigger: 'blur' },
          ],
          Agency:[
              { required: true, message: '请选择运营商', trigger: 'change' },
          ],
          Type:[
            { required: true, message: '请选择产品类型', trigger: 'change' },
          ],
          ProductName:[
            { required: true, message: '请选择产品名称', trigger: 'change' },
          ],
          RemainCount:[
              { required: true, message: '请输入剩余质保次数', trigger: 'blur' },
          ]
          /* MaterialCode:[
            { required: true, message: '请输入料号', trigger: 'blur' },
          ],
          Spec:[
            { required: true, message: '请输入规格', trigger: 'blur' },
          ], */
        },
        isADD:false
    };
  },
  methods: {
    //类型转换Id
        select:function(value){
            var Id=''
            this.TypeList.map(function(item){
                if(item.Type==value){
                    Id=item.Id
                    return
                }
            })
            return Id
        },
        //Id 类型转换
        select1:function(value){
            //console.log(value)
            var Type=''
            this.TypeList.map(function(item){
            //console.log(item.Id)
                if(item.Id==value){
                    Type=item.Type
                    return
                }
            })
            //console.log(Type)
            return Type
        },
        //Id 运营商转换
        select2:function(value){
            var Id=''
            for (const key in this.AgencyList) {
                if (this.AgencyList.hasOwnProperty(key)) {
                    const element = this.AgencyList[key];
                    if(element==value){
                        Id=key
                        // //console.log(Id)
                    }
                }
            }
            return Id
        },
        //省份联动运营商
        provinceChanged:function(value){
            var _this=this
            _this.Agency=''
            _this.StoreId=''
            _this.StoreList=[]
            if(_this.newData.Agency){
                _this.newData.Agency=''
            }
            if(_this.editData.Agency){
                _this.editData.Agency=''
            }
            //获取按省份查询运营商下拉列表
            _this._api.PRODUCT.getAgencyList({
                Province:value
            }).then(function(res){
                // //console.log(res)
                _this.AgencyList=res
            })
        },
        //运营商联动门店
        agencyChanged:function(value){
            var _this=this
            _this.StoreId=''
            _this.StoreList=[]
            //获取运营商门店列表
            _this._api.PRODUCT.getStoreList({
                PartnerId:_this.select2(value)
            }).then(function(res){
                var arr=[{
                            id:'0',
                            name:'暂无'
                        }]
                // //console.log(res)
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        const element = res[key];
                        arr.push({
                            id:key,
                            name:element
                        })
                    }
                }
                _this.StoreList=arr
            })
        },
        agencyChanged1:function(value){
            var _this=this
            _this.$set(this.newData, 'StoreName', '')
            _this.StoreLists=[]
            //获取运营商门店列表
            _this._api.PRODUCT.getStoreList({
                PartnerId:_this.select2(value)
            }).then(function(res){
                var arr=[{
                            id:'0',
                            name:''
                        }]
                // //console.log(res)
                for (const key in res) {
                    if (res.hasOwnProperty(key)) {
                        const element = res[key];
                        arr.push({
                            id:key,
                            name:element
                        })
                    }
                }
                _this.StoreLists=arr
            })
        },
        storeChanged1:function(value){
            var _this=this
            _this.$set(this.newData, 'StoreName', value)
        },
        //类型联动名称
        typeChanged:function(value){
            var _this=this
            if(_this.newData.ProductName){
                _this.newData.ProductName=''
            }
            if(_this.editData.ProductName){
                _this.editData.ProductName=''
            }
            //获取按类型查询名称下拉列表
            _this._api.PRODUCT.getNameList({
                Type:_this.select(value)
            }).then(function(res){
                _this.NameList=res
            })
        },
        //名称联动质保年限
        nameChanged:function(value){
            var GPYear=''
            this.NameList.map(function(item){
                if(value==item.Name){
                    GPYear=item.GPYear
                    return
                }
            })
            this.editData.GPYear=GPYear
        },
        //搜索
        search:function(){
            var _this=this
            _this.loading=true
            _this.currentPage=1
            var sId=''
            if(_this.StoreId=='0'){
                sId=''
            }
            else if(_this.StoreId==''){
                sId='0'
            }else{
                sId=_this.StoreId
            }

            _this._api.PRODUCT.getTable({
                BatchNumber:_this.BatchNumber,
                ProductName:_this.ProductName,
                Type:_this.select(_this.Type),
                Agency:_this.Agency,
                Status:'',
                StoreId:sId,
                AgencyId:_this.select2(_this.Agency),
                PageNumber:_this.currentPage
            }).then(function(res){
                var arr=[]
                res.List.map(function(item){
                    if(item.IsSale=='true'){
                        item.IsSale='是'
                    }else{
                        item.IsSale='否'
                    }
                    item.CreateTime=item.CreateTime.slice(0,10)
                    arr.push(item)
                })
                // //console.log(res.List)
                _this.total=res.Count
                _this.tableData=arr
                _this.loading=false
            })

            
        },
        reset:function(){
            this.BatchNumber='',
            this.ProductName='',
            this.Province='',
            this.Agency='',
            this.Type='',
            this.StoreId=''
            this.currentPage=1
            this.init()
        },
        download:function(){
            var _this=this
            var sId=''
            if(_this.StoreId=='0'){
                sId=''
            }
            else if(_this.StoreId==''){
                sId='0'
            }else{
                sId=_this.StoreId
            }
            _this._api.PRODUCT.downloadTable({
                BatchNumber:_this.BatchNumber,
                ProductName:_this.ProductName,
                Type:_this.select(_this.Type),
                Agency:_this.Agency,
                Status:'',
                StoreId:sId,
                AgencyId:_this.select2(_this.Agency),
            }).then(function(res){
                // //console.log(res)
                require.ensure([], () => {
                    const { export_json_to_excel } = require('@/vendor/Export2Excel.js')
                    const tHeader = ['运营商名称', '膜卷号','产品名称','产品类型','质保年限(数字格式，99代表永久)']
                    const filterVal = ['Agency', 'BatchNumber','ProductName','Type','GPYear']
                    const data = _this.formatJson(filterVal, res)
                    export_json_to_excel(tHeader, data, '质保产品')
                })
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        add:function(){
            this.newForm = true; //显示弹框
            this.StoreLists=[]
        },
        //点击关闭dialog
        newClose(done) {
            this.$refs['newForm'].clearValidate();
            this.newForm = false;
            this.NameList=[]
            this.newData={}
        },
        //点击取消
        newCancel(formName) {
            this.$refs['newForm'].clearValidate();
            this.newForm = false
            this.NameList=[]
            this.newData={}
        },
        //点击更新
        newUpdate(forName) { 
            var _this=this
             this.$refs['newForm'].validate((valid) => {
                if (valid) {
                    if(_this.isADD){
                        return
                    }
                    _this.isADD=true
                    //更新的时候就把弹出来的表单中的数据写到要修改的表格中
                    var data = [{
                                    ProductNumber:  this.newData.ProductNumber,
                                    Agency:this.newData.Agency,
                                    ProductName:this.newData.ProductName,
                                    StoreName:this.newData.StoreName,
                                    /* Type:this.select(this.newForm.Type),
                                    GPYear:this.newForm.GPYear, */
                                    MaterialCode:'',
                                    Spec:''
                                }]
                    //这里再向后台发个post请求重新渲染表格数据
                    _this._api.PRODUCT.addTable(data).then(function(res){
                        _this.$message({
                            type: 'success',
                            message: '添加成功!'
                        })
                        _this.isADD=false
                        _this.$refs['newForm'].clearValidate()
                        _this.NameList=[]
                        _this.newData={}
                        _this.newForm = false
                        _this.currentPage=1
                        _this.init()
                    }).catch(function(res){
                        //清空
                        _this.isADD=false
                        _this.$refs['newForm'].clearValidate()
                        _this.NameList=[]
                        _this.newData={}
                        _this.newForm = false
                        _this.$alert(res+'!', '提示', {
                            confirmButtonText: '确定',
                        });
                    })
                }else{
                    //console.log('error submit!!');
                    return false;
                }
             })
        },
        handleChange(file, fileList){
            this.fileTemp = file.raw
        },
        handleRemove(file,fileList){
            this.fileTemp = null
        },
        up:function(){
          if(this.fileTemp){
              if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp.type == 'application/vnd.ms-excel')){
                  this.importfxx(this.fileTemp)
                  this.fileTemp = null
              } else {
                  this.$message({
                      type:'warning',
                      message:'附件格式错误，请删除后重新上传！'
                  })
              }
          } else {
              this.$message({
                  type:'warning',
                  message:'请上传附件！'
              })
          }
        },
        down:function(){
            var FileSaver = require('file-saver');
            FileSaver.saveAs(this._cos.url+'other/%E8%B4%A8%E4%BF%9D%E4%BA%A7%E5%93%81%E6%A8%A1%E6%9D%BF.xlsx','质保产品模板')
            /* require.ensure([], () => {
                const { export_json_to_excel } = require('../vendor/Export2Excel.js')
                const tHeader = ['运营商名称','膜卷号','产品名称','产品类型(1:漆面膜,2:窗膜前档,3:窗膜前档，4:极速盾甲)','质保年限(数字格式，99代表永久)','料号','规格','备注']
                export_json_to_excel(tHeader, [], '质保产品模板')
            }) */
        },
        importfxx(obj) {
            let _this = this;
            // 通过DOM取文件数据
            this.file = obj
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            var reader = new FileReader();
            //if (!FileReader.prototype.readAsBinaryString) {
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                    var bytes = new Uint8Array(reader.result);
                    var length = bytes.byteLength;
                    for(var i = 0; i < length; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    var XLSX = require('xlsx');
                    if(rABS) {
                        wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(binary, {
                            type: 'binary'
                        });
                    }
                    outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);//outdata就是你想要的东西
                    outdata.map(function(item){
                    item.ProductNumber=item.膜卷号?item.膜卷号.toString():''
                    item.Agency=item.运营商名称?item.运营商名称.toString():''
                    item.ProductName=item.产品名称?item.产品名称.toString():''
                    item.StoreName=item.门店名称?item.门店名称.toString():''
                    // item.Type=item['产品类型(1:漆面膜,2:窗膜前档,3:窗膜前档，4:极速盾甲)']?item['产品类型(1:漆面膜,2:窗膜前档,3:窗膜前档，4:极速盾甲)'].toString():''
                    // item.GPYear=item['质保年限(数字格式，99代表永久)']?item['质保年限(数字格式，99代表永久)'].toString():''
                    // item.MaterialCode=item.料号?item.料号.toString():''
                    // item.Spec=item.规格?item.规格.toString():''
                    
                    //   item.gxsj=_this.formatDate(item.更新时间,'/')
                    delete item.产品名称 
                    delete item['产品类型(1:漆面膜,2:窗膜前档,3:窗膜前档，4:极速盾甲（整卷），5:极速盾甲（单车）)'] 
                    delete item.料号 
                    delete item.膜卷号 
                    delete item.规格 
                    delete item['质保年限(数字格式，99代表永久)'] 
                    delete item.运营商名称 
                    delete item.备注 
                    //   _this.tableData.unshift(item)
                    })
                    //console.log(outdata)
                    /* _this.axios({
                        method: 'post',
                        url: 'https://d.n2car.com/Profilm/Bss/AddWarrantyInfo',
                        // url: 'http://localhost:58103/Bss/AddWarrantyInfo',
                        data: outdata
                    }) */
                    _this._api.PRODUCT.addTable(outdata).then(function(res){
                        // //console.log(res)
                        _this.$message({
                            type: 'success',
                            message: '添加成功!'
                        })
                        _this.init()
                        _this.$refs.upload.clearFiles() //清空
                    }).catch(function(res){
                        _this.editFormVisible = false;
                        // //console.log(res)
                        _this.$alert(res+'!', '提示', {
                            confirmButtonText: '确定'
                        });
                        _this.$refs.upload.clearFiles() //清空
                    })
                }
                reader.readAsArrayBuffer(f);
            }
            if(rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },
        formatDate(numb,format) {
          if(typeof(numb)=='undefined'){
            return ''
          }
          const time = new Date((numb - 1) * 24 * 3600000 + 1)
          time.setYear(time.getFullYear() - 70)
          const year = time.getFullYear() + ''
          const month = time.getMonth() + 1 + ''
          const date = time.getDate() - 1 + ''
          if (format && format.length === 1) {
            return year + format + month + format + date
          }
          return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
        },
        current_change:function(currentPage){
            // //console.log(currentPage)
            var _this=this
            this.currentPage = currentPage;
            this.init()
        },
        //点击编辑
        bj:function(index,row){
            var _this=this
            this.editForm = true; //显示弹框
            // //console.log(index,row)
            //将每一行的数据赋值给Dialog弹框（这里是重点）
            /* _this._api.getZBCP.getTypeList({
                Type:_this.select(row.Type)
            }).then(function(res){
                //console.log(res)
                // _this.NameList=res
            }) */
            _this._api.PRODUCT.getNameList({
                Type:_this.select(row.Type)
            }).then(function(res){
                _this.NameList=res
            })
            _this.editData = Object.assign({BatchNumberEx:row.BatchNumber,StoreId:row.StoreId},row) // editForm是Dialog弹框的data
        },
        //点击关闭dialog
        editClose(done) {
            this.$refs['editForm'].clearValidate();
            this.editForm = false;
        },
        //点击取消
        editCancel(formName) {
            this.$refs['editForm'].clearValidate();
            this.editForm = false;
        },
        //点击更新
        editUpdate(forName) { 
            var _this=this
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    //更新的时候就把弹出来的表单中的数据写到要修改的表格中
                    var data = {
                        Id:this.editData.ID,
                        BatchNumber:this.editData.BatchNumber,
                        ProductName:this.editData.ProductName,
                        Type:this.select(this.editData.Type),
                        GPYear:this.editData.GPYear,
                        MaterialCode:this.editData.MaterialCode,
                        Spec:this.editData.Spec,
                        AgencyId:this.select2(this.editData.Agency),
                        StoreId:this.editData.StoreId,
                        RemainCount:this.editData.RemainCount,
                        // BatchNumberEx:this.editForm.BatchNumberEx,
                        // Agency:this.editForm.Agency
                    }
                    // //console.log(data)
                    //这里再向后台发个post请求重新渲染表格数据
                    /* this.axios({
                        method:'post',
                        url:'https://d.n2car.com/Profilm/Bss/UpdateWarrantyInfo',
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded'
                        },
                        data:qs.stringify(
                            data
                        )
                    }) */
                    _this._api.PRODUCT.editTable(
                        data
                    ).then(function(res){
                        // //console.log(res.data)
                        _this.$message({
                            type: 'success',
                            message: '更新成功!'
                        });
                        _this.$refs['editForm'].clearValidate();
                        _this.editForm = false;
                        _this.currentPage=1
                        _this.init()
                    }).catch(function(res){
                        _this.$refs['editForm'].clearValidate();
                        _this.editForm = false;
                        // //console.log(res)
                        _this.$alert(res+'!', '提示', {
                            confirmButtonText: '确定'
                        });
                    })
                }else{
                    //console.log('error submit!!');
                    return false;
                }
            })
        },
        //点击删除
        sc:function(index,row){
            var _this=this
            // //console.log(row)
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                /* this.axios({
                    method:'post',
                    url:'https://d.n2car.com/Profilm/Bss/DelWarrantyInfo',
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                    },
                    data:qs.stringify(
                        {Id:row.ID}
                    )
                }) */
                _this._api.PRODUCT.delTable({
                    Id:row.ID
                }).then(function(res){
                    // //console.log(res.data)
                    _this.currentPage=1
                    _this.init()
                    _this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(function(res){
                    _this.$alert(res+'!', '提示', {
                        confirmButtonText: '确定'
                    });
                    _this.currentPage=1
                    _this.init()
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        //点击下载
        xz:function(a,b){
            // //console.log(a,b)
            require.ensure([], () => {
                const { export_json_to_excel } = require('@/vendor/Export2Excel.js')
                const tHeader = ['运营商名称', '膜卷号','产品名称','产品类型(1:漆面膜,2:窗膜前档,3:窗膜前档，4:极速盾甲（整卷），5:极速盾甲（单车）)','质保年限(数字格式，99代表永久)','料号','规格']
                const filterVal = ['Agency', 'BatchNumber','ProductName','Type','GPYear','MaterialCode','Spec']
                const list = [b]
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, '质保产品')
            })
        },
        init:function(){
            var _this=this
            _this.loading=true
            //获取产品类型列表
            /* this.axios({
                method:'post',
                url:'https://d.n2car.com/Profilm/Bss/GetProductInfoList',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            }) */
            _this._api.PRODUCT.getTypeList({}).then(function(res){
                // //console.log(res.data)
                _this.TypeList=res
            })
            //获取运营商省份
            /* this.axios({
                method:'post',
                url:'https://d.n2car.com/Profilm/Bss/QueryPartnerProvince',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            }) */
            _this._api.PRODUCT.getAgencyProvinceList({}).then(function(res){
                // //console.log(res.data)
                _this.ProvinceList=res
            })
            //获取按省份查询运营商下拉列表
            /* this.axios({
                method:'post',
                url:'https://d.n2car.com/Profilm/Bss/QueryPartnerByProvince',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                data:qs.stringify({
                    Province:''
                })
            }) */
            _this._api.PRODUCT.getAgencyList({
                Province:''
            }).then(function(res){
                // //console.log(res)
                _this.AgencyList=res
            })
            
            //获取质保产品列表
            /* this.axios({
                method:'post',
                url:'https://d.n2car.com/Profilm/Bss/GetWarrantyInfo',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                data:qs.stringify({
                    
                    BatchNumber:_this.BatchNumber,
                    ProductName:_this.ProductName,
                    Type:_this.select(_this.Type),
                    Agency:_this.Agency,
                    Status:'',
                    AgencyId:_this.select2(_this.Agency),
                    PageNumber:_this.currentPage
                })
            }) */
            var sId=''
            if(_this.StoreId=='0'){
                sId=''
            }
            else if(_this.StoreId==''){
                sId='0'
            }else{
                sId=_this.StoreId
            }

            _this._api.PRODUCT.getTable({
                BatchNumber:_this.BatchNumber,
                ProductName:_this.ProductName,
                Type:_this.select(_this.Type),
                Agency:_this.Agency,
                Status:'',
                StoreId:sId,
                AgencyId:_this.select2(_this.Agency),
                PageNumber:_this.currentPage
            }).then(function(res){
                var arr=[]
                res.List.map(function(item){
                    if(item.IsSale=='true'){
                        item.IsSale='是'
                    }else{
                        item.IsSale='否'
                    }
                    item.CreateTime=item.CreateTime.slice(0,10)
                    arr.push(item)
                })
                // //console.log(res.List)
                _this.total=res.Count
                _this.tableData=arr
                _this.loading=false
            })
        }
    },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.ts >>> .el-form-item__content{
    margin-left: 0 !important;
}
</style>
