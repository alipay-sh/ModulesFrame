define(function (require, exports, module) {
    var util = require('cellula')._util;
    var ajaxQueue = {
        /**
         * {
         *     url:@String
         *     instance:@Object
         *     wait:@Array
         * }
         */
        queue:[],
        get:function (url) {
            var result;
            util.each(ajaxQueue.queue, function (value) {
                if (value.url === url) {
                    result = value;
                    return util.breaker;
                }
            }, undefined, util.breaker);
            return result;
        },
        remove:function (url) {
            var result = null;
            util.each(ajaxQueue.queue, function (value, index) {
                if (value.url === url) {
                    ajaxQueue.queue.splice(index, 1);
                    result = value;
                    return util.breaker;
                }
            }, undefined, util.breaker);
            return result;
        }
    };

    return ajaxQueue;
});