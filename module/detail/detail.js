/**
 * detail
 */
define(function(require, exports) {
    var Class = require('cellula').Class;
    var $ = require('$');
    var ModuleBase = require('mi.net.ModuleBase');
    var Detail = new Class('Detail', {
        relay:true,
        render:function() {
            seajs.log('Detail.render ing');
            this.hide();
        },
        hide:function(){
            console.log('do mi.detail.hide');
            $(this.rootNode).hide();
        },
        show:function(){
            $(this.rootNode).show();
            $('#price').html(Number($('#price').html())+1);
            this.deliver({code : 'mi.order.hideShortDetail',body:''});
        },
        _apiMap : {
            'mi.detail.render' : 'render',
            'mi.detail.hide' : 'hide',
            'mi.detail.show' : 'show'
        }
    }).inherits(ModuleBase);

    return Detail;
});