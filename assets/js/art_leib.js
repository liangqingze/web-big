$(function () {
    leibie()
    function leibie() {
        $.ajax({
            method: 'get',
            url: 'http://big-event-api-t.itheima.net/my/article/cates',
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.confirm('获取列表信息失败')
                }
                var data_value = template('table', res)
                $('tbody').html(data_value)
            }
        })
    }

    // 点击 添加类别
    $('#add').click(function () {
        // 弹出层
        var index = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#tianjia').html()
        });
    })

    // 因为 这个 按钮是在点击 添加类别之后才有的
    // 所以得以 以下方式来绑定点击事件
    $('body').on('submit', '#form', function (e) {
        console.log(e)
        e.preventDefault()
        $.ajax({
            url: 'http://big-event-api-t.itheima.net/my/article/addcates',
            method: 'POST',
            data: $(e.target).serialize(),
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg("添加类别失败")
                }
                leibie()
                // layui.layer.close()：关闭添加类别的弹出层
                layui.layer.close(layui.layer.index)
                layui.layer.msg('添加成功！')
            }
        })
    })


    // 编辑
    $('tbody').on('click','#book_add', function (e) {
        console.log('niuma')
        bj = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#bianji').html()
        });
        var id = $(e.target).attr('data-id')  // 获取到当前的id
        $.ajax({
            method: 'get',
            url: 'http://big-event-api-t.itheima.net/my/article/cates/' + id,
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取id失败')
                }
                layui.form.val('form_bianji', res.data)
            }
        })
    })

    // 点击编辑里面的修改 
    $('body').on('submit', '#form_bianji', function (e) {
        e.preventDefault()
        // console.log(e.target)
        $.ajax({
            method: 'post',
            url: 'http://big-event-api-t.itheima.net/my/article/updatecate',
            data: $(e.target).serialize(),
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('编辑信息失败')
                }
                leibie()
                layui.layer.msg('编辑成功！')
                layui.layer.close(bj)
            }
        })
    })

    $('tbody').on('click','#delete',function(e){
        var id = $(this).attr('data-id')
        $.ajax({
            method:'get',
            url:'http://big-event-api-t.itheima.net/my/article/deletecate/'+id,
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success:(res)=>{
                if(res.status !== 0){
                   return layui.layer.msg('删除失败！')
                }
                layer.confirm('确定删除吗?', {icon: 3, title:'提示'}, function(index){
                    leibie()
                    layui.layer.msg('删除成功！')
                    layer.close(index);
                  });
            }
        })
    })
})