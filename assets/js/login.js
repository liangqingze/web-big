$(function () {
    // 点击注册
    $('#link-reg').click(function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击登录
    $('#link-login').click(function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    // 对登录 与 注册 的密码添加校验条件
    let form = layui.form
    let layer = layui.layer

    form.verify({
        // 给登录 与 注册 的密码添加条件
        'pwd': [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        // 取密码的值 与 确认密码进行 判断
        'repwd': (value) => {
            let pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) {
                return '密码不一致'
            }
        }
    })


    // // 注册：调用 post 接口 并 取账号密码 判断用户是否注册成功
    $('#form_reg').submit(function (e) {
        e.preventDefault()
        $.post('http://big-event-api-t.itheima.net/api/reguser', {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, (res) => {
            if (res.status !== 0) {
                return layer.msg('不行诶');
            }
            layer.msg('哥们牛逼注册成功了');
            $('#link-login').click()
        })
    })

     // 登录
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: 'http://big-event-api-t.itheima.net/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                localStorage.setItem('token',res.token) // 为方便后面获取信息
                location.href = './index.html'
            }
        })
    })
})