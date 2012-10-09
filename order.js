/**
 * order
 */
define(function(require, exports) {
    var Class = require('cellula').Class;
    var $ = require('$');
    var ModuleBase = require('mi.net.ModuleBase');
    var Order = new Class('Order', {
        relay:true,
        render:function() {
            var that = this;
            $('.detail-more a').html('更多详情').toggle(function() {
                $('#detail').html('订单详情正在加载中...');
                that.deliver({code : 'mi.detail.render',body:''});
                $(this).html('折叠详情');
            }, function() {
                that.showShortDetail();
                that.deliver({code : 'mi.detail.hide',body:''});
                $(this).html('更多详情');
            });

            $('.pay-button a.module').bind('click', function() {
                $(this).addClass("pay-disabled");
                $('#paySuccessTip').html('订单正在提交中...');
            });
            console.log('Order rendering')


        },
        hideShortDetail:function() {
            $('#detail').hide();
            $('#detailShort').hide();
        },
        showShortDetail:function() {
            $('#detail').show();
            $('#detailShort').show();
        },

        _apiMap : {
            'mi.order.render' : 'render',
            'mi.order.hideShortDetail' : 'hideShortDetail'
        }
    }).inherits(ModuleBase);

    return Order;
});