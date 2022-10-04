$(function () {

    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        yespwd: (value) => {
            var oldpwd = $('[name=oldPwd]').val()
            if (value == oldpwd) {
                return ('新旧密码不能相同')
            }
        },
        repwd: (value) => {
            var newpwd = $('[name=newPwd]').val()
            if (value !== newpwd) {
                return ('两次密码不一致')
            }
        }
    })
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: 'http://big-event-api-t.itheima.net/my/updatepwd',
            method: 'post',
            data: $(this).serialize(),
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改密码成功!')
                $('.layui-form')[0].reset()
            }
        })
    })
})