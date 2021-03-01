/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);

// date calculations

document.querySelector('#doMath').addEventListener('click', run)

function run() {
// Input values of date and month 
  let day = Number(document.querySelector('#myDayList').value)  
  let month = Number(document.querySelector('#myMonthList').value)
// variables for calculation and alerts
  let calculateOne = 0;
  let messageAlert = "Try a proper date.";
// varibales for seasons
  let season;
  let firstDayOf;

  // checking if the dates are proper
if (day > 31) {
    alert(messageAlert)  
} else if (day > 30 && (month == 4 || month == 6 || month == 9 || month == 11)) {
 alert(messageAlert)
} else if (day > 29 && month == 2) {
 alert(messageAlert)
} else {

  // Calculations of month
switch (month) {
    case 1:
        calculateOne = day + calculateOne;       
        monthName = "January";
        break;

    case 2:
        calculateOne = day + 31;
        monthName = "February";
        break;

    case 3:
        calculateOne = day + 59;
        monthName = "March";
        break;

    case 4:
        calculateOne = day + 90;
        monthName = "April";
        break;

    case 5:
        calculateOne = day + 120;
        monthName = "May";
        break;


    case 6:
        calculateOne = day + 151;
        monthName = "June";
        break;
    
    case 7:
        calculateOne = day + 181;
        monthName = "July";
        break;

    case 8:
        calculateOne = day + 212;
        monthName = "August";
        break;

    case 9:
        calculateOne = day + 243;
        monthName = "September";
        break;

    case 10:
        calculateOne = day + 273;
        monthName = "October";  
        break;

    case 11:
        calculateOne = day + 304;
        monthName = "November";      
        break;

    case 12:
        calculateOne = day + 334;
        monthName = "December";
        break;

    default:
        calculateOne = messageAlert;
        monthName = "";
}


// Caluclation of the season 
if (calculateOne <= 79 || calculateOne >= 354 ) {
    season = "Winter";
} else if (calculateOne >= 79 && calculateOne < 172) {
    season = "Spring";    
} else if (calculateOne >= 172 && calculateOne < 265) {
    season = "Summer";
} else if (calculateOne >= 265 && calculateOne < 354) {
    season = "Fall";
}

// Calculation of the first day of the season
    switch (calculateOne) {
        case 79:
        firstDayOf = "Spring"
        break;
        
        case 172:
        firstDayOf = "Summer"
        break;

        case 265:
        firstDayOf = "Fall"
        break;
        
        case 354:
        firstDayOf = "Winter"    
        break;

        default:
        firstDayOf = "";
        break;
    }

    let outputMsg;
    
    document.getElementById("about").innerHTML = `You were born on the ${calculateOne} day of the year, in the month of ${monthName}, day ${day}, and the season was ${season}.`;

    
    console.log(firstDayOf);
    console.log(season);
    console.log(monthName);
    console.log(day);
    console.log(calculateOne);
    console.log(month);
    let url = 'https://api.nasa.gov/planetary/apod?api_key=p5hzB7zv7TWGmQRVeA6lR9cj3eSelvrYrcXS7et1&date=2020-'
    let newDate = month + "-" + day    
    fetch(url + newDate)
  .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      console.log(data.url);
    if(data.media_type === "image"){
        document.querySelector('#nasaImg').src = data.url
    }else if (data.media_type === "video"){
        document.querySelector('#nasaVideo').src = data.url
    }else{
        alert("'Media not supported.")
    }
		document.querySelector('#title').innerHTML = data.title
		document.querySelector('#imgDate').innerHTML = data.date
		document.querySelector('#txtExplain').innerHTML = data.explanation})
    .catch(err => {
        console.log(`error ${err}`)
    });}
    
}