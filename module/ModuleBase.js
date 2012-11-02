define(function (require, exports, module) {
    var cellula = require('cellula');
    var util = cellula._util;
    var mc = require('message');
    var $ = require("$");
    var ajaxQueue = require('#ajaxQueue');
    /**
     * 模块抽象类，不被实例化
     */
    var ModuleBase = new cellula.Class('ModuleBase', {
        relay:false,
        _conf:{},
        init:function (cfg) {
            this._super(cfg);
            this._config();
            this.registerInterface('deliver', mc);
            this.clean();

            //add aspect to module's api function
            util.each(this._mcMap,function(v){
                if(this[v]) util.aspect(this).wrap(v, this._load);
            }, this);
        },
        _config:function () {
            var conf = {},el = this.rootNode;
            if (!el || !el.attr) return conf;
            conf.sync = !/(async)/.test(el.attr('data-mode'));
            conf.url = el.attr('data-url') || '';
            conf.type = el.attr('data-type') || 'text';
            conf.method = el.attr('data-method') || 'get';
            conf.timeout = el.attr('data-timeout') || 0;
            this._conf = conf;
        },
        _load:function () {
            var module = this, _origin = this._origin, conf = module._conf;
            if (!conf.sync) {
                var tmpAjax = ajaxQueue.get(conf.url), args = arguments, tmpCall;

                if (tmpAjax) {
                    return tmpAjax.wait.push(function(response){
                        return _origin.apply(module, args);
                    });
                } else {
                    tmpAjax = {url:conf.url,wait:[]};
                    ajaxQueue.queue.push(tmpAjax);
                    var cbs = function (response) {console.log('sus');
                        while (tmpCall = tmpAjax.wait.shift()) tmpCall.call(module, response);
                    };
                    tmpAjax.wait.push(function (response) {
                        return module._loadSuccess.call(module, response, _origin, args);
                    });
                    tmpAjax.instance = $.ajax({
                        url:conf.url + ('?t=' + new Date().getTime()),
                        context:module,
                        type:conf.method,
                        timeout:conf.timeout,
                        dataType:conf.type,
                        success:cbs
                    });
                    console.log('sus2');
                }
            } else {
                return _origin.apply(this, arguments);
            }
        },
        _loadSuccess:function(resp, _origin, args){
            var conf = this._conf;
            ajaxQueue.remove(conf.url);
            if (conf.type == 'text') this.rootNode.html($(resp));

            conf.sync = true;
            this.trigger('DOMLOADED', this);
            return _origin.apply(this, args);
        },
        clean:function () {},
        getApiMap:function () {
            return this._mcMap;
        },
        _mcMap:{},
        deliver:function () {
            this.applyInterface.apply(this, ['deliver'].concat(util.slice.call(arguments)));
        }
    }).inherits(cellula.Cell);


    /** 对外接口 */
    return ModuleBase;
});