/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for doing so.
 */
class Annotations {

    constructor(appModule) {
        this.app = appModule;
        //this.$injector = $injector;
    }


    directive(name, constructorFn) {

        if (constructorFn.prototype.compile) {

            var originalCompileFn = this._cloneFunction(constructorFn.prototype.compile);

            // Decorate the compile method to automatically return the link method (if it exists)
            // and bind it to the context of the constructor (so `this` works correctly).
            // This gets around the problem of a non-lexical "this" which occurs when the directive class itself
            // returns `this.link` from within the compile function.
            this._override(constructorFn.prototype, 'compile', function (original) {
                return function () {
                    originalCompileFn.apply(this, arguments);

                    return constructorFn.prototype.link.bind(this);
                };
            });

        }
        
        var args = constructorFn.$inject || [];
        var factory = args.slice();
        factory.push((...args) => {
            return this._construct(constructorFn, args);
        });

        this.app.directive(name, factory);
    }

    controller(name, contructorFn) {
        this.app.controller(name, contructorFn);
    }

    service(name, contructorFn) {
        this.app.service(name, contructorFn);
    }

    /**
     * Clone a function
     * @param original
     * @returns {Function}
     */
    _cloneFunction(original) {
        return function() {
            return original.apply(this, arguments);
        };
    }

    /**
     * Override an object's method with a new one specified by `callback`.
     * @param object
     * @param methodName
     * @param callback
     */
    _override(object, methodName, callback) {
        object[methodName] = callback(object[methodName])
    }

    /**
     * This function allows us to call a constructor function with arbitrary arguments.
     * From http://stackoverflow.com/a/1608546/772859
     * @param constructor
     * @param args
     * @returns {Annotations._construct.F}
     * @private
     */
    _construct(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }

}