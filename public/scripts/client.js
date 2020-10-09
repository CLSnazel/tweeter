/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function(){
  $($('.error')[0]).slideUp();
  $('#back-to-top').slideUp();
  const renderTweetResponse = function(){
    //init response <ul> container
    const $resList = $(`<ul>`);
  
    //init <li> sub-containers
    const $reportItem = $(`<li>`)
    $reportItem.attr('width','100');
    const $shareItem = $(`<li>`);
    const $likeItem = $(`<li>`);
  
    //adding <svg> to <li> with jQuery svg library: http://keith-wood.name/svg.html
    $reportItem.svg({loadURL:'/images/noun_Flag_2207078.svg'});
    $shareItem.svg({loadURL:'/images/noun_repost_2908225.svg'});
    $likeItem.svg({loadURL:"/images/noun_Heart_689240.svg#icon"});
  
    //nesting <li> in <ul>
    $resList.append($reportItem).append($shareItem).append($likeItem);
    
  
    return $resList;
  };
  
  //given a time in epoch format, return a human-readable string of (roughly) how much hours/days/months/years a tweet was posted
  const timePastSince = function(timeVal) {
    //get current time
    let currTime = new Date();
  
    let elapsedTime = (currTime.valueOf()) - timeVal;
  
    //init returned string with default value
    let elapsedString = "a few seconds ago";
  
    //set of time units to support, and their value in epoch time
    let timeUnits = {
      year:31556926,
      month: 2629743,
      day: 86400,
      hour: 3600,
      minute: 60,
    }
  
    //loop through each time unit to find best match 
    for (let time in timeUnits){
      //round down value
      let timeToUnit = Math.floor((elapsedTime / timeUnits[time]) / 1000);
  
      if(timeToUnit >= 1) {
        //set up string to include time unit
        elapsedString = `${timeToUnit} ${time}${timeToUnit > 1 ? 's' : ''} ago`;
        break;
      }
    }
  
    return elapsedString;
  }
  
  
  //creates new <article> element with tweet data
  const createTweetElement = function(tweet) {
    //initialize all nodes
    const $tweetArticle = $(`<article>`).addClass("tweet");
  
    //init header and child nodes
    const $tweetHeader = $(`<header>`);
    const $tweetImg = $(`<img>`).attr('src', tweet.user.avatars);
    const $tweetName = $(`<p>`).text(tweet.user.name);
    const $tweetHandle = $(`<p>`).addClass('handle').text(tweet.user.handle);
  
    //init tweet content 
    const $tweetContent = $(`<p>`).text(tweet.content.text);
  
    //init tweet footer
    const $tweetFooter = $(`<footer>`);
    const $tweetTime = $(`<p>`).text(timePastSince(tweet.created_at));
    const $resList = renderTweetResponse();
    
    //nesting nodes into header
    $tweetHeader.append($tweetImg).append($tweetName).append($tweetHandle);
  
    //nesting nodes into footer
    $tweetFooter.append($tweetTime).append($resList);
  
    //nesting header, foot and content into article
    $tweetArticle.append($tweetHeader).append($tweetContent).append($tweetFooter);
  
    return $tweetArticle;
  
  };
  
  const renderTweets = function(tweets) {
    
    let $tweetSection = $('#tweet-container');
    $tweetSection.empty();

    for (let tweet of tweets) {
      // console.log(tweet);
      let $tweetElem = createTweetElement(tweet);
      // console.log($tweetElem);
      $tweetSection.append($tweetElem);
    }
  };

  const loadTweets = function() {
    $.get('/tweets')
    .then((response) => {
      console.log(response);
      let orderedTweets = response.sort((a, b) => b.created_at - a.created_at);

      renderTweets(orderedTweets);
      }
    );
  };
  loadTweets();

  
  //given a message and a element to add msgElem after, 
  //adds error message as <p> tag
  const renderErrorMsg = function(msg, targetElem) {
    // const $msgElem = $('<p>').addClass('error').text(msg);
    // $msgElem.slideDown();
    // $(targetElem).after($msgElem).slideDown();
    // console.log("msg added.");
    const $msgElem = $($(targetElem).find('.error')[0]);
    // $msgElem.attr('display', 'block');
    $msgElem.text(msg);
    $msgElem.slideDown();
    // $msgElem.removeAttr('hidden');

    return;
  };

  //================FORM POST SUBMIT ==================//
  const $tweetForm = $($('section.new-tweet form')[0]);  
  $tweetForm.on('submit', function(event) {
    
    event.preventDefault();
   
    //remove previous error messages, if any
    // let previousErrors = $(this).find('.error')
    // console.log(previousErrors);
    // if(previousErrors.length > 0) {
    //   for (err of previousErrors) {
    //     $(err).remove();
    //   }
    // }
    let $errorElem = $($(this).find('.error')[0]);
    $errorElem.slideUp();
    $errorElem.empty();
    // errorElem.attr('display', 'none');

    let newTweet = $(this).serialize();

    //check if tweet is empty
    if (newTweet.length < 6) {
      // console.log('No tweet');
      renderErrorMsg("Oops! Your tweet is empty. Please enter a message first.", $(this));
    } else if (newTweet.length > TWEETLENGTH + 5) {
      // console.log('too long!');
      renderErrorMsg("Oh no! Your tweet is too long! Shorten your tweet and try again", $(this));
    } else {
      $.post('/tweets', newTweet)
      .then((response) => {
        console.log(response);
        $(this).find('textarea').val('');
        loadTweets();
      });
    }
  });

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
    console.log('scrolling!', $('html, body').scrollTop(), $('.new-tweet').offset().top);
    if ($('html, body').scrollTop() < $('.new-tweet').offset().top) {
      $('#back-to-top').slideUp();
    } else {
      $('#back-to-top').slideDown();
    }
  });

});