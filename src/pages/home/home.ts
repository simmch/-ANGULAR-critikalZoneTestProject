import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, Content } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';
import { GenresPage } from '../genres/genres';
import { Keyboard } from '@ionic-native/keyboard';
import { DetailsPage } from '../details/details';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
@ViewChild(Content) content: Content;
games = [];
genre: any;
genreName: string = "Upcoming Games"; // Top Left in Nav Shooter, Action, etc -> next to logo
favorites = [];
showSearch = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _data: DataProvider, private storage: Storage, public loading: LoadingController, public modalCtrl: ModalController, public keyboard: Keyboard) {
    let loader = this.loading.create({
      content: 'Getting Games..',
    });


loader.present().then(() => {

        this.storage.get('genre').then((val) => {
          if(val) {
            // console.log('Val is equal to ', val) testing purposes
            this.genre = val.id;
            this.genreName = val.name; // If in storage, the your preferred genre isn't set
          } else {
            this.genre = 5;
            this.genreName= 'Shooter';
            this.storage.set('genre', this.genre); //  Load default back to storage genre, which is 5
          }

          this._data.getGames(this.genre, 0).subscribe(res => this.games = res);

        });



        this.storage.get('favorites').then((val) => {
          if(!val) {
            this.storage.set('favorites', this.favorites);
          }
          else {
            this.favorites = val;
          }

        });
        setTimeout(() => {
          loader.dismiss();
        }, 1200);

    })
  }

  favorite(game) {
    this.favorites.push(game); //pushed the selected game from the array of games to this item
    this.favorites = this.favorites.filter(function(item, i, ar) {return ar.indexOf(item) === i;}); //gets rid of duplicate entries in an array
    this.storage.set('favorites', this.favorites);
    console.log(this.favorites);
  }

  removeFavorite(game) {
    this.favorites = this.favorites.filter(function(item) {
      return item !== game
    });
    this.storage.set('favorites', this.favorites);
  }


  openFavorites() {

    this.storage.get('favorites').then((val) => {

      this.genreName = 'Favorites';

      if (val.length != 0)
        this._data.getFavorites(val).subscribe(res => this.games = res);
        else
        this.games.length = 0;

    })

  }

  openGenres(){

    let myModal = this.modalCtrl.create(GenresPage);
    myModal.onDidDismiss(genre => {
      let loader = this.loading.create({
        content: 'One Moment...',
      });

      if(genre) {
        loader.present().then(() => {
          this.storage.get('genre').then((val) => {

            this.genre = val.id;
            this.genreName = val.name;

            this._data.getGames(this.genre, 0)
              .subscribe(res => this.games = res);
          });
        });


      }
      setTimeout(() => {
        loader.dismiss();
      }, 1200);

    });

    myModal.present();
  }

  showSearchBox() {
    this.showSearch = !this.showSearch; //when clicked turns true
    this.content.scrollToTop(); //keeps search box at top
  }

  search(term) {
    let search_term = term;
    this.keyboard.close(); //ionic cordova plugin add ionic-plugin-keyboard, then npm install --save @ionic-native/keyboard
    this.genreName = search_term;
    this.showSearch = false;
    this._data.searchGames(search_term).subscribe(res => this.games = res);
  }

  detailsPage(game){
    this.navCtrl.push(DetailsPage, {
      game: game
    })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
