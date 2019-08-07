Page({
  data: {
    show: false,
    src: '',
    origin: '',
  },
  chooseImage() {
    const self = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        self.setData({
          origin: res.tempFilePaths[0],
          show: true,
        });
      },
    });
  },
  hide() {
    this.setData({
      show: false,
    });
  },
  confirm(e) {
    this.setData({
      show: false,
      src: e.detail.tempFilePath,
    });
  },
});
