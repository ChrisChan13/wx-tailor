# ✂ A simple image cropper for Wechat Miniprogram

# Usage
Get `wx-tailor` on NPM
```
npm i -S wx-tailor --production
```
Include `wx-tailor` in \<your page\>.json
```
{
  "usingComponents": {
    "tailor": "wx-tailor"
  }
}
```
Using `wx-tailor` in \<your page\>.wxml
```
<tailor src="{{imageSrc}}" />
```

## Attribute
| Attribute | Description | Type | Accepted Values | Default |
| --- | --- | --- | --- | --- |
| width | width to be cropped(expect rpx, px, vw or vh) | String | -- | 400rpx |
| height | height to be cropped(expect rpx, px, vw or vh) | String | -- | 400rpx |
| src | image resouce to be cropped(expect wechat's temporary file path) | String | -- | -- |
| cancelText | text content of cancel button | String | -- | 取消 |
| confirmText | text content of confirm button | String | -- | 确定 |
| cancelColor | text color of cancel button | String | -- | #000000 |
| confirmColor | text color of confirm button | String | -- | #FFFFFF |
| cancelBgColor | background color of cancel button | String | -- | #FFFFFF |
| confirmBgColor | background color of confirm button | String | -- | #09BB07 |

## Events
| Event Name | Description | Parameters |
| --- | --- | --- |
| cancel | triggers when the cancel button is clicked | -- |
| confirm | triggers when the confirm button is clicked | wechat's temporary file path of cropped image |
| error | triggers when error occurred | details of the error |
