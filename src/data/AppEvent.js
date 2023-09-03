//prettier-ignore
export default class AppEvent {

    static get LOADED_APP_THREE() { return 'loaded_app_three'; }
    static get LOADED_APP_3D() { return 'loaded_app_3d'; }
    static get LOADED_APP_2D() { return 'loaded_app_2d'; }
    static get LOADED_BASIC_COMP() { return 'loaded_basic_comp'; }

    static get AFTER_RENDER() { return 'after_render'; }
    static get BEFORE_RENDER() { return 'before_render'; }
    static get RESIZE() { return 'resize'; }

    static get BRIDGE_TO_LISTENER() { return 'bridge_to_listener'; }
    static get BRIDGE_FROM_LISTENER() { return 'bridge_from_listener'; }

    static get HIDE() { return 'hide_canvas_three'; }
    static get SHOW() { return 'show_canvas_three'; }

    static get FADE_IN() { return 'fade_in_canvas_three'; }
    static get FADE_OUT() { return 'fade_out_canvas_three'; }

}
