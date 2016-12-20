function tesLayer(opts) {
    var opt = $.extend({
        title: '回填委托单号',
        type: 1,
        skin: 'tes-layer',
        area: ['520px', 'auto'], //宽高
        content: ''
    },opts)
    return layer.open(opt); 
}
function replay() {
    tesLayer({
        content:$.template('temp_replay')({}),
        area: ['520px', 'auto'], //宽高
        btn: ['确定', '取消'],
        yes: function(index, layero){
            alert("确定")
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    })
}
function view() {
    tesLayer({
        title: '查看状态',
        content:$.template('temp_view')({})
    })
}
function recharge() {
    tesLayer({
        title: '充值',
        content:$.template('temp_recharge')({}),
        btn: ['确定充值'],
        yes: function(index, layero){
            alert("确定充值")
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    })
}
function pay() {
    tesLayer({
        title: '付费',
        content:$.template('temp_pay')({}),
        btn: ['付费','关闭'],
        yes: function(index, layero){
            alert("付费")
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        }
    })
}
function assess() {
    tesLayer({
        title: '评价',
        content:$.template('temp_access')({}),
        btn: ['保存','关闭'],
        yes: function(index, layero){
            alert("保存")
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        },
        success: function() {
            $("#services").raty({
                starOff: 'assets/images/off.png',
                starOn : 'assets/images/on.png',
                width: 125,
                hints: ['1分','2分','3分','4分','5分'],
                click: function(score) {
                    alert(score+"分");
                }
            });
            $("#aging").raty({
                starOff: 'assets/images/off.png',
                starOn : 'assets/images/on.png',
                width: 125,
                hints: ['1分','2分','3分','4分','5分'],
                click: function(score) {
                    alert(score+"分");
                }
            });
        }
    })
}


var $replay = $("#J_replay")
,   $view = $("#J_view")
,   $recharge = $("#J_recharge")
,   $pay = $("#J_pay")
,   $assess = $("#J_assess")

$replay.on("click", replay)
$view.on("click", view)
$recharge.on("click", recharge)
$pay.on("click", pay)
$assess.on("click", assess)