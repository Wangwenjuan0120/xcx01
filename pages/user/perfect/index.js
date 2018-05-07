import core from '../../../utils/core/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: [
      {
        id: 1,
        name: '医生'
      },
      {
        id: 2,
        name: '护士'
      },
      {
        id: 3,
        name: '药师'
      },
      {
        id: 4,
        name: '医院管理者'
      },
      {
        id: 5,
        name: '医学生'
      },
      {
        id: 6,
        name: '其他'
      }
    ],
    educationList: [
      {
        id: 0,
        name: '高中\中专'
      },
      {
        id: 1,
        name: '大专'
      },
      {
        id: 2,
        name: '本科'
      },
      {
        id: 3,
        name: '硕士'
      },
      {
        id: 4,
        name: '博士'
      },
      {
        id: 5,
        name: '其他'
      }
    ],
    titleList: [],
    titleList1: [
      {
        id: 0,
        name: '主任医师'
      },
      {
        id: 1,
        name: '副主任医师'
      },
      {
        id: 2,
        name: '主治医师'
      },
      {
        id: 3,
        name: '住院医师'
      },
      {
        id: 4,
        name: '其他'
      }
    ],
    titleList2: [
      {
        id: 0,
        name: '护士'
      },
      {
        id: 1,
        name: '护士长'
      }
    ],
    sexList: [
      {
        id: 0,
        name: '男'
      },
      {
        id: 1,
        name: '女'
      }
    ],
    departmentList: [[
      {
        id: 1,
        name: '内科'
      },
      {
        id: 2,
        name: '外科'
      },
      {
        id: 3,
        name: '妇产科'
      },
      {
        id: 4,
        name: '儿科'
      },
      {
        id: 5,
        name: '其他'
      }
    ]],
    majorList: [],
    typeIndex: '',
    sexIndex: '',
    titleIndex: '',
    educationIndex: '',
    majorIndex: '',
    departmentIndex: [0, 0],
    departmentIndex1: 0,
    departmentIndex2: '',
    hospitalName: '',
    info: {
      name: '',
      type: '',
      sex: '',
      education: '',
      hospital: {
        id: '',
        pvcName: '',
        ctyName: '',
        dstName: '',
        value: ''
      },
      department: '',
      title: '',
      major: ''
    },
    oldUser: {},
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    self.getDepartment(self.data.departmentList[0][0].id);

    core.user.getMajor().then(data => {
      self.setData({
        majorList: data.majors
      })
    })

    self.setData({
      type: options.type || ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;

    core.cache.getData('hospital').then(data => {
      self.setData({
        'info.hospital.pvcName': data.pvcName || "",
        'info.hospital.ctyName': data.ctyName || "",
        'info.hospital.dstName': data.dstName || "",
        'info.hospital.value': data.name || "",
        'hospitalName': data.name || ""
      })
      core.cache.saveData('hospital', {})

      if (!data.name) {
        // 修改
        if (self.data.type == "modify") {
          var typeList = self.data.typeList;
          var sexList = self.data.sexList;

          core.user.loginTo(false).then(loginInfo => {
            self.setData({
              'info.name': loginInfo.name,
              'info.type': loginInfo.type,
              'info.sex': loginInfo.sex,
              'info.education': loginInfo.education,
              'info.department': loginInfo.department,
              'info.title': loginInfo.title,
              'info.major': loginInfo.major,
              'info.hospital.value': loginInfo.hospital,
              'hospitalName': loginInfo.hospital,
              'oldUser': loginInfo
            })

            typeList.forEach(function (item, index) {
              if (item.id == loginInfo.type) {
                self.setData({
                  typeIndex: index
                })
              }
            })

            sexList.forEach(function (item, index) {
              if (item.id == loginInfo.sex) {
                self.setData({
                  sexIndex: index
                })
              }
            })

            let titleList = [];
            if (loginInfo.type == 1) {
              titleList = self.data.titleList1;
            } else if (loginInfo.type == 2) {
              titleList = self.data.titleList2;
            }

            self.setData({
              titleList: titleList,
            })

          })

          self.setData({
            type: '',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getDepartment: function (pid) {
    var self = this;
    return new Promise(function (resolve, reject) {
      core.user.getDepartment({ 'pid': pid }).then(data => {

        self.setData({
          'departmentList[1]': data.departments
        })

      })
    })
  },
  saveInfo: function () {
    var self = this;

    if (!self.data.info.name) {
      wx.showToast({
        title: "姓名不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (self.data.info.sex === '') {
      wx.showToast({
        title: "性别不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!self.data.info.education) {
      wx.showToast({
        title: "学历不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!self.data.info.type) {
      wx.showToast({
        title: "身份不能为空",
        icon: 'none',
        duration: 2000
      })
      return
    }

    let newUser = {};

    // 如果是修改的话重新构建 只传修改的内容
    if (self.data.type == "modify") {
      var oldUser = self.data.oldUser;
      var info = self.data.info;

      if (info.name != oldUser.name) {
        newUser['name'] = info.name;
      }
      if (info.type != oldUser.type) {
        newUser['type'] = info.type;
      }
      if (info.sex != oldUser.sex) {
        newUser['sex'] = info.sex;
      }
      if (info.education != oldUser.education) {
        newUser['education'] = info.education;
      }
      if (info.department != oldUser.department) {
        newUser['department'] = info.department;
      }
      if (info.title != oldUser.title) {
        newUser['title'] = info.title;
      }
      if (info.major != oldUser.major) {
        newUser['major'] = info.major;
      }
      if (info.hospital.value != oldUser.hospital) {
        newUser['hospital'] = info.hospital;
      }

    } else {
      newUser = self.data.info;
    }

    console.log(newUser)

    core.user.saveUserInfo(newUser).then(data => {
      wx.showToast({
        title: '完善资料成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          core.user.updateUserInfo().then(data => {
            if (self.data.type == "login") {
              wx.redirectTo({
                url: '/pages/user/home/index'
              })
            } else {
              wx.navigateBack();
            }
          })
        }
      })

      // 需要重新更新资料
    })
  },
  inputName: function (e) {
    this.setData({
      'info.name': e.detail.value
    })
  },
  typeChange: function (e) {
    var titleList = [];

    if (this.data.typeList[e.detail.value].id == 1) {
      titleList = this.data.titleList1;
    } else if (this.data.typeList[e.detail.value].id == 2) {
      titleList = this.data.titleList2;
    }

    this.setData({
      titleList: titleList,
      typeIndex: e.detail.value,
      'info.type': this.data.typeList[e.detail.value].id,
      'info.title': ''
    })
  },
  sexChange: function (e) {
    this.setData({
      sexIndex: e.detail.value,
      'info.sex': this.data.sexList[e.detail.value].id
    })
  },
  educationChange: function (e) {
    this.setData({
      educationIndex: e.detail.value,
      'info.education': this.data.educationList[e.detail.value].name
    })
  },
  titleChange: function (e) {
    this.setData({
      titleIndex: e.detail.value,
      'info.title': this.data.titleList[e.detail.value].name
    })
  },
  majorChange: function (e) {
    this.setData({
      majorIndex: e.detail.value,
      'info.major': this.data.majorList[e.detail.value].name
    })
  },
  departmentChange: function (e) {
    var self = this;
    var departmentList = self.data.departmentList;

    var departmentIndex = e.detail.value;

    self.setData({
      departmentIndex: e.detail.value,
      'info.department': departmentList[1][departmentIndex[1]].name,
      departmentIndex2: departmentIndex[1]
    })
  },
  departmentColumnChange: function (e) {
    var self = this;
    var departmentIndex1 = self.data.departmentIndex1;

    if (e.detail.column == 0) {
      if (e.detail.value != departmentIndex1) {
        var pid = self.data.departmentList[0][e.detail.value].id;
        self.getDepartment(pid);

        self.setData({
          departmentIndex1: e.detail.value
        })
      }
    }
  }
})