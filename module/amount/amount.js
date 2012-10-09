/**
 * detail
 */
define(function (require, exports) {
    var Class = require('cellula').Class;
    var $ = require('$');
    var ModuleBase = require('mi.net.ModuleBase');
    var ASYNCSpect = require('ASYNCSpect');
    var Amount = new Class('Amount', {
        relay:true,
        render:function () {
            seajs.log('amount.render ing...');
            this.registerEvents();
        },
        refresh:function () {
            seajs.log('amount.refresh ing...');
            this.registerEvents();
            this.trigger('amountChange');
        },
        registerEvents:function(){
            var that = this;
            $('#J_refresh').click(function () {
                that.sync = false;
                that.refresh();
            })
        },
        _apiMap:{
            'mi.amount.render':'render',
            'mi.amount.refresh':'refresh'
        }
    }).inherits(ModuleBase);

    return Amount;
});