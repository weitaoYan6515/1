<template>
  <div>
    <el-upload
      :ref="refs"
      :class="imgList.length >= limit ? 'hide' : ''"
      action
      list-type="picture-card"
      accept="image/*"
      :multiple="multiple"
      :limit="limit"
      :auto-upload="false"
      :file-list="imgList"
      :on-exceed="imgExceed"
      :on-preview="imgPreview"
      :on-remove="imgRemove"
      :on-change="imgChange"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <div v-if="isCropper">
      <cropperImage
        :dialogVisible="showCropper"
        :cropper-option="cropperOption"
        :file-size="fileSize"
        :file-type="fileType"
        :auto-crop-width="autoCropWidth"
        :auto-crop-height="autoCropHeight"
        :fixed-box="fixedBox"
        :fixed="fixed"
        :fixed-number="fixedNumber"
        :is-compress="isCompress"
        :compress="compress"
        :cropper-style="cropperStyle"
        @close="showCropper=false"
        @uploadCropper="uploadImg"
      />
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import cropperImage from '@/components/Cropper'
export default {
  components: {
    cropperImage
  },
  props: {
    refs: {
      type: String,
      default: "",
    },
    imgList: {
      type: Array,
      default: () =>[],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 1,
    },
    fileSize: {
      type: Number,
      default: 2,
    },
    fileType: {
      type: Array,
      default: () =>["jpeg", "jpg", "png"],
    },
    isCropper:{
      type: Boolean,
      default: false,
    },
    autoCropWidth: {// 默认生成截图框宽度
      type: Number,
      default: 350,
    },
    autoCropHeight: {// 默认生成截图框高度
      type: Number,
      default: 200,
    },
    fixedBox: {// 固定截图框大小不可改变
      type: Boolean,
      default: false,
    },
    fixed: {// 是否开启截图框宽高固定比例
      type: Boolean,
      default: true,
    },
    fixedNumber:{//截图框比例
      type:Array,
      default:() =>[7,5]
    },
    isCompress: {//是否压缩
      type: Boolean,
      default: false,
    },
    compress: {//压缩率
      type: Number,
      default: 0.8,
    }
  },
  name: "cos-upload",
  data: function () {
    return {
      dialogVisible: false,
      dialogImageUrl: "",

      cropperData: {},
      showCropper: false, // 显示裁剪弹窗
      canCropper: false,
      cropperOption: {
        img: '',
      },
      cropperStyle: {
        width: '390px',
        height: '290px'
      }
    };
  },
  methods: {
    
    
    // 自定义上传方法
    uploadImg (file, data) {

        var filee={name:file.name,url:data,raw:file,status:"ready",uid:new Date().getTime()}
        this.imgList.push(filee);
        this.$refs[this.refs].uploadFiles.push(filee);
        this.showCropper = false
        


      return
      let fileFormData = new FormData()
      fileFormData.append('file', file)
      // 移除上传组件带来的bug
      // document.getElementsByTagName('body')[0].removeAttribute('style')
      this.cropperData.iconUrl = data
      // api.uploadFile(fileFormData, this).then(res => {
      //   this.cropperData.iconUrl = res
      //   this.showCropper = false
      //   this.$message({
      //     message: '操作成功',
      //     type: 'success'
      //   })
      // })
    },

    imgExceed: function (file, fileList) {
      this.$message.warning(`最多上传${this.limit}张!`);
    },
    imgPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    imgRemove(file) {
      this.imgList.map(function (item, index, arr) {
        if (item == file) {
          arr.splice(index, 1);
        }
      });
    },
    imgChange(file) {
      const IMG_ALLOWD = this.fileType;
      const imgType = file.raw.type.split("/")[1];
      const imgSize = file.size / 1024 / 1024;
      // 判断图片格式
      if (IMG_ALLOWD.indexOf(imgType) === -1) {
        this.$message.warning(`图片格式错误!支持：${this.fileType.join(",")}`);
        this.$refs[this.refs].uploadFiles.splice(
          this.$refs[this.refs].uploadFiles.length - 1,
          1
        );
      } else if (imgSize >= this.fileSize) {
        // 判断图片大小
        this.$message.warning(`图片大于${this.fileSize}M!`);
        this.$refs[this.refs].uploadFiles.splice(
          this.$refs[this.refs].uploadFiles.length - 1,
          1
        );
      } else {
        // 成功
        file.name = new Date().getTime() +'' +this.imgList.length + "." + imgType;
        if(this.isCropper){
          this.$refs[this.refs].uploadFiles.splice(
            this.$refs[this.refs].uploadFiles.length - 1,
            1
          );
          this.$nextTick(() => {
              this.cropperOption.img = window.URL.createObjectURL(file.raw)
              /* this.cropperOption.autoCropWidth = this.autoCropWidth
              this.cropperOption.autoCropHeight = this.autoCropHeight */
              this.showCropper = true
          })
        }else{
          this.imgList.push(file);
        }
      }
    },
  },
  mounted() {
    
  },
};
</script>

<style>
  .el-upload-list__item:before{
    display: inline-block;
              vertical-align: middle;
              content: '';
              height: 100%;
  }
  .el-upload-list__item img{
    display: inline-block;
    height: auto !important; 
              vertical-align: middle;
  }
  .hide .el-upload--picture-card{
    display: none;
  }
</style>