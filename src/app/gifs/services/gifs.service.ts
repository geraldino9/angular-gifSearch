import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SearchGifsResponse,
  Pagination,
  Gif,
} from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiKey: string = 'z29LuhQm9pxan7UR0VT7xKqlOrG83gUG';
  private _historial: string[] = [];
  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';
  //TODO: CAMBIAR ANY POR TIPO CORRESPONDIENTE
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }
  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse( localStorage.getItem('historial')! ) ;
    // }
  }

  buscarGifs(query: string) {
    query = query.toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    // fetch(
    //   'http://api.giphy.com/v1/gifs/trending?api_key=z29LuhQm9pxan7UR0VT7xKqlOrG83gUG&limit=10&q=dragon ball z'
    // ).then((response) => {
    //   response.json().then((data) => {
    //     console.log(data);
    //   });
    // });

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);
    // console.log('parametros', params.toString());

    this.http
      .get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((response) => {

        this.resultados = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
