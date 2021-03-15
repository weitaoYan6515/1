<template>
  <el-dialog
    title="图片裁切"
      append-to-body
    class="cropper-dialog"
    :close-on-click-modal="false"
    :visible="dialogVisible"
    center
    @close="close"
  >
    <div class="cropper-wrap">
        <span>原图</span>
      <div class="cropper-box" :style="cropperStyle">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="option.info"
          :full="option.full"
          :canScale="option.canScale"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed="fixed"
          :fixed-box="fixedBox"
          :fixed-number="fixedNumber"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="autoCropWidth"
          :auto-crop-height="autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          :info-true="option.infoTrue"
          :max-img-size="option.maxImageSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          :maxImgSize="option.maxImgSize"
          @realTime="realTime"
        />
      </div>
        <span>预览</span>
      <div class="preview-box">
        <div :style="previewStyle" class="preview-img">
          <div :style="preview.div">
            <img :style="preview.img" :src="preview.url" />
          </div>
        </div>
      </div>
    </div>
    <input
      ref="upload"
      type="file"
      style="position: absolute; clip: rect(0 0 0 0)"
      accept="image/png, image/jpeg, image/jpg"
      @change="uploadImg"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button @click="upload">重新上传</el-button>
      <el-button type="primary" @click="finish" :loading="loading"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  name: "ImageCropper",
  components: {
    VueCropper,
  },
  data() {
    return {
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
        full: true, // 是否输出原图比例的截图
        info: true, // 图片大小信息
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: true, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        height: true,
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        enlarge: 1, // 图片根据截图框输出比例倍数
        mode: "container", // 图片默认渲染方式
        maxImgSize: 375,
      },
      // 防止重复提交
      loading: false,
      preview: {},
      previewStyle: {},
      
    };
  },
  props: {
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
    fixedNumber: {//截图框比例
      type:Array,
      default:() =>[7, 5]
    },
    isCompress: {//是否压缩
      type: Boolean,
      default: false,
    },
    compress: {//压缩率
      type: Number,
      default: 0.8,
    },
    fileSize: {
      type: Number,
      default: 2,
    },
    fileType: {
       type: Array,
        default: () =>["jpeg", "jpg", "png"],
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    cropperOption: {
      type: Object,
      default: () => {},
    },
    cropperStyle: {
      type: Object,
      default: () => {},
    },
    // 裁剪预览图片缩放比例
    zoom: {
      type: Number,
      default: 1,
    }
  },
  watch: {
    cropperOption: {
      handler(value) {
        this.option = Object.assign(this.option, value);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    upload() {
      // 点击上传
      this.$refs.upload.value = null;
      this.$refs.upload.click();
    },
    uploadImg(e) {
      // 上传图片
      let file = e.target.files[0];
      const IMG_ALLOWD = this.fileType;
      const imgType = file.type.split("/")[1];
      const imgSize = file.size / 1024 / 1024;
      // 判断图片格式
      if (IMG_ALLOWD.indexOf(imgType) === -1) {
        this.$message.warning(`图片格式错误!支持：${this.fileType.join(",")}`);
        return false
      }
       if (imgSize >= this.fileSize) {
        // 判断图片大小
        this.$message.warning(`图片大于${this.fileSize}M!`);
        return false
      }
      let reader = new FileReader();
      // 转化为blob
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.$set(this.option, "img", data);
      };
    },
    realTime(preview) {
      // 实时预览
      this.preview = preview;
      this.previewStyle = {
        width: preview.w + "px",
        height: preview.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: this.zoom,
      };
    },
    // 将base64转换为文件
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let len = bstr.length;
      let u8arr = new Uint8Array(len);
      while (len--) {
        u8arr[len] = bstr.charCodeAt(len);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // 将base64转换为png文件图片
    finish() {
      this.$refs.cropper.getCropData((data) => {
        let file = null
        if (this.isCompress) {  //是否压缩
          let img = new Image()
          img.src = data
          img.onload = () => {
            let _data = this.onImgCompression(img)
            file = this.dataURLtoFile(_data, new Date().getTime() + ".png")
            console.log('图片大小-压缩过:', (file.size / 1024).toFixed(2), 'kb，', '压缩率：', this.compress)
            this.$emit('uploadCropper', file, _data)
          }
        } else {
          file = this.dataURLtoFile(data, new Date().getTime() + ".png")
          console.log('图片大小-未压缩:', (file.size / 1024).toFixed(2), 'kb')
          this.$emit('uploadCropper', file, data)
        }
      });
    },
    // 压缩图片 
    onImgCompression (img) {
      let canvas = document.createElement("canvas")
      let ctx = canvas.getContext("2d")
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      canvas.width = width
      canvas.height = height
      // 铺底色 
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, width, height)
      //进行压缩 
      let compress = this.compress || 0.8  //压缩率
      return canvas.toDataURL("image/png", compress)
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.cropper-box,.preview-img{
  margin:auto !important
}
</style>
