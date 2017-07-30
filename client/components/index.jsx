import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
const time = 1000;

class Index extends Component {

	constructor(props){
		super(props);
		this.state = {
			backgroundOne: {photo: null, text: null, active: true}, 
			backgroundTwo: {photo: null, text: null, active: false},
			canClick: true,
			loading: false,
			imageLoaded: false
		}
	}
	
	componentDidMount(){
		this.getResources((first) => {
			this.getResources((second) => {
				var backgroundOne = this.state.backgroundOne;
				backgroundOne.photo = first.photo;
				backgroundOne.text = first.text;
				var backgroundTwo = this.state.backgroundTwo;
				backgroundTwo.photo = second.photo;
				backgroundTwo.text = second.text;
				this.forceUpdate();
			});
		});
	}
	
	getResources(cb){
		this.request('/photo', (photoData) => {
			this.request('/quote', (quoteData) => {
				cb({photo: photoData.photo, text: quoteData.quoteText});
			});
		});
	}
	
	request(url, cb){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", url, false );
		xmlHttp.send( null );
		
		var data = JSON.parse(xmlHttp.responseText);
		
		cb(data);
	}
	
	clickFunction(){
		if(this.state.canClick && this.state.imageLoaded){
			this.setState({canClick: false, loading: true, imageLoaded: false});
			var backgroundOne = this.state.backgroundOne;
			backgroundOne.active = !backgroundOne.active;
			var backgroundTwo = this.state.backgroundTwo;
			backgroundTwo.active = !backgroundTwo.active;
			this.forceUpdate();
			setTimeout(() =>{
				this.getResources( (data) => {
					var background = null;
					backgroundOne.active ? background = backgroundTwo : background = backgroundOne;
					background.photo = data.photo;
					background.text = data.text;
					this.forceUpdate();
					setTimeout(() => {
						this.setState({canClick: true, loading: false});
					}, 1000);
					
				});
			}, this.props.time);
			
			
		}
	}

	onLoadFunction(){
		this.setState({imageLoaded: true})
	}


  render(){
		var backgroundOneClass = `${this.state.backgroundOne.active ? 'active' : 'inactive'} background`;
		var backgroundTwoClass = `${this.state.backgroundTwo.active ? 'active' : 'inactive'} background`;
		var loading = `${(this.state.loading || !this.state.imageLoaded) ? 'loading' : ''}`;
    return (
			<div>
				<div id='background' className={backgroundOneClass} style={{backgroundImage: `url(${this.state.backgroundOne.photo})`}} onClick={() => this.clickFunction()}>
				<img className='hidden_image' src={this.state.backgroundOne.photo} onLoad={() => this.onLoadFunction()}/>
					<p id='text' className='text'>{this.state.backgroundOne.text}</p>
					<div className={"spinner " + loading}>
					  <div className={"double-bounce1 " + loading}></div>
					  <div className={"double-bounce2 " + loading}></div>
					</div>
				</div>

				<div id='second_background' className={backgroundTwoClass} style={{backgroundImage: `url(${this.state.backgroundTwo.photo})`}} onClick={() => this.clickFunction()}>
					<img className='hidden_image' src={this.state.backgroundTwo.photo} onLoad={() => this.onLoadFunction()}/>
					<p id='second_text' className='text'>{this.state.backgroundTwo.text}</p>
					<div className={"spinner " + loading}>
					  <div className={"double-bounce1 " + loading}></div>
					  <div className={"double-bounce2 " + loading}></div>
					</div>
				</div>

				
      </div>
    );
  }
}

ReactDOM.render(<Index time={time}/>, document.getElementById('root'));
