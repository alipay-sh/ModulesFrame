define(function(require, exports, module) {
    var cellula = require('cellula');
    var mc = require('message');
    var $ = require("$");
    var ASYNCSpect = require('ASYNCSpect');
    /**
     * 模块抽象类，不被实例化
     */
    var ModuleBase = new cellula.Class('ModuleBase', {
        init:function(node) {
            this._super();
            node && (this.rootNode = node);
            this.registerInterface('deliver', mc);
            this.clean();
            //add aspect to module's api function
            ASYNCSpect.aspect(this);
            //relay表示用户触发，如果是用户触发，则不主动运行render入口
            if (!this.relay || this.sync) {
                this.render();
            }
        },
        render:function() {
        },
        clean:function() {
        },
        getApiMap:function() {
            return this._apiMap;
        },
        _apiMap : {},
        //modules:[],
        deliver : function() {
            this.applyInterface.apply(this, ['deliver'].concat(cellula._util.slice.call(arguments)));
        }
    }).inherits(cellula.Cell);
    

    /** 对外接口 */
    return ModuleBase;
})