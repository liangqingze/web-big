$(function () {
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 点击上传 = 点击了隐藏的input文件
    $('#goimage').click(function () {
        $('#file').click()
    })


    // 获取上传文件夹的 图片
    $('#file').change(function (e) {

        console.log(e.target.files)
        if (e.target.files.length === 0) {
            return layui.layer.alert('请选择要上传的图片')
        }

        // js 模块
        var newImgURL = URL.createObjectURL(e.target.files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 点击 确定 然后将头像上传服务器
    $('#yes').click(function () {
        // js 模块
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({ 
            url: 'http://big-event-api-t.itheima.net/my/update/avatar',
            method: 'post',
            data: {
                avatar: dataURL
            },
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success:(res)=>{
                if(res.status !== 0){
                    return layui.layer.alert('更换头像失败')
                }
                layui.layer.alert('更换头像成功！')
                window.parent.a()
            }
        })
    })
})