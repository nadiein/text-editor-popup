import { ajax } from 'rxjs/ajax';
import { Observable, from, of } from 'rxjs';
import { catchError, map, toArray, switchMap, mergeMap, pluck, concatMap } from 'rxjs/operators';

export const BASE_TEXT_URL = 'https://baconipsum.com/api/?type=meat-and-filler';
export const BASE_SYNONIMS_URL = 'https://api.datamuse.com//words?rel_trg=';

const corsHeader = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
}

const postHeader = { 'Content-Type': 'application/json;charset=UTF-8' }

const http = (endpoint:string, method:string, headers:any, body:any=null) => ajax({
    url: endpoint,
    method: method.toUpperCase(),
    headers: headers,
    crossDomain: true,
    body: body ? body : null
})

const handleError = (operation:string='operation', result?:any) => {
    return (error: any): Observable<any> => {
        return of(result);
    }
};

const uuid = () => 'xxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0;
    let v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

export class ApiService {

    getData():Observable<TextModel> {
        return http(BASE_TEXT_URL, 'get', null).pipe(
            map(res => res.response),
            switchMap(item => of(item)),
            toArray(),
            map(item => {
                let model = new TextModel();
                let tid = uuid();
                model.text = item;
                model.tid = tid;
                return model;
            }),
            catchError(handleError('Error loading block'))
        )
    }

    getSynonims(params:RequestParams):Observable<SynonymsModel[]> {
        let url = `${BASE_SYNONIMS_URL + params.word}`;

        if (params.word !== '') {
            return http(url, 'get', null).pipe(
                map(res => res.response ),
                switchMap(items => from(items).pipe(pluck('word'))),
                toArray(),
                map(item => {
                    let synonims = new SynonymsModel();
                    synonims.words = item;
                    return synonims;
                }),
                catchError(handleError('Error loading block')),
            )
        }
    }
}

export class TextModel {
    tid:string = '';
    text:any = '';
    editedText:string = '';
    textConfig:TextConfig = new TextConfig();
}

export class TextConfig {
    color:string = '';
    style:string = '';
    size:number = null;
    weight:number = null;
}

export class TextDto {
    text:string;
}

export class RequestParams {
    word:string;
}

export class SynonymsModel {
    words:any[] = [];
}