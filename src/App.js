import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import Home from './components/Home';
 
import Error from './components/Error';
import Navigation from './components/Navigation';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';

import TimezoneSelect from 'react-timezone-select'

 import   './components/css.css';

import axios from "axios";
 
 
 
class App extends Component {
	
	constructor(props) {
    super(props);
    this.state = { startDate:null,endDate:null,focusedInput:null,selectedTimezone:'',setSelectedTimezone:'',date:null , 
		focused:null, selcttime: 15, saveId : '',bookingdutationVal : [] , saveddata : '' ,bookedsloot : [] 
		};
    
    this.handleDateChange = this.handleDateChange.bind(this);
     this.getTimezone = this.getTimezone.bind(this);
      this.onChangebookingdutation = this.onChangebookingdutation.bind(this);
        this.getAllbooking = this.getAllbooking.bind(this);
 	 
	
		}
	
	 getTimezone(param) 
	 { 
		 
		 this.state.setSelectedTimezone = param.value ;  
		}
		
		 handleDateChange()
		 {
			
			var dt =  this.state.date ; 
	
			if( dt !=null  && this.state.setSelectedTimezone  !=''   && this.state.selcttime !='' )
			{
				// console.log(this.state.date._d ,  this.state.setSelectedTimezone , this.state.selcttime );
				   
				  
				     var time1 = new Date(this.state.date._d );
					  var time2 = new Date(this.state.date._d );
					  var dNow = new Date(this.state.date._d );
					  var localdate = dNow.getHours() + ':' + dNow.getMinutes();

					  //meeting length
					  var meetingLength = parseInt(this.state.selcttime);

					  //start time 
					  var startTime = localdate
					  var startHour = startTime.split(':')[0];
					  var startMin = startTime.split(':')[1].replace(/AM|PM/gi, '');

					  //end time
					  var endTime = '11:00 PM';
					  var endHour = endTime.split(':')[0];
					  var endMin = endTime.split(':')[1].replace(/AM|PM/gi, '');

					  //Check if start time is PM and adjust hours to military
					  if (startTime.indexOf('PM') > -1) {
						if (startHour != 12) {
						  startHour = parseInt(startHour) + 12;
						} else {
						  startHour = parseInt(startHour);
						}
						console.log(startHour);
					  }

					  //Check if end time is PM and adjust hours to military
					  if (endTime.indexOf('PM') > -1) {
						endHour = parseInt(endHour) + 12;
						console.log(endHour);
					  }

					  //Date API start time
					  time1.setHours(parseInt(startHour));
					  time1.setMinutes(parseInt(startMin));

					  //Date API end time
					  time2.setHours(parseInt(endHour));
					  time2.setMinutes(parseInt(endMin));
					  time2.setSeconds(0);

					  //Adding meeting length to start time, this value will be use for end    time
					  time1.setMinutes(time1.getMinutes() + meetingLength);
						var llopval = []; 
						var fnlstr = ''; 
						var fnlstrNExt = ''; 
					  while (time1 < time2) {
						fnlstr =  '--' + ('00' + time2.getHours()).slice(-2) + ':' + ('00' + time2.getMinutes()).slice(-2) ;
						
						time2.setMinutes(time2.getMinutes() - meetingLength);
						
						fnlstrNExt =    ('00' + time2.getHours()).slice(-2) + ':' + ('00' + time2.getMinutes()).slice(-2)  ; 
						
						llopval.push (fnlstrNExt + fnlstr);
					  }
					   this.setState({bookingdutationVal : llopval }); 
				 
				  	
				 
				 
			}
			else
			{
				alert("select date , time and time zone");
			}
			
			
		}
		
		onChange(e) {
			this.setState({
			  selcttime: e.target.value
			})
			
		}
		
		onChangebookingdutation(e) 
		{
			console.log(e.target.id);
			 var time1 = new Date(this.state.date._d ); 
			 var dpt = time1.getDate()+"-"+time1.getMonth()+1+"-"+time1.getFullYear(); 
			 
			  var attribute = {witchtime : e.target.id , date : dpt , timezone :  this.state.setSelectedTimezone , timeduration : this.state.selcttime   }
			 axios.post('http://localhost:6001/v1/attribute/create', attribute)
				.then(function(data){
						if(data)
						{
							 
							alert("Booking done ") ;
						}
					}); 
				
		}
		
		getAllbooking()
		{
			
			var time1 = new Date(this.state.date._d ); 
			 var dpt = time1.getDate()+"-"+time1.getMonth()+1+"-"+time1.getFullYear(); 
			 var self = this;
			 var attribute = {  date : dpt   } 
			axios.post('http://localhost:6001/v1/attribute/get-all', attribute)
				.then(function(response){
						if(response && response.data && response.data.data.length>0 )
						{
							console.log(response.data.data)
							 
							 self.setState({bookedsloot:  response.data.data})
							 
							 
						 
						}else
						{
							alert("no data found")
						}
					}); 
		}
			
		
		
  render() {
	  
	  const options = [15, 30, 60]
	  if(this.state.bookingdutationVal.length ==0 )
	  {
    return (
          
       <div>
        
        <div className="mainloop-control">
          
             
        </div> 
        <div>
        
      
		 <div style={{ border: "solid 1px" ,  }} >
			<SingleDatePicker
			  date={this.state.date} // momentPropTypes.momentObj or null
			  onDateChange={date => this.setState({ date :date})} // PropTypes.func.isRequired
			  focused={this.state.focused} // PropTypes.bool
			  onFocusChange={({ focused }) => this.setState({ focused:focused })} // PropTypes.func.isRequired
			  id="123" // PropTypes.string.isRequired,
			/>
		
			<TimezoneSelect
			value={this.state.selectedTimezone}
			onChange={this.getTimezone} 
			/>
			<br/>
			<div className="selectSelector     ">
				<select value={this.state.selcttime} onChange={this.onChange.bind(this)} className="form-control">
				{options.map(option => {
				return <option value={option} key={option} >{option} Min</option>
				})}
				</select>
			</div>
			
			 <br/>
			  
				<button  className="bt" onClick={this.handleDateChange}>
				Get Free Slot
				</button>
			</div>	
		 
				
			  
			 
        </div>
        
      </div>
    );
 }else if(this.state.bookingdutationVal.length > 0  && this.state.bookedsloot.length ==0    )
 {
	 return (
          
       <div>
       
        
			   
			  <br/><br/>
			   <div className="tab-list "  >
				  
					{(this.state.bookingdutationVal.length > 0) && this.state.bookingdutationVal.map(option => {
						return <span className="tab-list-item " id={option} key={option}  onClick={this.onChangebookingdutation.bind(this)} >{option}  </span>
						})}
				 
			   </div>
			   <br/><br/>
			  
			   <div>
			   
			   <SingleDatePicker
			  date={this.state.date} // momentPropTypes.momentObj or null
			  onDateChange={date => this.setState({ date :date})} // PropTypes.func.isRequired
			  focused={this.state.focused} // PropTypes.bool
			  onFocusChange={({ focused }) => this.setState({ focused:focused })} // PropTypes.func.isRequired
			  id="123233" // PropTypes.string.isRequired,
				/>
			   
			   </div>
			   <br/>
			   
			   <button  style={{ color: "red"}} className="bt" onClick={this.getAllbooking.bind(this)}>
				Click here to get Booking
				</button>
				 
			    
			    
       </div>
       )
  } else if(this.state.bookedsloot.length > 0    )
 {
	 
	 
	 return (
          
       <div>
       
         Save time in db is : 
				<br/>
				<div className="tab-list "  >
				  
					{(this.state.bookedsloot.length > 0) && this.state.bookedsloot.map(option => {
						return <span className="tab-list-item "    >{option.witchtime}  </span>
						})}
						
						 
				 
			   </div>
			    
			    
       </div>
       )
       
 }
   
			
  }
}
 
export default App;
