import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  headers = new Headers({'user-key': 'b7f349749dbe84add173f10696d65fa8'});
  options = new RequestOptions ({headers: this.headers}); // Pass in options variable in requests to api since it has header
  limit: number = 50;

  constructor(public http: Http) {
    console.log('Hello DataProvider Provider');
  }

  getGames(genre, offset_num) {

    let genre_id = genre;
    let offset = offset_num;

    return this.http.get('/games/?fields=genres,name,release_dates,screenshots&limit='+this.limit+'&offset='+offset+'&order=release_dates.date:desc&filter[genres][eq]='+genre_id+'&filter[screenshots][exists]', this.options)
    .map(response => response.json());
  }

  getFavorites(favs) {
    let favorites = favs;
    favorites = favorites.join(); //takes array and convert it into strings by commas

    return this.http.get('/games/'+favorites+'/?fields=name,release_dates,screenshots&order=release_dates.date:desc&filter[screenshots][exists]', this.options)
    .map(response => response.json());
  }

  getGenres() {
    return this.http.get('/genres/?fields=*', this.options)
    .map(response => response.json());
  }

  searchGames(kw){

    let keyword = kw;

    return this.http.get('/games/?fields=name,release_dates,screenshots&limit='+this.limit+'&offset=0&search='+keyword+'&filter[screenshots][exists]', this.options)
    .map(response => response.json());
  }

  getGame(game) {
    let game_id = game;

    return this.http.get('/games/'+game_id+'?fields=*', this.options)
    .map(response => response.json());

  }

  getPerspective(perspective) {
    let persp_id = perspective;


    return this.http.get('/player_perspectives/'+persp_id+'?fields=*', this.options)
    .map(response => response.json());

  }

}
