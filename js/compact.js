// test run

$(document).ready(function(){

  toggle();

  // CLICK FUNCTION ON BUTTONS

  $("#register-user").on('click', function(){
    $(".content").hide();
    $("#new-user").show();
  });

  $("#user-login").on('click', function(){
    $(".content").hide();
    $("#login").show();
  });

  $("#display-cosmetic").on('click', function(){
    $(".content").hide();
    $("#new-product").show();
  });


  $("#display-cosmetic-bag").on('click', function(event){
    var categoryID = event.target.dataset.categoryId;

    $.ajax({
      url: 'http://localhost:3000/categories/' + categoryID,
      method: 'GET',
      dataType: 'json',
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    })
    .done(function(category_data){
      $(".content").hide();
      $("#cosmetic_products").show();
      $("#cosmetic_products").html('');

       category_data.cosmetic_products.forEach(function(cosmetic_product){
         $("#cosmetic_products").append("<li id='" + cosmetic_product.id + "'>" + cosmetic_product.name + "</li>");
       });
    });

  });


  $("#about-compact").on('click', function(){
    $("#aboutapp").show();
  });



  $('#show-all-products').on('click', function(){
    $.ajax({
      method: 'GET',
      url: "http://localhost:3000/cosmetic_products",
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(cosmetic_product_data){
      console.log(cosmetic_product_data);
      $(".content").hide();

      $("#cosmetic_products").html('');
      cosmetic_product_data.forEach(function(cosmetic_product){
        $("#cosmetic_products").append("<li id='" + cosmetic_product.id + "'>" + cosmetic_product.name + "</li>");
      });
       $("#cosmetic_products").show();
    })
    .fail(function(){
      alert("fail to get products");
    });

   });

   $("#cosmetic_products").on("click", function(event){
    $.ajax({
      method: 'GET',
      url: "http://localhost:3000/cosmetic_products/" + event.target.id,
      headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
    }).done(function(cosmetic_product_data){
      console.log(cosmetic_product_data);
      var html = "<dl> <dt>Name</dt><dd>" + cosmetic_product_data.name + "<dt>Brand</dt><dd>" + cosmetic_product_data.brand + "<dt>Color</dt><dd>" + cosmetic_product_data.color + "<dt>Price</dt><dd>" + cosmetic_product_data.price + "<dt>Purchase Date</dt><dd>" + cosmetic_product_data.purchase_date + "<dt>Category</dt><dd>" + cosmetic_product_data.category_name + "<dt>Image</dt><dd>" + '<img src="' + cosmetic_product_data.photo + '"/>';
      $("#cosmetic_product").html("");
      $("#cosmetic_product").append(html);
    }).fail(function(){
      alert("Failed to load products");
    });
  });

   $("#new-prod-button").on("click", function(event){
      var fd = new FormData();
      fd.append('name', $("#new-prod-name").val());
      fd.append('brand', $("#new-prod-brand").val());
      fd.append('color', $("#new-prod-color").val());
      fd.append('price', parseFloat($("#new-prod-price").val()));
      fd.append('purchase_date', $("#new-prod-date").val());
      fd.append('category_id', $("#new-prod-cat").val());
      fd.append('image', $("#new-prod-image")[0].files[0]);

      $.ajax({
        type: 'POST',
        url: "http://localhost:3000/cosmetic_products",
        processData: false,
        contentType: false,
        cache: false,
        data: fd,
        headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
      }).done(function(){
        alert ("success");
      }).fail(function(){
        alert ("fail");
      });
   });

    $("#new-user-button").on("click", function(event){
      var newUser = {
        name: $("#new-user-name").val(),
        email: $("#new-user-email").val(),
        password: $("#new-user-pw").val(),
        password_confirmation: $("#new-user-confirm-pw").val()
      };
      $.ajax({
        type: 'POST',
        url: 'http:localhost:3000/register',
        data: {credentials: newUser}
      })
      .done(function(response){
        $("#new-user").hide();
        console.log("Your account has been created!")
      })
      .fail(function(error){
        console.log("Error in creating new user " + error);
      });
  });

    $("#login-button").on("click", function(){
      var email = $("#login-user-email").val();
      var password = $("#login-user-pw").val();
      var params = {
        credentials: {
          email: email,
          password: password
        }
      };
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/login',
        dataType: "json",
        data: params
      })
      .done(function(data){
        $("#login").hide();
        renderUserGreeting(data);
        // setting token to a non-empty string (correct value)
        simpleStorage.set('token', data.token, {TTL: 43200000});
        toggle();
        getCategories();
        console.log("Successful login!");
      })
      .fail(function(error){
        console.log("Error in login " + error);
      });
    });




    $("#logout").on("click", function(){
      $.ajax({
        method: 'DELETE',
        url: "http://localhost:3000/logout",
        headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
      })
      .done(function(){
        console.log("logged out");
      })
      .fail(function(){
        alert("Error in logging out");
      }).always(function(){
        simpleStorage.set('token', '');
        toggle();
      });
    });


    var renderUserGreeting = function(data){
      $("#userDiv").html("Welcome, " + data.name);
    };

// CHARLTON NEW USER
  //  $("#new-user-button").on("click", function(event){
  //   if ($("#new-user-pw").val() !== $("#new-user-confirm-pw").val()){
  //     $("#error-pw").html("Passwords do not match");
  //   } else {
  //    var user = {
  //     name: $("#new-user-name").val(),
  //     email: $("#new-user-email").val(),
  //     password: $("#new-user-pw").val(),
  //     password_confirmation: $("#new-user-confirm-pw").val()
  //   };
  //   $.ajax({
  //     type: 'POST',
  //     url: "http://localhost:3000/register",
  //     data: {credentials: user}
  //   }).done(function(response){
  //     if (response.error){
  //       $("#error-pw").html(response.error);
  //     }else{
  //       //TO DO: HIDE PASSWORD DIV, SHOW MAIN DIV
  //       // selectDiv('cosmetic_products');
  //       $("#new-user").hide();
  //     }
  //   }).fail(function(){
  //     $("#error-pw").html("Server error occured. Try again later");
  //   });
  //   }
  // });
// END CHARLTON NEW USER


 //  $("#login-button").on("click", function(){

 //  //    $.ajax('http://localhost:3000/login',{
 //  //      contentType: 'application/json',
 //  //      processData: false,
 //  //      data: JSON.stringify({
 //  //       credentials: {
 //  //         email: $('#login-user-email').val(),
 //  //         password: $('#login-user-pw').val()
 //  //       }
 //  //     }),
 //  //      dataType: "json",
 //  //      method: "POST"
 //  //    }).done(function(data, textStatus) {
 //  //     $('#token').val(textStatus == 'nocontent' ? 'login failed' : data['token']);
 //  //     console.log(data);
 //  //   }).fail(function(jqxhr, textStatus, errorThrown){
 //  //     console.log(textStatus);
 //  //   });
 //  // });

 });

// var selectDiv = function(divName) {
//   var allDivs = ['aboutapp', 'cosmetic_products', 'new-product', 'new-user', 'login'];
//   allDivs.forEach(function(div){
//     $('#' + div).hide();
//     console.log("hiding " + div);
//   });
//   $('#' + divName).show();
//   console.log("showing " + divName);
// };



var getCategories = function(){
  $.ajax({
    method: 'GET',
    url: "http://localhost:3000/categories",
    headers: { Authorization: 'Token token=' + simpleStorage.get('token') }
  })
  .done(function(category_data){
    console.log(category_data);
    category_data.forEach(function(category){
      var html = "<option value='" + category.id + "'> " + category.name + "</option>";
     $('#new-prod-cat').append(html);
    });
  })
  .fail(function(){
    alert("Failed getting cosmetic categories");
  });

  // hide all the divs and show this one
  // selectDiv('login');

};

// FUNCTION THAT CHECKS TO SEE IF TOKEN IS PRESENT, TO SHOW THINGS, HIDE THINGS

var toggle = function(){
  if (simpleStorage.get('token')) {
    $("#display-cosmetic").show();
    $("#show-all-products").show();
    $("#logout").show();
    $("#user-login").hide();
    $("#userDiv").show();
  } else {
    $("#display-cosmetic").hide();
    $("#show-all-products").hide();
    $("#logout").hide();
    $("#user-login").show();
    $("#userDiv").hide();

  }
};












// curl -X POST -d "cosmetic_product[name]=lipstick 2&cosmetic_product[brand]=nars&cosmetic_product[color]=black&cosmetic_product[price]=20" http://localhost:3000/cosmetic_products




// $('#new-prod-button').click(function(){
//   var cosmetic_product = {
//   name: $("#new-prod-name").val(),
//   brand: $("#new-prod-brand").val(),
//   color: $("#new-prod-color").val(),
//   price: parseFloat($("#new-prod-price").val()),
//   purchase_date: $("#new-prod-date").val(),
//   category: $("#new-prod-cat").val()};
//   // image: $("#new-prod-image").val()};

//   $.ajax({
//     type: 'POST',
//     url: "http://localhost:3000/cosmetic_products",
//     data: {cosmetic_product: cosmetic_product}
//     }).done(function(){
//     alert ("success");
//     }).fail(function(){
//     alert ("failure");
//   });

// });



//AUTHENTICATION





//   $('#get-index').on('click', function(){
//     $.ajax('http://localhost:3000/hello',{
//       dataType: "json",
//       method: "GET",
//       headers: { Authorization: 'Token token=' + $("#token").val() }
//     }).done(function(data, textStatus) {
//       $('#result').val(JSON.stringify(data));
//       console.log(data);
//     }).fail(function(jqxhr, textStatus, errorThrown){
//       console.log(textStatus);
//     });
//   });
//   $('#get-by-id').on('click', function(){
//     $.ajax('http://localhost:3000/hello/' +
//       $('#id').val(), {
//       dataType: "json",
//       method: "GET",
//       headers: { Authorization: 'Token token=' + $("#token").val() }
//     }).done(function(data, textStatus) {
//       $('#result').val(JSON.stringify(data));
//       console.log(data);
//     }).fail(function(jqxhr, textStatus, errorThrown){
//       console.log(textStatus);

// });
