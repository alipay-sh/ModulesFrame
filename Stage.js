define(function (require, exports, module) {
    /**
     * Stage parse modules on page dom
     */
    var $ = require('$');
    var mcenter = require('message');
    var cellula = require('cellula');
    var moduleNameProp = 'data-module';
    var moduleSelector = '*['+moduleNameProp+']';
    var Stage = {
        modules:{},
        init:function (dom) {
            this._parseModulesByDom($(dom));
        },
        _parseModulesByDom:function (dom) {
            $(moduleSelector, dom).each(function (index, el) {
                var name = $(el).attr(moduleNameProp);
                seajs.use(name, function (mo) {
                    if (Stage.modules[name]) return;

                    var tmp = new mo({rootNode:$(el), key:$(el).attr('id')});

                    //To registration message center for the instance
                    mcenter.subscribe(tmp);
                    tmp.on('DOMLOADED', Stage._onModuleDomLoadedHandler);
                    //relay表示用户触发，如果是用户触发，则不主动运行render入口
                    if (!tmp.relay || tmp._conf.sync) tmp.render();
                    Stage.modules[name] = tmp;
                });
            });
        },
        _onModuleDomLoadedHandler:function (mod) {
            seajs.log(mod.__cid__ + " module's dom has loaded.");
            if (mod) {
                //Potential problem : deepCopy problem
                Stage._parseModulesByDom(mod.rootNode);
            }
        }
    };
    window.Stage = Stage;
    return Stage;
});