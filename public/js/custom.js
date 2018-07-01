console.log("Connected Rohan");

$(function(){
	$('#search').keyup(function(){
		var search_term = $(this).val();
		$.ajax({
			method : 'POST',
			url : '/api/search',
			data : {
				search_term
			},
			data_type : 'json',
			success : function(json){
				var data = json.hits.hits.map(function(hit){
					return hit;
				});
				console.log(data);
				$('#searchResults').empty();
				for(var i=0;i<data.length;i++){
					var html = '';
					html+= '<div class="col-lg-4 col-md-6 col-sm-12">'
					html+= '<a href="/product/'+ data[i]._id +'">'
					html+= '<div class="thumbnail">'
					html+= '<img src='+ data[i]._source.image +'">'
					html+= '<div class="caption">'
					html+= '<h3>' + data[i]._source.name +'</h3>'
					html+= '<p>'+ data[i]._source.category.name +'</p>'
					html+= '<p>$' + data[i]._source.price  + '</p>'
					html+= '</div></div></a></div>';
					$('#searchResults').append(html);
				}
			},
			error : function(error){
				console.log(error);
			}
		})
	});

	$(document).on('click', '#plus', function(e){
	e.preventDefault();
	//console.log("1");
	var priceValue = parseFloat($('#priceValue').val());
	var quantity = parseFloat($('#quantity').val());
	//console.log(priceValue+"lallaa"+quantity);
	priceValue+= parseFloat($('#priceHidden').val());
	quantity+=1;

	$('#quantity').val(quantity);
	$('#priceValue').val(priceValue);
	$('#total').html(parseFloat(quantity));

});


	$(document).on('click', '#minus', function(e){
		e.preventDefault();
		//console.log("1");
		var priceValue = parseFloat($('#priceValue').val());
		var quantity = parseFloat($('#quantity').val());
		//console.log(priceValue+"lallaa"+quantity);
		if(quantity===1){
			priceValue = parseFloat($('#priceHidden').val());
			quantity = 1;
		}
		else{
			priceValue-= parseFloat($('#priceHidden').val());
			quantity-=1;
		}

		$('#quantity').val(quantity);
		$('#priceValue').val(priceValue);
		$('#total').html(parseFloat(quantity));

	});
	Stripe.setPublishableKey('pk_test_sHQNddTbVK8QXe2uO5EyMuA2');

	
	  
	  
	

	function stripeResponseHandler(status, response) {
	  // Grab the form:
	  var $form = $('#payment-form');

	  if (response.error) { // Problem!

	    // Show the errors on the form:
	    $form.find('.payment-errors').text(response.error.message);
	    $form.find('.submit').prop('disabled', false); // Re-enable submission

	  } else { // Token was created!

	    // Get the token ID:
	    var token = response.id;

	    // Insert the token ID into the form so it gets submitted to the server:
	    $form.append($('<input type="hidden" name="stripeToken">').val(token));

	    // Submit the form:
	    //$form.get(0).submit();
	    
	    // For this demo, we're simply showing the token:
	    alert("Token: " + token);
	  }
	};

	$('#payment-form').submit(function(event) {
	    // Disable the submit button to prevent repeated clicks:
	    var $form = $(this);
	    $form.find('button').prop('disabled', true);

	    // Request a token from Stripe:
	    Stripe.card.createToken($form, stripeResponseHandler);

	    // Prevent the form from being submitted:
	    return false;
	  });




});



