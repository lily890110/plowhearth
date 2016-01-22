$(document).ready(function ()
{    
	var tSearch_v = $("#query").text().replace( "'", "" ).replace( '"', '' );
	var paramsval = $(".selecttypes").text().replace( "'", "" ).replace( '"', '' );
	$(".selecttypes").css("display","none");
	var page = 1;
	var pagesize = 24;
	var skip = (page-1) * pagesize;
	var data_sort = "";
	function load_data_good()
	{   
		//$(".selecttypes").html("");
	    load_Params();
		load_RatingParams();
		load_PricingParams();
		 paramsval = $(".selecttypes").text().replace( "'", "" ).replace( '"', '' );
		pagesize=24; 
		var page = 1;
		var skip = (page-1) * pagesize;
		$.ajax( 
		{
        	type    : "POST",
        	datatype: 'text',
        	url     : '/GSA/test.asp',
        	data    : 
        	{
        	  	tSearch : tSearch_v,
        	  	skip    : skip,
        	  	pageSize: pagesize,
        	  	sort    : data_sort,
        	  	params  : paramsval
        	},
			success: function(data)
			{   
				json_data = jQuery.trim( data.replace( '<div class="CYOPageWrapper" id="CYODiv_327">', '' )
                                 .replace( '</div>', '' )
                                 .replace( '<div style="clear: both;"></div>', '' )
                                 .replace( '<div style="clear:both;"></div>', '' )
					 );
				data =  JSON.parse( json_data ); 
				
				$(".itemtotals").html(data.totalRecordCount + " items");
				if(data.totalRecordCount<=pagesize && data.totalRecordCount >0)
				{   
					$( '.subsub-products' ).html("");
					pagesize = data.totalRecordCount;
					load_goods(data,pagesize);
				}
				else
				{    
					
					if(data.totalRecordCount ==0)
					{
						$( '.subsub-products' ).html("No item you want to find!");
						$(".filter_type").css("display","none");
					}
					else
					{
					$( '.subsub-products' ).html("");
						pagesize = 24;
						load_goods(data,pagesize);
					}
				}
				
				
		
				
			}   
		});
	}
	//alert()
	var page_curr = 1;
	function Add_Data()
	{    
		var total = $(".itemtotals").text().replace(" items",''); 
		total = parseInt(total);
		var pagecount =  Math.ceil(total/24);
		var loaded = true;
		
		var skip_val = (page_curr) * 24;
		var tSearch_v = $("#query").text().replace( "'", "" ).replace( '"', '' );
		var scrollh = $(document).scrollTop() + $(window).height() + 100;
		var whei =  $(document).height();
		var paramsval = $(".selecttypes").text().replace( "'", "" ).replace( '"', '' );
		if(loaded && scrollh  >= whei && page_curr < pagecount )
		{   
		
			loaded = false;
			
			page_curr = page_curr + 1;  
			
			
		
			$.ajax( {
        		type    : "POST",
        		datatype: 'text',
        		url     : '/GSA/test.asp',
        		data    : {
        		  tSearch : tSearch_v,
        		  skip    : skip_val,
        		  pageSize: pagesize,
        		  sort    : '',
        		  params  : paramsval
        		},
				success: function(data)
				{   
					json_data = jQuery.trim( data.replace( '<div class="CYOPageWrapper" id="CYODiv_327">', '' )
                                 .replace( '</div>', '' )
                                 .replace( '<div style="clear: both;"></div>', '' )
                                 .replace( '<div style="clear:both;"></div>', '' )
					 );
					data =  JSON.parse( json_data ); 
					
				 
						
						
						
						pagesize = data.records.length;
						load_goods(data,pagesize);
						
					
					
					loaded=true; 
					
					 
				}
				
			});  
		}
		else
		{   
			$( '.message_last_page' ).html("This is the last page.");
							loaded = false;
							return false;
					
		}
		
	}
	function upload_select()
	{
		 $.ajax( 
		{
        	type    : "POST",
        	datatype: 'text',
        	url     : '/GSA/test.asp',
        	data    : 
        	{
        	  	tSearch : tSearch_v,
        	  	skip    : 0,
        	  	pageSize: 500,
        	  	sort    : '',
        	 	 params  : paramsval
        	},
			success: function(data)
			{   
				json_data = jQuery.trim( data.replace( '<div class="CYOPageWrapper" id="CYODiv_327">', '' )
        	                 .replace( '</div>', '' )
        	                 .replace( '<div style="clear: both;"></div>', '' )
        	                 .replace( '<div style="clear:both;"></div>', '' )
				 );
				data =  JSON.parse( json_data ); 
				valesize = data.availableNavigationByName;
				$("#filterwrap").html('');
				var	htmls = "";
				$.each(valesize,function(name,value) 
				{
					var titles = value.displayName;
			    	
			    	var m = 0;
					htmls  = '<dl class="filter_type">'+
					'<dt class="filter_dt"><h2 >' + titles +'<span class="selecteds">All</span></h2></dt>'  +
					'<dd class="filter_select"><h3>'+titles+'</h3>' +
					'<ul class="'+name+'"><li class="checkss" data-val="All" data-name=""><div class="select" ></div>All</li>';
					m++;
			  		for(i=0;i< value.refinementValues.length;i++)
			   		{
			   	 		var typename = value.refinementValues[i].displayName;
			   	 		var typevalue = value.refinementValues[i].value;
			   	 		htmls = htmls + '<li class="checkss" data-val="'+typevalue+'" data-name="'+titles+'"><div class="select" ></div>'+typename+'</li>';
			   		}
					htmls = htmls + '</ul></dd></dl>';
					$("#filterwrap").append(htmls);
					$(".filter_type").on("click",".filter_dt",function ()
					{
						var parents = $(this).parent().find(".filter_select");	
						parents.fadeIn("slow");
					});
					$(".checkss").unbind().on('click',function(){
						var texts = $(this).attr("data-val");
						if(texts=="All")
						{
							$(this).siblings("li").removeClass("on");
							$(this).addClass("all");
						}
						else
						{
							
							$(this).siblings("li").removeClass("on");
							$(this).siblings("li").removeClass("all");
							$(this).addClass("on");
						}								
						var c	= $(this).parent().parent().parent();
						$(this).parent().parent().fadeOut();
						c.find("span").html(texts);
					}); 
					
				});
				if(data.records.length>0)
				{
				
				}
				else
				{
				
				    return false;
				}
				Price_min = Math.floor( data.records[ 0 ].Last_Price );
				Price_max = Math.floor( data.records[ 0 ].Last_Price );
				for ( var i = 0, length = data.records.length; i < length; i++ ) 
				{
					var last_price = Math.floor( data.records[ i ].Last_Price );
					if ( Price_min > last_price ) 
					{
						Price_min= last_price;
					}
					if ( Price_max < last_price ) 
					{
						Price_max = last_price;
					}
				}
				$( '.price_range' ).html("<li class='checks1'  data-vals='$0 to $10000' data-min='0' data-max='10000'> <div class='select' ></div>All</li>");
				var price_m = Math.floor( parseInt(Price_max)) - Math.floor( parseInt(Price_min));
				var Price_rang_val =  50;
				var p_length = 8;
				var price_html = ""  ;
				var price_from = "";
				var price_to = "";
				if(price_m > Price_rang_val *  p_length)
				{  
					Price_rang_val = Math.ceil(price_m / p_length);
				}
				if(price_m < Price_rang_val)
				{
					p_length = 1;
				}
				if(Price_rang_val < price_m < Price_rang_val *  p_length )
				{
					Price_rang_val = Math.ceil(price_m / p_length);
				}
				for(i = 0;i< p_length;i++ )
				{   
					if(p_length == 1)
					{
						price_from =  Price_min;
						price_to =  Price_max;
					}
					else
					{
						price_from= Price_min+Price_rang_val * i;
						if((i+1) == p_length)
						{
							price_to = Price_max;
						}
						else
						{
							price_to = Math.floor(Price_rang_val) * (i+1) + Math.floor(Price_min);
						}	
					}	
					price_html =  "<li class='checks1'  data-vals='$" + price_from +  " to $" + price_to + "' data-min="+price_from+" data-max="+price_to+"> <div class='select' ></div>$" + price_from +  " to $" + price_to + "</li>";
					$( '.price_range' ).append(price_html);
				}
				$(".checks1").unbind().on( 'click', function () 
				{  
					var texts = $(this).attr("data-vals");
					var c	= $(this).parent().parent().parent();
					$(this).siblings("li").removeClass("on");
					if(texts == 0)
					{
						$(this).addClass("all");
						$(this).siblings("li").removeClass("on");
					}
					else
					{
						var price_from = $(this).attr("data-min");
						var price_to = $(this).attr("data-max");
						$(this).addClass("on");
						$(this).siblings("li").removeClass("on");
						$(this).siblings("li").removeClass("all");
						c.find(".price-from").html(price_from);
						c.find(".price-to").html(price_to)
					}	
					$(this).parent().parent().fadeOut();
					c.find("span").html(texts);
					
				}); 

			}
		});  
	}
	$( '#filterblocks_rat1 li' ).on( 'click', function () 
	{
		var sstart = $(this).children(".filt_ratings").attr("data-val");
		if(sstart ==0)
		{
			sstart = "All";
			$(this).addClass( 'all' );
			$(this).siblings("li").removeClass("on");
		}
		else
		{
			sstart = sstart + " Stars & Up";
			$(this).addClass( 'on' );
			$(this).children(".filt_ratings").addClass( 'selected' );
			$(this).siblings("li").removeClass("on");
			$(this).siblings("li").removeClass("all");
		}
		$(this).parent().parent().parent().fadeOut();
		$(this).parent().parent().parent().parent().find(".Rating_s").html(sstart);

	});
	$(".filter_type").on("click",".filter_dt",function ()
	{
		var parents = $(this).parent().find(".filter_select");	
		parents.fadeIn("slow");
	});
	
	function load_Params () 
 	{
    	paramsw = '';
    	$( '.checkss.on' ).each( function () {
    		 paramsw =  '~' + $( this ).attr( 'data-name' ) + '=' + $( this ).attr( 'data-val' ).replace( /'/g, '\\' + '\'' );
    		$(".selecttypes").append(paramsw);
    	} )
    }

    function load_RatingParams() 
    {   
		var paramsrating = '';
    	$( '.filt_ratings.selected' ).each( function () 
    	{
    	 	paramsrating = '~' + $( this ).attr( 'data-name' ) + ':' + $( this ).attr( 'data-val' ) + '..' + '5';
    		$(".selecttypes").append(paramsrating);
    	} )
    }

    function load_PricingParams() 
    {    
	    var price_param ="";
    	var lower  = parseInt( $( '.price-from' ).text().replace( '$', '' ).replace( / /g, '' ) );
    	var higher = parseInt( $( '.price-to' ).text().replace( '$', '' ).replace( / /g, '' ) ) + 1;
		
    	if(lower!=0)
    	{
    		price_param = '~Last_Price' + ':' + lower + '..' + higher;
    	}
    	else
    	{
    	   price_param = "";
    	}
    	
    	$(".selecttypes").append(price_param);
   	}
   	function load_goods(data,pagesize)
   	{   
   		
		
   		html = "";
		for(i=0;i< pagesize;i++)
		{    
		    var sale_span = "";
            var sale_reg = "";
            var exclusive = "";
            var newgood = ""; 
            var product_created = new Date(data.records[i].product_created);
      		var date_range      = Math.round( (new Date() - product_created) / 24 / 60 / 60 / 1000 );
			var price        = parseFloat( data.records[i].price);
     		var sale         = isNaN( parseFloat(data.records[i].sale ) ) ? 0 : parseFloat( data.records[i].sale );
      		var sale_special = isNaN( parseFloat( data.records[i].sale_special ) ) ? 0 : parseFloat(data.records[i].sale_special);
      		var stars = parseFloat(data.records[i].Rating_Average);
      		var stars_rating = Math.round(data.records[i].Rating_Average);
		    if(sale_special > 0 && sale_special < price) 
		    {
		    	sale_span = '<span class="am-badge am-radius">SALE</span>';
		    	sale_reg = '<span class="sale">Sale!</span> <span class="shop_price">$'+sale_special+'</span><br/>'+
							'<span class="reg">Reg.</span> <span class="market_price reg">$'+price+'</span >';
			}	
			else
			{
				sale_span= " ";
				sale_reg = '<span class="shop_price">$'+price+'</span>';
			}	
			if( typeof (data.records[i].special_collections) === 'undefined')
			{
				exclusive="";	
			}
			else
			{
				var check = data.records[i].special_collections.match( /Exclusive/ );
      			if ( check !== null ) 
      			{
      			  	if ( check.length > 0 ) {
      			    	exclusive='<span class="am-badge am-radius" style="margin-left:60px">Exclusive</span>';
      			  	}
      			  	else 
      			  	{
      			   	 	exclusive="";	
      			  	}
      			}
			}	
			if ( date_range < 120 ) 
			{
       			  newgood = '<span class="am-badge am-radius" style="margin-left:145px">New</span>'; 
			}
      		else 
      		{ 
        		 newgood = ""; 
      		}
			html = html + '<li>'+
							'<div class="am-gallery-item">'+sale_span+ exclusive + newgood +
								  	'<a title="' + data.records[i].image_link.replace( '//plowhearthcdn' + '.cachefly.net/itemimages/', '' ) +'" href="' + data.records[i].ProductUrl.replace( 'http://www.plowhearth.com/', '/mobi/' ) +'">'+
										'<img class="ssimg"  alt="product" src="' + '//plowhearthcdn' + '.cachefly.net/getDynamicImage.aspx?width=200&height=200&path=' + data.records[i].image_link.replace( '//plowhearthcdn' + '.cachefly.net/itemimages/', '' ) + '">'+
    							  	'</a>'+
    							   	'<div id="phw_cat_product_info">'+
    							   		'<a title="' + data.records[i].image_link.replace( '//plowhearthcdn' + '.cachefly.net/itemimages/', '' ) +'" href="' + data.records[i].ProductUrl.replace( 'http://www.plowhearth.com/', '/mobi/' ) +'">'+
								   			'<h3 class="am-gallery-title" style="font-weight:bold;margin-top:0;">'+data.records[i].metatitle+'</h3>'+
								   			'<div class="am-gallery-desc">'+sale_reg+
								   			'</div>'+
								   			'<div class="am-clear-both" style="height:20px">'+
    							       			'<span class="star-rating1 r_'+stars_rating+'">'+stars+'</span>'+
								   			'</div>'+
								   		'</a>'+
    							   	'</div>'+
								'</div>'+
								'</li>';
								
			
			
		}
		$( '.subsub-products' ).append(html);
   	}
	$( '.am-done' ).on( 'click', function () 
	{
	
		load_data_good();   
		upload_select();
		jQuery(".am-dimmer").fadeOut();
		jQuery("#doc-modal-1").fadeOut();
		jQuery(".filter_select").fadeOut();
		jQuery(".filter_select li").removeClass("on");
		jQuery(".filt_ratings").removeClass("selected");
		$("html").css({"overflow":"","height":"auto","width":"auto"});
    });
	$( '.am-close' ).on( 'click', function () 
	{
		
		jQuery(".filter_select").fadeOut();
		$("html").css({"overflow":"","height":"auto","width":"auto"});

    });
	$(".search-filter").click(function(){
		$("html").css({"overflow":"hidden","height":"100%","width":"100%"});
	})
	$( '.sorterdrop-search' ).off().on( 'change', function () 
	{
      	
		var value = $( this ).val();
		if ( value === '' ) 
		{
          return false
        }
        else 
        {
          	var sort = $( this ).val();
          	switch ( sort ) 
          	{
           		 case 'BPD':
           		   data_sort = 'meta:Last_Price:D::::N';
           		   break;
           		 case 'BPA':
           		   data_sort = 'meta:Last_Price:A::::N';
           		   break;
           		 case 'RD':
           		   data_sort = 'meta:Rating_Average:D::::N';
           		   break;
           		 case 'RPA':
           		   data_sort = 'meta:pagerank:D::::N';
           		   break;
           		 default:
              data_sort = '';
			}
        }
        if ( data_sort !== '' ) 
        {
          load_data_good();
        }
    } );
   	load_data_good();   
	upload_select();
	
	$(window).scroll(Add_Data);      
})