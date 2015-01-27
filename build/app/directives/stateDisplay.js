/**
 * A directive class written in TypeScript.
 */
var StateDisplayDirective = (function () {
    function StateDisplayDirective($interval, states) {
        this.template = '<div class="state-label">{{ prefix }} {{ currentState }}</div>';
        this.restrict = 'E';
        this.replace = true;
        this.scope = {
            start: '='
        };
        this.$interval = $interval;
        this.states = states;
    }
    StateDisplayDirective.$inject = ["$interval", "states"];
    StateDisplayDirective.prototype.link = function (scope) {
        var _this = this;
        scope.prefix = this.states.getPrefix();
        scope.currentState = this.states.getNextState();
        scope.$watch('start', function (val) {
            if (val) {
                _this.$interval(function () { return scope.currentState = _this.states.getNextState(); }, 3000);
            }
        });
    };
    return StateDisplayDirective;
})();
register.directive('stateDisplay', StateDisplayDirective);