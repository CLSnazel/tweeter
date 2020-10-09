//===============NAV <A> SCROLL TO NEW TWEET ==============//
$('nav a').click(function() {
  $('body, html').animate(
    {
      scrollTop: $('.new-tweet').offset().top - $('nav').height() - 20
    }, 
    700
  );
});

//=============SCROLL - TO - TOP ==========================//
$('#back-to-top').click(function() {
  $('body, html').animate(
    {
      scrollTop: $('body').offset().top
    },
    700
  );
});

$(document).scroll(function() {
  
  if ($('html, body').scrollTop() < 100) {
    $('#back-to-top').slideUp();
  } else {
    $('#back-to-top').slideDown();
  }
});