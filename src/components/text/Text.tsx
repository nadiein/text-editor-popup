import React, { Component } from 'react';
import { ApiService, RequestParams, TextModel, SynonymsModel, TextConfig } from '../../api/service';
import { EventType } from '../../utils/utils';
import { PopupPortal } from './../../portals/PopupPortal';
import { PopupModel, PopupFieldChangedType } from '../popup/Popup';

type MyProps = {};
type MyState = {
    model:TextModel,
    popup:PopupModel,
    isLoading:boolean,
    errorMessage:any,
};

export default class Text extends Component<MyProps, MyState> {
    private service:ApiService;
    private stateConfig:MyState;
    protected popupModel:PopupModel;
    private ref:any;

    get selectedText():any { return window.getSelection() }
    get selectedBoundingClientRect():DOMRect { return this.selectedText ? this.selectedText.getRangeAt(0).getBoundingClientRect() : null }

    constructor(service:ApiService) {
        super(service);
        this.service = new ApiService();
        this.state = {...this.stateConfig};
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);

        this.service.getData().subscribe(res => {
            this.setState({model: res, isLoading: false})
        })
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    getSynonimsForWord = (params:RequestParams) => {
        this.service.getSynonims(params).subscribe((res:SynonymsModel) => {
            this.popupModel.synonims = res.words;
            this.setState({ popup: this.popupModel})
        })
    }

    dispatchEvent = (event:any, type:EventType) => {
        const TOP_GAP = 15;
        switch(type) {
            case EventType.MouseUp: {
                if (this.selectedText.toString() != '') {
                    let params:RequestParams = new RequestParams();
                    params.word = this.selectedText;
                    if (this.selectedBoundingClientRect) {
                        this.popupModel = new PopupModel();
                        this.popupModel.x = this.selectedBoundingClientRect.x;
                        this.popupModel.y = this.selectedBoundingClientRect.y - (this.selectedBoundingClientRect.height + TOP_GAP);
                        this.popupModel.isOpen = true;
                        this.setState({ popup: this.popupModel })
                    }
                    this.getSynonimsForWord(params);
                }
                break;
            }
            case EventType.MouseDown: {
                break;
            }
        }
    }

    onSelectChange = (popupChanged:{type:PopupFieldChangedType, option:string}) => {
        const {model, popup} = this.state;
        if (this.selectedText && popup.synonims.length > 0) {
            this.initAndUpdateTextConfig(popupChanged);
            model.textConfig = this.initAndUpdateTextConfig(popupChanged);
            this.setState({model:model})

            let newElement = document.createElement('span');

            if (popupChanged.type == PopupFieldChangedType.Size) this.applyChangesToSelection(newElement, popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Weight) this.applyChangesToSelection(newElement, popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Style) this.applyChangesToSelection(newElement, popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Color) this.applyChangesToSelection(newElement, popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Synonim) this.applyChangesToSelection(newElement, popupChanged.type);
        }
    }

    applyChangesToSelection(element:HTMLElement, type:PopupFieldChangedType) {
        const {model} = this.state;
        switch(type) {
            // TODO finish styling via insert new node
            case PopupFieldChangedType.Size: {
                element.style.fontSize = model.textConfig.size;
                break;
            }
            case PopupFieldChangedType.Weight: {
                element.style.fontWeight = model.textConfig.weight;
                break;
            }
            case PopupFieldChangedType.Style: {
                element.style.fontStyle = model.textConfig.style;
                break;
            }
            case PopupFieldChangedType.Color: {
                element.style.color = model.textConfig.color;
                break;
            }
            case PopupFieldChangedType.Synonim: {
                let fragment = document.createDocumentFragment();
                this.selectedText.getRangeAt(0).deleteContents();
                element.textContent = model.textConfig.synonim;
                while ( element.firstChild ) {
                    fragment.appendChild(element.firstChild);
                }
                this.selectedText.getRangeAt(0).insertNode(fragment);
                break;
            }
        }
    }

    initAndUpdateTextConfig(popupChanged:{type:PopupFieldChangedType, option:string}):TextConfig {
        let config:TextConfig = new TextConfig();
        config.size = popupChanged.type == PopupFieldChangedType.Size ? popupChanged.option : '';
        config.weight = popupChanged.type == PopupFieldChangedType.Weight ? popupChanged.option : '';
        config.style = popupChanged.type == PopupFieldChangedType.Style ? popupChanged.option : '';
        config.color = popupChanged.type == PopupFieldChangedType.Color ? popupChanged.option : '';
        config.synonim = popupChanged.type == PopupFieldChangedType.Synonim ? popupChanged.option : '';
        return config;
    }

    setWrapperRef = (node:any) => { this.ref = node }

    handleClickOutside = (event:any) => {
        if (!event.target.offsetParent || event.target.offsetParent.className != 'popup-body') {
            if (this.popupModel) {
                this.popupModel.isOpen = false;
                this.setState({popup:this.popupModel});
            }
        }
    }

    // handle case with select component still exist when selection is empty

    render() {
        const {model, popup, isLoading, errorMessage} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {model && model.text ? model.text.map((item:any, id:any) => (
                    <li
                        ref={(e:any) => this.setWrapperRef(e)}
                        onDoubleClick={(e:any) => this.dispatchEvent(e, 0)}
                        onMouseDown={(e:any) => this.dispatchEvent(e, 1)}
                        onMouseUp={(e:any) => this.dispatchEvent(e, 2)}
                        key={id}>
                            {item}
                    </li>
                )) : errorMessage}
                <PopupPortal
                    model={popup}
                    optionChangedEvent={this.onSelectChange}
                    /*onRequestClose={() => this.setState({ isOpen: false })}*/>
                </PopupPortal>
            </div>
        )

    }
}
