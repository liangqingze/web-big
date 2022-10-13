$(function () {
    // 时间过滤器
    template.defaults.imports.sj = function (date) {
        const dt = new Date(date)

        var n = dt.getFullYear()
        var y = ling(dt.getMonth() + 1)
        var r = ling(dt.getDate())

        var s = ling(dt.getHours())
        var f = ling(dt.getMinutes())
        var m = ling(dt.getSeconds())

        return n + '-' + y + '-' + r + ' ' + s + ':' + f + ':' + s
    }

    // 定义补零的函数
    function ling(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个参数,请求的时候把他提交到服务器
    var q = {
        pagenum: 1,  // 页数
        pagesize: 2,  // 每页显示 2 条数据
        cate_id: '',  // 文章分类的id
        state: '',  // 发布文章的状态
    }


    list()
    fl()

    // 获取分类列表 渲染
    function list() {
        $.ajax({
            method: 'get',
            url: 'http://big-event-api-t.itheima.net/my/article/list',
            data: q,
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败')
                }
                // console.log('渲染文章列表成功', res)
                var ccc = template('table', res)
                $('tbody').html(ccc)
                feny(res.total)
            }
        })
    }

    // 渲染分页
    function feny(shu) {
        // layui 插件
        layui.laypage.render({
            elem: 'fenye',    // html 中的id
            count: shu,       // 数据的总条数
            limit: q.pagesize,// 每行显示多少条数据
            curr: q.pagenum,   // 默认选中第几页
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits: [2, 4, 6, 7],
            // 触发 jump 回调有两种
            // 1.点击页码  触发 jump 回调
            // 2.调用layui.laypage.render  触发jump回调
            jump: function (obj, first) {
                // 每页显示的条数
                q.pagesize = obj.limit
                // 可以通过 first 的值判断是怎么触发的
                // console.log(obj)
                // 点击分页的哪个 数字 就跳到当前指定的哪个页数
                q.pagenum = obj.curr
                // 将页数的值带进去 并重新渲染list()
                //首次不执行
                if (!first) {
                    list()
                }
            }
        });
    }


    // 获取分类  渲染
    function fl() {
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
                    return layui.layer.msg('渲染分类失败')
                }
                var value = template('fenl', res)
                // console.log(res)
                $('#list').html(value)

                // 第一遍渲染不出效果
                // 加上这个 = 重新渲染
                layui.form.render()
            }
        })
    }

    // 点击筛选
    $('#sx').on('submit', function (e) {
        e.preventDefault()
        cate_id = $('[name=cate_id]').val()
        state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 带着 id 与 状态去重新渲染 list()
        list()

        // 第一遍渲染不出效果
        // 加上这个 = 重新渲染
        layui.form.render()
    })

    // 点击删除
    $('tbody').on('click', '#delete', function (e) {
        var id = $(this).attr('data-id')
        console.log(id)
        $.ajax({
            method: 'get',
            url: 'http://big-event-api-t.itheima.net/my/article/delete/' + id,
            headers: {
                // 地址带有 /my 的都得有'token' 里面的代码
                // 权限接口
                Authorization: localStorage.getItem('token')
            },
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('删除失败')
                }
                layui.layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
                    list()          // 点击确认
                    layer.close(index); // 点击取消
                });

            }
        })
    })

    // 点击编辑
    $('body').on('click', '#book_add', function (e) {
        var id = $(this).attr('data-id')
        location.href = '/../article/art_bianj.html?id=' + id
    })
})