import createClass from "./createClass";
declare const _default: {
    readonly Ryle: {
        <C extends string>(clause: C): import("./Ryle").Ryle<C>;
        register: typeof import("./Ryle").Ryle.register;
    };
    readonly createClass: typeof createClass;
};
export default _default;
