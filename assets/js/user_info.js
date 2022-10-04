$(function () {

    var form = layui.form

    form.verify({
        nickname: (value) => {
            if (value.length > 6) {
                return '名称长度必须在1-6之间!'
            }
        }
    })

    // 获取 基本 信息
    xinxi()
    function xinxi() {
        $.ajax({
            url: 'http://big-event-api-t.itheima.net/my/userinfo',
            method: 'get',
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败aa')
                }
                console.log(res)
                // 将 lay-filter 中 名为="container" 的值进行 渲染
                // res.data 里面的 值  对应 input 里面name 的 值
                layui.form.val('container', res.data)
                console.log(res.data)
            }
        })
    }

    // 重置
    $('#btnrest').click(function (e) {
        e.preventDefault()
        xinxi()
    })

    // 修改 用户信息
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: 'http://big-event-api-t.itheima.net/my/userinfo',
            method: 'post',
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改信息失败')
                }
                layui.layer.msg("成功了哦")
                window.parent.a()
                $('.layui-form')[0].reset()
            }
        })
    })
})
