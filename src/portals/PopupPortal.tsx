import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Popup, PopupModel } from './../components/popup/Popup';

type MyProps = {
    model:PopupModel,
    optionChangedEvent:Function
    // onRequestClose:Function
};

export class PopupPortal extends Component<MyProps> {
    public element:any;

    static defaultProps = {
        isOpen: false
    }

    constructor(props:any) {
        super(props);
        this.element = document.createElement('div');
    }

    componentDidMount() {
        // The portal element is inserted in the DOM tree after
        // the Modal's children are mounted, meaning that children
        // will be mounted on a detached DOM node. If a child
        // component requires to be attached to the DOM tree
        // immediately when mounted, for example to measure a
        // DOM node, or uses 'autoFocus' in a descendant, add
        // state to Modal and only render the children when Modal
        // is inserted in the DOM tree.
        document.getElementById('modal-root').appendChild(this.element);
    }

    componentWillUnmount() {
        document.getElementById('modal-root').removeChild(this.element);
    }

    render() {
        return ReactDOM.createPortal(<Popup {...this.props} />, this.element);
    }
}