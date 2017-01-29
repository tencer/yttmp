import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Image,
  View,
  ScrollView,
  ListView,
  TouchableHighlight,
  TextInput,
  Linking,
  Keyboard,
} from 'react-native'


class VideoRow extends Component {
   constructor(props) {
     super(props);
   }
  onWatchPressed(videoID) {
    let videoLink = "https://www.youtube.com/watch?v=" + this.props.video;
    Linking.openURL(videoLink).catch(err => console.error('An error occurred', err));
  }
  onDownloadPressed() {
    let videoLink = "http://www.youtubeinmp3.com/fetch/?video=https://www.youtube.com/watch?v=" + this.props.video;
    Linking.openURL(videoLink).catch(err => console.error('An error occurred', err));    
  }

  render() {
     let pic = {
       uri: this.props.imgsrc
     };
    return (
      <View style={{borderTopWidth:1,alignItems:'flex-start', flex: 1, flexDirection: 'row', padding: 5, height: 80}}>        
        <Image source={pic} style={{alignSelf:'center', width: 90, height: 74, padding:2}}></Image>
        <View style={{justifyContent:'flex-start', margin:0,flex: 3, flexDirection: 'column', padding: 0, height: 80}}>        
          <Text style={{color:"black",borderWidth: 0,fontWeight:'bold', height: 38, flex: 0, fontSize:16,margin: 2,marginTop:0}} numberOfLines={2} ellipsizeMode='tail'>{this.props.text}</Text>
          <Text style={{borderWidth: 0,height: 36, flex: 0, fontSize:12, margin: 2,marginTop:0}} ellipsizeMode='tail' numberOfLines={2} >{this.props.description}</Text>
        </View>
        <View style={{flex: 0, flexDirection: 'column', padding: 0,width:74, height: 70}}>        
        <TouchableHighlight style={{borderWidth: 1,
                                    borderColor: "black",
                                    borderRadius: 3,                                    
                                    backgroundColor: "rgba(250,30,50,1)",
                                    top:0,
                                    right:0,
                                    padding: 2,
                                    width:70, 
                                    height: 30, 
                                    flexDirection: 'column',
                                    justifyContent: 'center'}} onPress={this.onWatchPressed.bind(this)} >          
          <Text style={{fontWeight:'bold',color: "white"}}>Watch</Text>
        </TouchableHighlight>
        <TouchableHighlight style={{borderWidth: 1,
                                    borderColor: "black",
                                    borderRadius: 3,                                    
                                    backgroundColor: "rgba(10,200,30,1)",
                                    top:5,
                                    right:0,
                                    padding: 2,
                                    width:70, 
                                    height: 30, 
                                    flexDirection: 'column',
                                    justifyContent: 'center'}} onPress={this.onDownloadPressed.bind(this)} >          
          <Text style={{fontWeight:'bold',color: "white"}}>Download</Text>
        </TouchableHighlight>
        </View>
      </View>
    );
  }
}

class yttmp extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([        
      ]),
      text : ""
    };
  }
  
  getMoviesFromApiAsync() {    
    //return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&q=shake+it+off&type=video&maxResults=20&key=AIzaSyA4ot4vAIWkHRLowYXqLfOlBfPqn5Cpr1k')
    var qString = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + this.state.text + '&type=video&maxResults=20&key=AIzaSyA4ot4vAIWkHRLowYXqLfOlBfPqn5Cpr1k'
    return fetch(qString)    
      .then((response) => response.json())
      .then((responseJson) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({  
          dataSource : ds.cloneWithRows(responseJson.items),
        });
        //return responseJson.movies;        
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  onSearchPressed() {
    Keyboard.dismiss();    
    this.getMoviesFromApiAsync();
    //scroll list to top
    this.refs._scrollView.scrollTo({x:0,y:0,animated:true});
  }
  
  render() {
    return (
      <View style={{backgroundColor:"rgba(50,50,50,1)",flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
        <ListView
          style={{backgroundColor:"rgba(222,222,222,1)"}}
          enableEmptySections={true}
          ref='_scrollView'
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <VideoRow video={rowData.id.videoId} description={rowData.snippet.description} imgsrc={rowData.snippet.thumbnails.default.url} text={rowData.snippet.title} />}
        />
        <View style={{backgroundColor:"rgba(30,30,30,1)",alignItems:'center' ,padding:10, height: 50, flexDirection: 'row'}} >
           <TextInput 
             autoFocus={true}
             underlineColorAndroid="transparent"
            style={{
              backgroundColor:"rgba(250,250,250,1)",
              height:  36 , 
              width: 200,
              flex: 1,
              borderWidth: 0,
              borderColor: "rgba(0,0,0,0.5)",
              borderRadius: 3,
            }}
            placeholder={'Search songs to download'}
            placeholderTextColor={"rgba(50,50,50,1)"}
            onChangeText={(text) => {this.setState({text})}}
            onSubmitEditing={() => {this.setState({text: ''})}}
            value={(this.state && this.state.text) || ''}
          />
        <TouchableHighlight style={{borderWidth: 1,
                                    borderColor: "black",
                                    backgroundColor: 'powderblue',
                                    borderRadius: 3,                                    
                                    width:65, 
                                    height: 38,                                     
                                    top:0,
                                    right:0,
                                    padding: 5,
                                    margin:5,
                                    flexDirection: 'column',
                                    justifyContent: 'center'}} onPress={this.onSearchPressed.bind(this)} >          
          <Text style={{fontWeight:'bold',color:"black"}}>Search</Text>
        </TouchableHighlight>
         
          </View>
      </View>
      
    );
  }
}

AppRegistry.registerComponent('yttmp', () => yttmp);
