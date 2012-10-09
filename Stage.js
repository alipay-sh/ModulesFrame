define(function (require, exports, module) {
    /**
     * Stage parse modules on page dom
     */
    var $ = require('$');
    var mcenter = require('message');
    var cellula = require('cellula');
    var moduleClassName = ".module";
    var Stage = {
        modules:{},
        _unbindEvents:[],
        _init:function () {
            this._parseModulesByDom($(document.body))
        },
        _parseModulesByDom:function (dom, mod) {
            $(moduleClassName, dom).each(function (index, el) {
                seajs.use($(el).attr('data-module'), function (mo) {
                    if (Stage.modules[$(el).attr('data-module')]) {
                        return;
                    }
                    var tmp = new mo($(el));
                    //To registration message center for the instance
                    mcenter.subscribe(tmp);
                    tmp.on('DOMLOADED', Stage._onModuleDomLoadedHandler);
                    //seajs.log('A new module has been bulid. cid = ' + tmp.__cid__);
                    Stage.modules[$(el).attr('data-module')] = tmp;

                    Stage._scanUnbindEvents();
                    //mod && mod.modules.push(tmp);
                });
            });
            return;
        },
        /**
         * 扫描未绑定的模块事件
         * @private
         */
        _scanUnbindEvents:function () {
            for (var i = 0; i < Stage._unbindEvents.length; i++) {
                var item = Stage._unbindEvents[i];
                var tmpModule = Stage.getModuleByClassName(item.modName);
                if (tmpModule) {
                    tmpModule.on(item.event, Stage._unbindEvents[i].handler, tmpModule);
                    Stage._unbindEvents.splice(i, 1);
                }
            }
        },
        _onModuleDomLoadedHandler:function (mod) {
            seajs.log(mod.__cid__ + " module's dom has loaded.");
            if (mod) {
                //Potential problem : deepCopy problem
                Stage._parseModulesByDom(mod.rootNode, mod);
            }
        },
        getModuleByClassName:function (name) {
            return Stage.modules[name];
        },
        deleteModuleByClassName:function (name) {
            return null;
        },
        /**
         * 为模块实例添加事件注册
         * @param moduleName  模块类名，因为模块都是单例，所以使用模块类名指向模块实例
         * @param eventName 事件名
         * @param handler 响应
         */
        registerModuleEvents:function (moduleName, eventName, handler) {
            var tmpModule = Stage.getModuleByClassName(moduleName)
            if (tmpModule) {
                tmpModule.on(eventName, handler, tmpModule);
            } else {
                Stage._unbindEvents.push({modName:moduleName, event:eventName, handler:handler});
            }
        },
        run:function () {
            this._init();
        }

    };
    window.Stage = Stage;
    return Stage;
});