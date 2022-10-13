$(function () {
    // 把点击编辑的id拿过来
    var param = new URLSearchParams(location.search)
    var bjId = param.get('id')
    console.log('点击编辑的id=', bjId)



    fenlei()

    var zhuantai = '已发布' // 状态 = 已发布

    function fenlei() {
        $.ajax({
            url: 'http://big-event-api-t.itheima.net/my/article/cates',
            method: 'get',
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类失败')
                }
                var Str = template('table', res)
                $('[name=cate_id]').html(Str)
                layui.form.render()
                xuanran()
            }
        })
    }

    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
        // 初始化图片裁剪大小
        autoCropArea: 1
    }
    $image.cropper(options)

    function xuanran() {
        $.ajax({
            method: 'get',
            url: 'http://big-event-api-t.itheima.net/my/article/' + bjId,
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('id获取内容失败')
                }
                console.log(res)
                layui.form.val('go', {
                    Id: res.data.Id,
                    cate_id: res.data.cate_id,
                    title: res.data.title,
                    content: res.data.content
                });
                initEditor()    // 编辑器
                $('#image').attr('src', 'http://big-event-api-t.itheima.net' + res.data.cover_img)
            }
        })
    }

    // 点击封面
    $('#fengmian').click(function (e) {
        $('#wenj').click()
    })

    $('#wenj').change(function (e) {
        var file = e.target.files
        console.log(file)
        if (file.length === 0) {
            return layui.layer.msg('请选择文件')
        }
        // var $image = $('#image')
        var newImgURL = URL.createObjectURL(file[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 状态修改
    $('#caogao').on('click', function () {
        zhuantai = '草稿'
    })

    // 发布
    $('#genx').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])  // FormData 格式

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('state', zhuantai)
                fd.append('cover_img', blob)
                console.log(fd)
                $.ajax({
                    method: 'post',
                    url: 'http://big-event-api-t.itheima.net/my/article/edit',
                    data: fd,
                    contentType: false,
                    processData: false,
                    headers: {
                        // 地址带有 /my 的都得有'token' 里面的代码
                        // 权限接口
                        Authorization: localStorage.getItem('token')
                    },
                    success: (res) => {
                        if (res.status !== 0) {
                            return layui.layer.msg('编辑失败')
                        }
                        location.href = '/../article/art_list.html'
                    }
                })
            })
    })
})
