/**
 * 主程序
 */
define(function(require, exports) {
    var Class = require('cellula').Class;
    var $ = require('$');
    var ModuleBase = require('mi.net.ModuleBase');

    var Main = new Class('Main', {
        relay:false,
        render:function() {
            //start load
            var that = this;
            $('#J_getOrder').click(function(el){
                that.deliver({code : 'mi.order.render',body:{}});
                //that.deliver({code : 'mi.order.render',body:{}});
                $('#orderContainer').removeClass('load-order');
                $('#J_getOrder').remove();
            })
        },
        _apiMap : {
            'mi.main.render' : 'render'
        }
    }).inherits(ModuleBase);
    return Main;
});