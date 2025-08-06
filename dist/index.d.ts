import createClass from "./createClass";
import Ryle from "./Ryle";
declare const _default: {
    readonly Ryle: {
        <C extends string>(clause: C): import("./Ryle").Ryle<C>;
        register: typeof import("./Ryle").Ryle.register;
        trigger: typeof import("./Ryle").Ryle.trigger;
    };
    readonly createClass: typeof createClass;
};
export default _default;
export { Ryle, createClass };
