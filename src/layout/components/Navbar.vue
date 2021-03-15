<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
        <!-- <span>{{name}}</span> -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="modifyPassword">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      append-to-body
      :visible.sync="editFormVisible"
      :close-on-click-modal="true"
      class="edit-form"
      :before-close="handleClose"
    >
      <el-form
        :model="editForm"
        status-icon
        label-width="100px"
        ref="editForm"
        :rules="rules"
      >
        <el-form-item label="原密码：" prop="ymm">
          <el-input
            type="password"
            v-model="editForm.ymm"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="xmm">
          <el-input
            type="password"
            v-model="editForm.xmm"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="qrmm">
          <el-input
            type="password"
            v-model="editForm.qrmm"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel('editForm')">取消</el-button>
        <el-button type="primary" @click.native="handleUpdate('editForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAccount } from '@/utils/auth'

import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from '@/components/Screenfull'

export default {
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输新入密码"));
      } else {
        if (this.editForm.qrmm !== "") {
          this.$refs.editForm.validateField("qrmm");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editForm.xmm) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      username: "",
      editFormVisible: false, //弹框
      editForm: {}, //弹框数据
      rules: {
        ymm: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        xmm: [{ required: true, validator: validatePass1, trigger: "blur" }],
        qrmm: [{ required: true, validator: validatePass2, trigger: "change" }],
      },
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar","device","name"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    modifyPassword() {
      this.editFormVisible = true; //显示弹框
    },
    //点击关闭dialog
    handleClose(done) {
      this.editFormVisible = false;
      this.editForm = {};
      this.$refs["editForm"].clearValidate();
    },
    //点击取消
    handleCancel(formName) {
      this.editFormVisible = false;
      this.editForm = {};
      this.$refs["editForm"].clearValidate();
    },
    //点击更新
    handleUpdate(forName) {
      //更新的时候就把弹出来的表单中的数据写到要修改的表格中
      var _this = this;
      _this.$refs["editForm"].validate((valid) => {
        if (valid) {
          var data = {
            UserAccount: getAccount(),
            OldPassword: _this.editForm.ymm,
            NewPassword: _this.editForm.xmm,
          };
          console.log(data)
          _this.$store.dispatch('user/modify', data).then((res) => {
            _this.editFormVisible = false;
            _this.editForm = {};
            _this.$refs["editForm"].clearValidate();
            _this.$alert("修改成功!", "提示", {
              confirmButtonText: "确定",
            });
          }).catch((err) => {
            _this.editFormVisible = false;
            _this.editForm = {};
            _this.$refs["editForm"].clearValidate();
            _this.$alert(err, "提示", {
              confirmButtonText: "确定",
            });
          })
            

          
          /* api
            .modify(data)
            .then(function (res) {
              _this.editFormVisible = false;
              _this.editForm = {};
              _this.$refs["editForm"].clearValidate();
              _this.$alert("修改成功!", "提示", {
                confirmButtonText: "确定",
              });
            })
            .catch(function (res) {
              _this.editFormVisible = false;
              _this.editForm = {};
              _this.$refs["editForm"].clearValidate();
              // console.log(res)
              _this.$alert(res, "提示", {
                confirmButtonText: "确定",
              });
            }); */
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
