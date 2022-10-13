$(function () {
    var layer = layui.layer
    var form = layui.form
    initEditor()    //调用 编辑器的模块
     
        fenl()      //调用 获取分类中的选项

    // 第四步引入剪裁图片day-3-素材-副文本封面素材里面的代码引入的js
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击封面 = 点击隐藏的input
    $('#btnimg').on('click', function () {
        $('#cover').click()
    })

    // 点击封面
    $('#cover').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files
        if (file.length === 0) {
            return layui.layer.msg("请选择对应的文件")
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    var art_status = '已发布' // 状态默认为已发布
    $('#caogao').on('click', function () {
        art_status = '存为草稿'
    })


    // 点击发布
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()

        //  创建一个表单对象
        var fd = new FormData($(this)[0])

        fd.append('state', art_status) // 将状态 存进 status

        // day-3-素材-副文本封面素材里面的代码引入的js
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // blob = 当前选择的图片
                fd.append('cover_img', blob)  // 将当前 图片 存进 cover_img
                fd.forEach(function(a,b){
                    console.log(b+'='+a)
                })
                fabu(fd)    // 调用fabu函数 并将 fd 的什么status啊或者cover_img啊丢进去
            })
        
        
    })
})



function fenl() {
    $.ajax({
        method: 'GET',
        url: 'http://big-event-api-t.itheima.net/my/article/cates',
        headers: {
            // 地址带有 /my 的都得有'token' 里面的代码
            // 权限接口
            Authorization: localStorage.getItem('token')
        },
        success: (res) => {
            if (res.status !== 0) {
                return layui.layer.msg("获取分类失败")
            }
            var str = template('xz', res)
            $('[name=cate_id]').html(str)
            // 第一遍渲染不出效果
            // 加上这个 = 重新渲染
            layui.form.render()
        }
    })
}

function fabu(fd) {
    $.ajax({
        method: 'post',
        url: 'http://big-event-api-t.itheima.net/my/article/add',
        data: fd,
        headers: {
            // 地址带有 /my 的都得有'token' 里面的代码
            // 权限接口
            Authorization: localStorage.getItem('token')
        },
        // 注意！因为 fd 是FormData格式 所以得加以下两行代码
        contentType: false,
        processData: false,
        success: (res) => {
            console.log(res,1111)
            if (res.status !== 0) {
                return layui.layer.msg("发布失败")
            }
            location.href = '/article/art_list.html'
        }
    })
}


