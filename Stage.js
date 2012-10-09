define(function(require, exports, module) {
    /**
     * Stage parse modules on page dom
     */
    var $ = require('$');
    var mcenter = require('message');
    var cellula = require('cellula');
    var moduleClassName = ".module";
    var Stage = {
        modules:{},
        _init:function() {
            this._parseModulesByDom($(document.body))
        },
        _parseModulesByDom:function(dom) {
            var tmpChildMod=[];
            $(moduleClassName, dom).each(function(index, el) {
                seajs.use($(el).attr('data-module'), function(mo) {
                    if(Stage.modules[$(el).attr('data-module')]){
                        return tmpChildMod
                    }
                    var tmp = new mo($(el));
                    //To registration message center for the instance
                    mcenter.subscribe(tmp);
                    tmp.on('DOMLOADED', Stage.onModuleDomLoadedHandler);
                    seajs.log('A new module has been bulid. cid = ' + tmp.__cid__);
                    Stage.modules[$(el).attr('data-module')]=tmp;
                });
            });
            return tmpChildMod;
        },
        onModuleDomLoadedHandler:function(mod) {
            seajs.log(mod.__cid__ + " module's dom has loaded.");
            if (mod) {
                //Potential problem : deepCopy problem
                $.each(Stage._parseModulesByDom(mod.rootNode),function(index,value){
                    mod.modules.push(value);
                })
            }
        },
        getModuleById:function(id) {

            return null;
        },
        deleteModuleById:function() {
            return null;
        },
        run:function() {
            this._init();
        }

    };
    return Stage;
});