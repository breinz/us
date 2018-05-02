interface IAction {
    /**
     * Title
     */
    title:string,

    /**
     * Function to call when this action is triggered
     */
    fct: Function,

    /**
     * Shape to display
     */
    shape: PIXI.Container
}

export default IAction;