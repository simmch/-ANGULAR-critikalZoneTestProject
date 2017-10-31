import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the GenresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-genres',
  templateUrl: 'genres.html',
})
export class GenresPage {

  genres: Array<any>;
  currentGenre: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private _data: DataProvider, private viewCtrl: ViewController) {

  this._data.getGenres()
    .subscribe(res => this.genres = res);

  }

  ionViewDidEnter(){ // When this view comes into play
    this.storage.get('genre').then((val) => {
      if (val)
        this.currentGenre = val.id;
        else
        this.currentGenre = 5;
    })

  }

  genreSelected(genre) {
    this.storage.set('genre', genre);
    this.viewCtrl.dismiss(genre); //when this is dismissed we're passing in above genre
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GenresPage');
  }

}
