const TWEETLENGTH = 140;

$(document).ready(function() {
  console.log('body is ready');
  $('.new-tweet form > textarea').on("input", function() {
    // console.log(this);
    // console.log($(this).val().length);
    let currLength = $(this).val().length;
    let currRemain = TWEETLENGTH - currLength;

    let divSibElem = $(this).siblings()[1];
    let counterElem = $(divSibElem).children(".counter");
    console.log(divSibElem, counterElem);
    $(counterElem).html(currRemain);
    if (currRemain < 0) {
      $(counterElem).addClass('invalid-length');
    } else {
      $(counterElem).removeClass('invalid-length');
    }
  });
});