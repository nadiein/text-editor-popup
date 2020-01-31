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

            if (popupChanged.type == PopupFieldChangedType.Size) this.applyChangesToSelection(popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Weight) this.applyChangesToSelection(popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Style) this.applyChangesToSelection(popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Color) this.applyChangesToSelection(popupChanged.type);
            if (popupChanged.type == PopupFieldChangedType.Synonim) this.applyChangesToSelection(popupChanged.type);
        }
    }

    applyChangesToSelection(type:PopupFieldChangedType) {
        const {model} = this.state;

        let newElement = document.createElement('span');
        let fragment = document.createDocumentFragment();
        let currentText = this.selectedText.toString();
        switch(type) {
            // TODO finish styling via insert new node
            case PopupFieldChangedType.Size: {
                newElement.textContent = currentText;
                // TODO hoockup size changes
                console.log(model.textConfig.size)
                newElement.style.fontSize = model.textConfig.size;
                break;
            }
            case PopupFieldChangedType.Weight: {
                newElement.textContent = currentText;
                newElement.style.fontWeight = model.textConfig.weight;
                break;
            }
            case PopupFieldChangedType.Style: {
                newElement.textContent = currentText;
                newElement.style.fontStyle = model.textConfig.style;
                break;
            }
            case PopupFieldChangedType.Color: {
                newElement.textContent = currentText;
                // TODO hookup color changes
                console.log(model.textConfig.color)
                newElement.style.color = model.textConfig.color;
                break;
            }
            case PopupFieldChangedType.Synonim: {
                newElement.textContent = model.textConfig.synonim;
                break;
            }
        }
        // while ( newElement.firstChild ) {
        //     fragment.appendChild(newElement.firstChild);
        // }
        this.selectedText.getRangeAt(0).deleteContents();
        this.selectedText.getRangeAt(0).insertNode(newElement);
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
