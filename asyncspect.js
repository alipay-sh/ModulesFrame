define(function (require, exports, module) {
    /**
     * VM Parser for Lazy Loading.
     * functions
     * 对暴露的方法做切面处理
     */
    var $ = require('$');
    var Aspect = require('mi.util.Aspect');
    var cellula = require('cellula');
    var ajaxQueue = {
        queue:[],
        call:function (module, callback, asyncspect) {
            var tmpAjax = ajaxQueue.getAjaxQueueByUrl(module.url);
            if (tmpAjax) {
                if (!$.isArray(tmpAjax.success)) {
                    tmpAjax.success = [tmpAjax.success];
                }
                tmpAjax.success.push(module[callback + '_Asyn']);
            } else {
                var tmpAjaxInstance = $.ajax({
                    url:module.url + ('?t=' + new Date().getTime()),
                    data:module.data,
                    type:module.method,
                    timeout:module.timeout,
                    dataType:module.dataType,
                    success:[function (response) {
                        ajaxQueue.delAjaxQueueByUrl(module.url);
                        if (module.dataType == 'text') {
                            $(module.rootNode).html($(response));
                            (module._fill_times) ? module._fill_times++ : (module._fill_times = 1);
                            //seajs.log(module.__cid__+' dom has been  fill,times='+module._fill_times)
                        }
                        asyncspect._execute(module, callback);
                        module.trigger('DOMLOADED', module);
                    }]
                });
                tmpAjaxInstance.url = module.url;
                ajaxQueue.queue.push(tmpAjaxInstance);
            }
        },
        getAjaxQueueByUrl:function (url) {
            var result = null;
            $.each(ajaxQueue.queue, function (index, value) {
                if (value.url == url) {
                    result = value;
                }
            });
            return result;
        },
        delAjaxQueueByUrl:function (url) {
            var result = null;
            $.each(ajaxQueue.queue, function (index, value) {
                if (value) {
                    if (value.url == url) {
                        ajaxQueue.queue.splice(index, 1);
                        //seajs.log('remove ajaxQueue :' + value.url);
                        result = value;
                    }
                }
            });
            return result;
        }
    };
    var asyncspect = {
        _init:function (module) {
            var node = module.rootNode;
            var config = {
                /** 是否已同步加载*/
                sync:!!node.attr('data-sync'),

                /** 数据请求返回类型html, text, script, xml, json, jsonp */
                // TODO should separate success func for different mime types
                dataType:node.attr('data-type') || 'text',

                /** 数据请求方式 get, post */
                method:node.attr('data-method') || 'get',

                /** 请求超时时间 */
                timeout:parseInt(node.attr('data-timeout')) || 0,

                /** 请求url */
                url:node.attr('href') || node.attr('data-url') || false

            };
            cellula._util.mix(module, config);
        },

        _execute:function (module, callback) {
            callback && module[callback + '_Asyn'] && (module[callback + '_Asyn']());
            asyncspect._clean(module);
        },

        _clean:function (config) {
            seajs.log('syncspect._clean:' + config.url);
            config.sync = true;
        },

        _load:function (config, callback) {
            if (!config.sync) {
                ajaxQueue.call(config, callback, asyncspect);
            } else {
                callback && config[callback + '_Asyn'] && (config[callback + '_Asyn']());
            }
        },
        /**
         * 对api暴露出来的方法，增加切面
         * @param module
         */
        aspect:function (module) {
            this._init(module);
            var api = module.getApiMap();
            Aspect(module);
            var that = this;

            for (var n in api) {
                if (module[api[n]]) {
                    module.before(api[n], function (method, context) {
                        that._load(context, method);
                    }, true);
                }
            }

        }

    };
    return asyncspect;
});