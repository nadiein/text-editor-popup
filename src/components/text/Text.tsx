import React, { Component } from 'react';
import { ApiService, RequestParams } from '../../api/service';
import { EventDispatcher, EventType } from '../../utils/utils';

type MyProps = {};
type MyState = {
    model: any,
    synonims: any,
    isLoading: any,
    errorMessage: any,
};

export default class Text extends Component<MyProps, MyState> {
    public service:ApiService;
    public stateConfig:MyState;

    constructor(service:ApiService) {
        super(null);
        this.service = new ApiService();
        this.state = {...this.stateConfig};
    }

    componentDidMount = () => {
        this.service.getData().subscribe(res => {
            console.log(res)
            this.setState({model: res, isLoading: false})
        })
    }

    getSynonimsForWord = (params:RequestParams) => {
        this.service.getSynonims(params).subscribe(res => {
            console.log('synonims', res);
            this.setState({synonims: res})
        })
    }

    dispatchEvent = (event: any,type:EventType) => {
        switch(type) {
            case EventType.DblClick: {
                console.log('dbl');
                break;
            }
            case EventType.MouseDown: {
                break;
            }
            case EventType.MouseUp: {
                let params:RequestParams = new RequestParams();
                params.word = this.getSelection();
                if (params.word !== '') {
                    this.getSynonimsForWord(params);
                }
                break;
            }
        }
    }

    getSelection = () => {
        let selection:string = '';

        if (window.getSelection) selection = window.getSelection().toString();

        return selection;
    }

    render() {
        const {model, synonims, isLoading, errorMessage} = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {model && model.text ? model.text.map((item:any, id:any) => (
                    <li
                        onDoubleClick={(e:any) => this.dispatchEvent(e, 0)}
                        onMouseDown={(e:any) => this.dispatchEvent(e, 1)}
                        onMouseUp={(e:any) => this.dispatchEvent(e, 2)}
                        key={id}>
                            {item}
                    </li>
                )) : errorMessage}
                <ul>
                    {synonims && synonims.words ? synonims.words.map((item:any, id:any) => (
                        <li key={id}>
                            {item}
                        </li>
                    )) : errorMessage}
                </ul>
            </div>
        )

    }
}
