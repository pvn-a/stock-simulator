$(function() {

	//stock data
		companies = [
	  {
	      name : 'Apple'
	    , symbol : 'AAPL'
	    , price : '236.21'
	    , shares : '0'
	  },
	  
	  {
	      name: 'Google'
	    , symbol : 'GOOG'
	    , price : '1215.45'
	    , shares : '0'
	  },
	  
	  {
	      name : 'Tesla'
	    , symbol : 'TSLA'
	    , price : '247.89'
	    , shares : '0'
	  },
	  
	  {
	      name : 'Microsoft'
	    , symbol : 'MSFT'
	    , price : '139.68'
	    , shares : '0'
	  },
	  
	  {
	      name : 'Facebook'
	    , symbol : 'FB'
	    , price : '184.89'
	    , shares : '0'
	  },

	  {
		   name : 'Amazon'
	    , symbol : 'AMZN'
	    , price : '1731.92'
	    , shares : '0'
	  },

	  {
			name : 'Nike'
		, symbol : 'NKE'
		, price : '93.88'
		, shares : '0'
	  },
		
	  {
		name : 'Intel'
	, symbol : 'INTC'
	, price : '57.89'
	, shares : '0'
	 }

		];

	//your cash flow
	var cashflow = 10000;

	/*
	- your portfolio value calculated based on 
	current price of stocks and shares owned
	Real time stock value
	*/
	var portfolioValue = function(){

		var total = 0;

		for (var key in companies) {
			var obj = companies[key];

			var symbol = '';
			var sharesOwned = 0;

			for (var prop in obj) {

				/*
				- grab the symbol value 
				- to use to make unique ids for tds
				*/
				if (prop === 'symbol') {
					symbol = obj[prop]; 
				}

				if (prop === 'price') {
					var priceOfCurrentStock = parseFloat(obj[prop]);
				}

				if (prop === 'shares') {
					var sharesOwned = parseFloat(obj[prop]);
					total += priceOfCurrentStock * sharesOwned;
				}

			}
		}

		return total; 
	}


	var changePrice = function(price) {
		//try to mkae this efficient cuz as of for now all stocks increase and decrese by the same amount at a given time
		chance = (Math.random()) *20 - 10;
		price += chance/10; 

		return price;
	}

	//build the table
	for (var key in companies) {
	   var obj = companies[key];
	   var symbol = '';
	   var html = "<tr>";
	   for (var prop in obj) {

			if (prop === 'symbol') {
				symbol = obj[prop]; 
			}

			//table dimensions
			if (prop !== 'price') {
				html += "<td id='" + prop + symbol + "'>"; 
				html += obj[prop]; 
				html += "</td>";
			}else {
				html += "<td id='" + prop + symbol + "'>"; 
				html += "<span class='price'>" + obj[prop] + "</span>"; 
				html += "</td>";	
			}

			/*
			- if the td is price then add 
			  the tds for Shares You own, 
			  Buy and Sell buttons
			  to the table row
			- manipulate the ids to be unique      
			*/
			if (prop === 'shares') {
				html += "<td> <a href='#' class='buy' id='" + symbol + "Buy" + "'>buy 1 share</a> </td> <td> <a href='#' class='sell' id='" + symbol + "Sell" + "'>sell 1 share</a> </td>";
			}
 	   }
 	   html += "</tr>";
 	   $("#myPortfolio tbody").append(html);
	}

	setInterval(function() {

		/*
			- iterate through the stock data
			- change the price to a float
			- run the price through changePrice()
			- replace the new price into the stock data
			- replace the new price of the stock into the table
		*/
		for (var key in companies) {
			var obj = companies[key];

			var symbol = '';

			for (var prop in obj) {

				/*
				- grab the symbol value 
				- to use to make unique ids for tds
				*/
				if (prop === 'symbol') {
					symbol = obj[prop]; 
				}

				if (prop === 'price') {
					var priceOfCurrentStock = parseFloat(obj[prop]);
					obj[prop] = changePrice(priceOfCurrentStock); 
					

					var roundedPrice = (obj[prop]).toFixed(2);
					$('#'+prop+symbol).html("<span class='price'>" + roundedPrice + "</span>");
				}
			}
		}
    
	}, 1000 );


	setInterval(function() {

		/*
			- run cash flow, portfolio value, total worth functions
			  and then put them in the dom
			- decide whether buy/sell buttons should appear 
			  and then put them or remove them from the dom
		*/
		for (var key in companies) {
			var obj = companies[key];

			//initialize 
			var symbol = '';
			var price = 0;
			var p = 0;
			var t = 0;

			for (var prop in obj) {

				/*
				- grab the symbol value to use to make unique ids for tds
				*/
				if (prop === 'symbol') {
					symbol = obj[prop]; 
				}

				p = portfolioValue();
				t = cashflow + p; 

				$('#cashflow').html(cashflow);
				$('#portfolio').html(p);
				$('#netWorth').html(t);
				$('#cashflow1').html(cashflow);//table on the right updater

				//hide all buy buttons if cashflow is 0
				if (cashflow === 0) {
					$('a').each(function() {
						//grab the id of this link and typecast it to a string
  						var id = String($(this).attr('id'));
  
  						//if it contains buy hide it
  						if (id.indexOf('Buy') > 0) {
  							$(this).hide();
  						}
					});
				}

				//hide buy button if cashflow can't buy a share
				//show buy button if cashflow can buy a share
				if (prop === 'price') {
					price = parseFloat(obj[prop]); 
					if (cashflow < price) {
						$('#' + symbol + 'Buy').hide();
					}else {
						$('#' + symbol + 'Buy').show();
					}

				}

				//hide sell button if share isn't owned
				//show sell button if share isn't owned
				if (prop === 'shares') {
					var sharesOwned = parseFloat(obj[prop]);
				
					if (sharesOwned > 0) {
						$('#' + symbol + 'Sell').show();
					}else {
						$('#' + symbol + 'Sell').hide();
					}
				}
			}
		}
	   
	}, 1000  );
	

	//happens live
	$(document).on('click', "a", function(){

	    //grab the id of this link and typecast it to a string
	    var id = String($(this).attr('id'));

	    //if this is a buy button
	    if (id.indexOf('Buy') > 0) {
	    	//extract the symbol of the stock this is for
	    	symbol = id.substr(0, id.indexOf('Buy')); 

	    	//only do if cash flow is greater than share price 
	    	//add a share 
	    	//subtract share amount from cashflow

	    	//initialize
	    	var thisObj = 0; //specific object in companies 

	    	for (var key in companies) {
	    		var obj = companies[key];

	    		for (var prop in obj) {
	    		
	    			if (prop === 'symbol') {
	    				if (obj[prop] === symbol) { 
	    					
	    					thisObj = key; 
	    				}
	    			}

	    			if (prop === 'price') {
	    				if (key === thisObj) {
	    					var PriceForThisStock = parseFloat(obj[prop]);

	    					if ( cashflow > PriceForThisStock ) {
	    						var subtractPrice = true;

	    						//since you bought a share we should 
	    						//subtract the price of the share
	    						//from your cashflow
	    						cashflow = cashflow - PriceForThisStock;

	    					}
	    				}
	    				
	    			}

	    			if (prop === 'shares') {
	    				if (key === thisObj) {

	    					//if cash flow is greater than share price
	    					if (subtractPrice) {
	    						var sharesForThisStock = parseFloat(obj[prop]);

	    						//add 1 to the shares owned for this stock
	    						sharesForThisStock += 1;
	    						
	    						//and update the shares inside the companies array
	    						obj[prop] = sharesForThisStock; 

	    						//and update the dom
	    						$('#' + 'shares' + symbol).html(sharesForThisStock);
	    					}
	    				}
	    			}
	    		}
	    	}

	    }

	    //if this is a sell button
	    if (id.indexOf('Sell') > 0) {

	    	//extract the symbol of the stock this is for
	    	symbol = id.substr(0, id.indexOf('Sell')); 

		    //only do if share of this stock is owned
		    //subtract a share
		    //add share amount to cash flow

	    	//initialize
	    	var thisObj = 0; //specific object in companies 

	    	for (var key in companies) {
	    		var obj = companies[key];

	    		for (var prop in obj) {
	    		
	    			if (prop === 'symbol') {
	    				if (obj[prop] === symbol) { 

	    					thisObj = key; 
	    				}
	    			}

	    			if (prop === 'price') {
	    				if (key === thisObj) {
	    					var PriceForThisStock = parseFloat(obj[prop]);
	    				}
	    				
	    			}

	    			if (prop === 'shares') {
	    				if (key === thisObj) {

	    					var sharesForThisStock = parseFloat(obj[prop]);

	    					//if you own shares for this stock
	    					if (sharesForThisStock) {

	    						//since you sold a share we should 
	    						//add the price of the share
	    						//to your cashflow
	    						cashflow = cashflow + PriceForThisStock;

	    						//minus 1 to the shares owned for this stock
	    						sharesForThisStock -= 1;
	    						
	    						//and update the shares inside the companies array
	    						obj[prop] = sharesForThisStock; 

	    						//and update the dom
	    						$('#' + 'shares' + symbol).html(sharesForThisStock);
	    					}
	    				}
	    			}

	    		}
	    	}
	    } 

	    //act like a button not a link
	    return false;
	   
	});

});

