Component({
  sysInfo: {},
  properties: {
    /**
     * width to be cropped
     * expect rpx, px vw or vh
     * @type {String}
     */
    width: {
      type: String,
      value: '400rpx',
      observer(width) {
        this.setData({
          _width: this.getRpx(width),
        });
      },
    },
    /**
     * height to be cropped
     * expect rpx, px vw or vh
     * @type {String}
     */
    height: {
      type: String,
      value: '400rpx',
      observer(height) {
        this.setData({
          _height: this.getRpx(height),
        });
      },
    },
    /**
     * image resouce to be cropped
     * expect wechat temp file path
     * @type {String}
     */
    src: {
      type: String,
      observer(src) {
        this.setImageData(src);
      },
    },
    cancelText: {
      type: String,
      value: '取消',
    },
    confirmText: {
      type: String,
      value: '确定',
    },
    cancelColor: {
      type: String,
      value: '#000000',
    },
    confirmColor: {
      type: String,
      value: '#FFFFFF',
    },
    cancelBgColor: {
      type: String,
      value: '#FFFFFF',
    },
    confirmBgColor: {
      type: String,
      value: '#09BB07',
    },
  },
  data: {
    _width: 400, // width to be cropped in rpx
    _height: 400, // height to be cropped in rpx
    m_width: 0, // image scaled width in rpx
    m_height: 0, // image scaled height in rpx
    o_width: 0, // image origin width in rpx
    o_height: 0, // image origin height in rpx
    _damping: 20, // movable-view damping
    _friction: 2, // movable-view friction
    _x: 0, // movable-view position x
    _y: 0, // movable-view position y
    _s: 1, // movable-view scale
  },
  methods: {
    // px, vw or vh TO rpx
    getRpx(str) {
      const actions = new Map([
        [/^[0-9]+$/, (() => Number(str))()],
        [/^[0-9]+[.]*[0-9]+rpx$/, (() => Number(str.slice(0, str.length - 3)))()],
        [/^[0-9]+[.]*[0-9]+px$/, (() => Number(str.slice(0, str.length - 2)) / this.sysInfo.scale)()],
        [/^[0-9]+[.]*[0-9]+vw$/, (() => Number(str.slice(0, str.length - 2)) / 100 * this.sysInfo.windowWidth / this.sysInfo.scale)()],
        [/^[0-9]+[.]*[0-9]+vh$/, (() => Number(str.slice(0, str.length - 2)) / 100 * this.sysInfo.windowHeight / this.sysInfo.scale)()],
      ]);
      const action = ([...actions].filter(([key]) => key.test(str)))[0];
      if (typeof action === 'undefined') throw new TypeError('expected to be rpx, px vw or vh');
      const rpx = action[1];
      if (rpx <= 0) throw new RangeError('expected to be greater than 0');
      return rpx;
    },
    setImageData(src) {
      const self = this;
      wx.getImageInfo({
        src,
        success(res) {
          const { scale } = self.sysInfo;
          let { width: m_width, height: m_height } = res;
          m_width /= scale;
          m_height /= scale;
          self.data.o_width = m_width;
          self.data.o_height = m_height;
          const { _width: width, _height: height } = self.data;
          if (m_width > m_height) {
            const rs = height * m_width / m_height;
            self.setData({
              m_width: rs,
              m_height: height,
              _x: -(rs - height) * scale / 2,
            });
          } else if (m_width < m_height) {
            const rs = width * m_height / m_width;
            self.setData({
              m_width: width,
              m_height: rs,
              _y: -(rs - width) * scale / 2,
            });
          } else {
            self.setData({
              m_width: width,
              m_height: height,
            });
          }
        },
      });
    },
    moving(e) {
      const { x, y } = e.detail;
      this.data._x = x;
      this.data._y = y;
    },
    scaling(e) {
      const { scale, x, y } = e.detail;
      this.data._s = scale;
      this.data._x = x;
      this.data._y = y;
    },
    cancel() {
      this.triggerEvent('cancel');
    },
    export() {
      const self = this;
      const { scale } = self.sysInfo;
      const {
        src, _x, _y, _s, m_width, m_height, o_width, o_height, _width, _height,
      } = self.data;
      const ratio_w = o_width / m_width;
      const ratio_h = o_height / m_height;
      const x = Math.abs(_x) * ratio_w / _s;
      const y = Math.abs(_y) * ratio_h / _s;
      const width = _width * ratio_w * scale / _s;
      const height = _height * ratio_h * scale / _s;
      const ctx = wx.createCanvasContext('tailor', self);
      ctx.drawImage(src, x, y, width, height, 0, 0, _width * scale, _height * scale);
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: _width * scale,
          height: _height * scale,
          canvasId: 'tailor',
          success(res) {
            self.triggerEvent('confirm', res);
          },
          fail(err) {
            self.triggerEvent('error', err);
          },
        }, self);
      });
    },
  },
  created() {
    this.sysInfo = wx.getSystemInfoSync();
    Object.assign(this.sysInfo, {
      scale: this.sysInfo.windowWidth / 750,
    });
  },
});
