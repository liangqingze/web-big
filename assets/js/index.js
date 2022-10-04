$(function () {
    a()

    $('#btout').click(function () {
        // 组件：弹出层-confirm
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
         function (index) {
            localStorage.removeItem('token')
            location.href = './login.html'
            layer.close(index); // 点击取消
        });
    })
})
function a() {  // 获取用户基本信息
    $.ajax({
        url: 'http://big-event-api-t.itheima.net/my/userinfo',
        method: 'get',
        headers: {  
            // 地址带有 /my 的都得有'token' 里面的代码
            // 权限接口
            Authorization: localStorage.getItem('token')
        },
        success: function (res) {
            if(res.status !== 0){
                return layui.layer.msg('获取信息失败')
            }
            b(res.data)
        },
        complete: (res)=>{
            // console.log(res.responseJSON.status)
            // 防止在地址上进入 index.html  页面
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    })
 

    // 点击资料 、更换头像 、 重置密码跳转对应的页面
   
}

function b(data) {
    var name = data.nickname || data.username
    $('#welcome').html(name)
    if (data.user_pic !== null) {
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', data.user_pic).show()
    } else {
        // name[0].toUpperCase()：将名字开头 大写
        $('.text-avatar').html(name[0].toUpperCase())
        $('.layui-nav-img').hide()
    }
}
