
<template>
<el-form :model="form" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
<el-form-item
    label="年龄"
    prop="age"
    :rules="[
      { required: true, message: '单价不能为空'},
      { type: 'number', message: '单价必须为数字值'}
    ]"
>
  <el-input v-model.number="form.age" autocomplete="off"></el-input>
</el-form-item>
<el-form-item>
  <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
  <el-button @click="resetForm('numberValidateForm')">重置</el-button>
</el-form-item>
</el-form>
</template>
<script>
export default {
  data() {
    return {
      form: {
        age: ''
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
