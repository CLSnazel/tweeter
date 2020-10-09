const TWEETLENGTH = 140;

$(document).ready(function() {

  //changing .counter on tweet form input
  $('.new-tweet form > textarea').on("input", function() {
    
    let currLength = $(this).val().length;
    let currRemain = TWEETLENGTH - currLength;

    //finding .counter element
    let divSibElem = $($(this).siblings('div')[0]);
    let counterElem = $(divSibElem).children(".counter");

    //setting value of the counter
    $(counterElem).html(currRemain);

    //adding class to counter if it is over it's limit
    if (currRemain < 0) {
      $(counterElem).addClass('invalid-length');
    } else {
      $(counterElem).removeClass('invalid-length');
    }

  });
});