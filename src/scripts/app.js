(() => {

	$(function () {
		let $lastActive;
		let $questionWrapper = $('#question-wrapper'); // This variable explains to jquery what to look for in the HTML selectors. i.e. our question wrapper
		const $container = $('#question-wrapper');
		let filename = $container.data('question-file');

		loadQuestionsInto($container, filename); // This loads the question from the JSON file (called elsewhere), into our wrapper.

		$('.special-character').on('click', function (event) {
			event.preventDefault();           //this stops the button reloading the page
			if ($lastActive) { 				 // This Boolean checks to see if the last active input
				$lastActive					// was from .question-item (thus making it our user input).

					// If it is, this becomes a 'truthy' variable meaning it executes.
					.val($lastActive.val() + $(this).attr('data-char'))
					.focus();			   	// This is a predefined jquery command which gives the focus back
				// to the same element selected prior to the 'on click command'.
			}  								// in this case, the 'char' button press.
		});

		$questionWrapper.on('focus', 'input', function () {
			$lastActive = $(this);			// This marks which input is the last selected before 'char' click
		});

		$('.flashcard-row').on('focus', 'input', function () {
			$lastActive = $(this);			//This does the same as the above function, but in the modal instead of in the quiz
		});

		// This is the code that makes the audio buttons play
		$('.audio-button').on('click', function () {
			let audioElement = $(this).next('.audio-link').get(0);
			audioElement.play();
		});

		//This is the code that makes the SVG vowel table play

		$('.audio-svg').on('click', function () {
			let audiotag = $(this).attr('id');
			let audioElement = $('#audio-' + audiotag).get(0);
			audioElement.play();
		});


		//The code for the additional quiz buttons
		$('#additionalbutton').on('click', function () {
			const $container = $('#question-wrapper');
			filename = $container.data('additional-questions');
			loadQuestionsInto($container, filename);

			$(this).removeClass('light-button').addClass('solid-button active');
			$('#basicbutton').removeClass('solid-button active').addClass('light-button');
			$('small').toggleClass('hide');
		});

		$('#basicbutton').on('click', function () {
			const $container = $('#question-wrapper');
			filename = $container.data('question-file');
			loadQuestionsInto($container, filename);

			$(this).removeClass('light-button').addClass('solid-button active');
			$('#additionalbutton').removeClass('solid-button active').addClass('light-button');
			$('small').toggleClass('hide');
		});

		$('#hide-submit').on('click', function () {
			$('.table-hide').toggle();                              // This adds a jquery class to 'toggle' the visibility of an element.
			$(this).find('span').toggleClass('hide');
		});

		$('#macron-toggle').on('click', function () {
			event.preventDefault();
			$(this).find('span').toggleClass('hide');
			$('.nomacron').toggleClass('hide');
			$('.macron').toggleClass('hide');
		});

		//This is the tooltip toggle. It also closes other open tooltips.
		$('.tooltip-header').each(function () {
			$(this).on('click', function () {

				$(this).closest('.grammar-tooltip')
					.siblings('.grammar-tooltip')
					.find('.card-body')
					.addClass('hide');
				$(this).next('.card-body').toggleClass('hide');
			});
		});

		//The code for the Check button
		$('#submit').on('click', function (event) {
			event.preventDefault();
			$(this).addClass('hidden');
			$('#again').removeClass('hidden');

			$('.question').each(function () {
				let correctAnswerArray = $(this).attr('data-answer').split('|');
				let userAnswer = $(this).find('input').val().trim(); //.trim removes whitespace before and after text so it doesn't flag a false negative because of spaces

				let wasCorrect = checkAnswer(correctAnswerArray, userAnswer);
				let $commonMistake = null;

				if (!wasCorrect) {
					$(this).siblings('.common-mistakes').find('.answer').each(function () {
						let isMatch = checkAnswer([$(this).attr('data-answer')], userAnswer);

						if (isMatch) {
							$commonMistake = $(this);
						}
					});
				}

				if (wasCorrect) {  //Adds CSS to show green/red indicator around the input box.
					$(this).closest('.form-group')
						.addClass('has-success')
						.removeClass('has-error');
				} else {
					$(this).closest('.form-group')
						.removeClass('has-success')
						.addClass('has-error');
				}

				if ($commonMistake != null) {
					$commonMistake
						.removeClass('hidden')
						.parent()
						.removeClass('hidden');
				} else {
					$(this).siblings('.answer')
						.removeClass('hidden');
				}
			});
		});

		// The below code is for the Try Again? button
		$('#again').on('click', function (event) {
			event.preventDefault();

			const $container = $('#question-wrapper');
			let filename;

			if ($('#additionalbutton').hasClass('active')) {
				filename = $container.data('additional-questions');
			} else {
				filename = $container.data('question-file');
			}

			$(this).addClass('hidden');
			$('#submit').removeClass('hidden');

			loadQuestionsInto($container, filename);
		});

		$('#questionnaire-button').on('click', function (event) {
			event.preventDefault();

			const $container = $('#question-wrapper');
			let filename = $container.data('question-file');

			$(this).removeClass('light-button').addClass('solid-button');
			$('#table-quiz-button').removeClass('solid-button').addClass('light-button');

			loadQuestionsInto($container, filename);

			$('small').replaceWith('<small>In the textboxes below, fill out the fully declined version of the word in brackets.</small>');
			$('#table-submit').replaceWith('<button class="solid-button button" id="submit">Check</button>');
			$('#table-try-again').replaceWith('<button class="solid-button button hidden" id="again">Try Again?</button>');
		});

	});

	function loadQuestionsInto($container, filename) {                 // Now container=questionWrapper (where the questions are stored on the page)
		// exit if we don't have all params
		if (!$container || !filename) {
			return;
		}

		$.getJSON(`data/${filename}?cache=` + Date.now())      // This is a slight modification to cause 'cache-busting'. Basically, it appends a number to the url to prevent the browser caching this file.

			//If the file is successfully loaded this method is called
			.done(function (data) {
				$container.empty();
				let selectedQuestionsArray = [];
				for (let i = 0; i < 5; i++) {
					let question = data.splice(Math.random() * data.length | 0, 1);
					selectedQuestionsArray.push(question[0]);
				}

				selectedQuestionsArray.forEach(function (question) { //What follows is what creates the template for our questions.
					let questionSplit = question.question.split('####');
					// This splits a string at the #### delimiter and allows the input field to be placed in the middle of the sentence

					let questionLine = `<span class="question-line">${questionSplit[0]}</span>
                                    <input type="text" class="user-input form-control" placeholder="answer">
                                    <span class="question-line">${questionSplit[1]}</span>`;

					let questionItem = `<div class="question-item form-group">
                        <div class="question" data-answer="${question.correctAnswer}">
                            ${questionLine}
                        </div>
                        <div class="common-mistakes hidden">
                            ${createCommonMistakesHtml(question.commonMistakes)}
                        </div>
                        <div class="answer generic hidden">
                            ${question.explanation}
                        </div>
                    </div>`; //The backticks (`) allow for 'template literals'. These are string templates which allow embedded expressions.

					$container.append(questionItem);
				});
			})
			//If the file is NOT successfully loaded this method is called to aid my debugging
			.fail(function (jqxhr, textStatus, error) {
				console.log(textStatus, error);
			});
	}

	//This function generated the HTML for the mistake feedback
	function createCommonMistakesHtml(mistakesArray) {
		let output = '';
		mistakesArray.forEach(function (mistake) {
			output += `<div class="answer hidden" data-answer="${mistake.incorrectAnswer}">${mistake.explanation}</div>`;
		});
		return output;
	}

	//This function checks if the user inputted answer for a quiz is correct
	function checkAnswer(answerArray, userAnswer) {
		let wasUserCorrect = false;

		answerArray.forEach(function (correctAnswerArray) {
			//The below IF Statement changes both inputs to upper case so you don't get a false negative due to caps
			if (correctAnswerArray.toUpperCase().trim() == userAnswer.toUpperCase().trim()) {
				wasUserCorrect = true;
			}
		});

		return wasUserCorrect;
	}

	//The below function is for the vocabulary test modal
	function flashcardCreate($mContainer, fFilename) {
		// The below IF Statement exits the modal if it doesn't have all paramaters (to prevent load errors)
		if (!$mContainer || !fFilename) {
			return;
		}
		
		let flashcardArray = [];

		//This gets the json with the vocab array in it and chooses one object to display once it's loaded
		$.getJSON(`data/${fFilename}?cache=` + Date.now())
			.done(function (data) {

				flashcardArray = [...data]

				let flashcard = flashcardArray.splice(Math.random() * flashcardArray.length | 0, 1);

				let dataLanguage = $('.translation-button').attr('data-language');

				//This determines whether you want to translate from or to Old English
				if (dataLanguage == 'old') {
					$('.flashcard').html(`<h2>${flashcard[0].oldEnglish}</h2>`);
					$('.flashcard').data('flashcardAnswer', flashcard[0].modernEnglish);
					$('.flashcard').data('partOfSpeech', flashcard[0].partOfSpeech);
				} else {
					$('.flashcard').html(`<h2>${flashcard[0].modernEnglish}</h2>`);
					$('.flashcard').data('flashcardAnswer', flashcard[0].oldEnglish);
					$('.flashcard').data('partOfSpeech', flashcard[0].partOfSpeech);
				}
			});

		//The below code resets the flashcard's state to default
		let dataText = $('.explanatory-text').attr('data-text');
		$('.flashcard').empty().removeClass('correct-flashcard incorrect-flashcard');
		$('.explanatory-text').removeClass('darkorange-text darkgreen-text').html(dataText);
		$('.flashcard-row').find('input').val('');
	}

	//Code which executes when you click the modal button 'Test Your Vocab'
	$('.modal-button').on('click', function () {
		const $modalContainer = $('.modal-body');
		const flashcardFilename = $modalContainer.data('question-file');

		flashcardCreate($modalContainer, flashcardFilename);
	});

	//Code which checks the answer you entered
	$('.flashcard-check').on('click', function () {
		//This finds the user answer
		let userAnswer = $('.flashcard-row').find('input').val().trim(); //.trim removes whitespace before and after text so it doesn't flag a false negative because of spaces
		//This defines the correct answer - since there's multiple, it treats it as an array
		let correctAnswerArray = $('.flashcard').data('flashcardAnswer').split('|');
		//This finds the part of speech
		let partOfSpeech = $('.flashcard').data('partOfSpeech');
		//This reuses the same function as the quiz to check the user answer against the potential correct answers
		let wasCorrect = checkAnswer(correctAnswerArray, userAnswer);
		//Outputs the correct answer in the flashcard with a '/' between multiple correct answers
		let flashcardAnswer = correctAnswerArray.join(' / ');

		//These lines add the 'part of speech' and correct answer to the flash card
		$('.flashcard').append('<h3>' + partOfSpeech + '</h3>');
		$('.flashcard').find('h2').append(' — ' + flashcardAnswer);

		//Changes card colour and adds a feedback message depending on whether answer is correct or not
		if (wasCorrect == true) {
			$('.flashcard').addClass('correct-flashcard');
			$('.explanatory-text').addClass('darkgreen-text').html('Good Job!');
		} else {
			$('.flashcard').addClass('incorrect-flashcard');
			$('.explanatory-text').addClass('darkorange-text').html('Try Again!');
		}

		//This swaps which button is visible under the input field
		$('.flashcard-check').addClass('hide');
		$('.try-another').removeClass('hide');
	});

	//This function allows you to trigger the Check function using the Enter key in the input
	$('.flashcard-answer').on('keydown', function (event) {
		let checkButton = $('.flashcard-check').hasClass('hide');

		if (event.keyCode === 13 && checkButton === false) {  //This makes sure the Check button is visible so you can't trigger the check multiple times using the Enter key
			event.preventDefault();
			$('.flashcard-check').click();
		}
	});

	//Code to empty the flashcard and add a new word
	$('.try-another').on('click', function () {

		$('.flashcard-check').removeClass('hide');
		$('.try-another').addClass('hide');

		const $modalContainer = $('.modal-body');
		const flashcardFilename = $modalContainer.data('question-file');
		
		if (flashcardArray.length > 0) {
			flashcard = flashcardArray.splice(Math.random() * flashcardArray.length | 0, 1);
		}
		else {
		flashcardCreate($modalContainer, flashcardFilename);
		};
 
	});

	//Code to change whether you're translating to or from Old English
	$('.translation-button').on('click', function () {
		const $modalContainer = $('.modal-body');
		const flashcardFilename = $modalContainer.data('question-file');

		let dataLanguage = $('.translation-button').attr('data-language');
		let dataText = $('.explanatory-text').attr('data-text');
		let oldPlaceholder = $('.flashcard-answer').data('old-placeholder');
		let newPlaceholder = $('.flashcard-answer').data('new-placeholder');

		$('.explanatory-text').removeClass('darkorange-text darkgreen-text').html(dataText);

		//These lines empty the input and make sure the Check button is active (for if someone swaps language mid translation)
		$('.flashcard-row').find('input').val('');
		$('.flashcard-check').removeClass('hide');
		$('.try-another').addClass('hide');

		if (dataLanguage == 'old') {
			$('.translation-button').attr('data-language', 'modern');
			$('.translation-button').html('Modern English <i class="fas fa-exchange-alt"></i> Old English');
			$('.flashcard').empty().removeClass('correct-flashcard incorrect-flashcard');
			$('.flashcard-answer').attr('placeholder', oldPlaceholder);
			flashcardCreate($modalContainer, flashcardFilename);

		} else {
			$('.translation-button').attr('data-language', 'old');
			$('.translation-button').html('Old English <i class="fas fa-exchange-alt"></i> Modern English');
			$('.flashcard').empty().removeClass('correct-flashcard incorrect-flashcard');
			$('.flashcard-answer').attr('placeholder', newPlaceholder);
			flashcardCreate($modalContainer, flashcardFilename);
		}

	}); //close document ready

	//The below code is for the reading comprhension activities

	$('.reader-word').on('click', function (event) {
		event.preventDefault();

		if ($('.show-old-english').hasClass('solid-button')) {
			let readerOldEnglish = $(this).text().toUpperCase();
			let readerGrammar = $(this).data('grammar');
			let readerTrans = $(this).data('translation');
			let baseForm = $(this).data('base-form');
			$('.reader-tooltip').removeClass('hide');
			$('.reader-tooltip-body').find('p').empty();
			$('.reader-tooltip-body').find('.reader-tooltip-p').append('<p> <strong>' + readerOldEnglish + '</strong>' + ' - ' + readerTrans + '</p>' + '<p>Part of grammar: ' + '<em>' + readerGrammar + '</em></p>');
		
			if (typeof $(this).data('base-form') !== 'undefined') {
				$('.reader-tooltip-body').find('.reader-tooltip-p:first-child').after('<p>Base form: <em>' + baseForm + '</em></p>');
			  }
		}
	});

	$('.show-old-english').on('click', function (event) {
		event.preventDefault();
		$('.show-trans').removeClass('solid-button').addClass('light-button');
		$('.show-old-english').removeClass('light-button').addClass('solid-button');
		$('.reading-comp').removeClass('col-sm-6').addClass('col-sm-9');
		$('.reading-trans').addClass('hide');
		if ($('.reader-tooltip-column').hasClass('hide')) {
			$('.reader-tooltip-column').removeClass('hide');
		}
		if ($('.challenge-tooltip').hasClass('challenge-selected')) {
			$('.challenge-tooltip').removeClass('challenge-selected');
		}
	});

	$('.show-trans').on('click', function (event) {
		event.preventDefault();
		$('.show-trans').removeClass('light-button').addClass('solid-button');
		$('.show-old-english').removeClass('solid-button').addClass('light-button');
		$('.reading-comp').removeClass('col-sm-9').addClass('col-sm-6');
		$('.reading-trans').removeClass('hide');
		$('.reader-tooltip').addClass('hide');
	});

	$('.show-notes').on('click', function (event) {
		event.preventDefault();
		if ($('.show-notes').hasClass('light-button')) {
			$(this).removeClass('light-button').addClass('solid-button').empty().append('Hide Notes');
			$('.footnote').css('color', 'rgb(200, 100, 50)');
			$('.footnote-part').css('color', 'rgb(200, 100, 50)');
			$('.text-notes').removeClass('hide');
			$('.footnote').each(function(index) {
				$(this).after(`<a href="${window.location.pathname}#footnote${index+1}"><sup class="darkorange-text">[${index+1}]</sup></a>`);
	});
	$('.scrollable-area').find('strong').each(function(index) {
		$(this).attr('id', 'footnote'+(index+1)).append('['+(index+1)+'] ').css('color', 'rgb(200,100,50)');
});
	} else {
		$(this).removeClass('solid-button').addClass('light-button').empty().append('Show Notes');
		$('sup').empty();
		$('.scrollable-area').find('strong').empty();
		$('.text-notes').addClass('hide');
		$('.footnote').css('color', 'black');
		$('.footnote-part').css('color', 'black');

	}
})

	//This is the close icon on the glossary tooltip
	$('.close-icon').on('click', function (event) {
		event.preventDefault();
		$('.reader-tooltip-body').find('p').empty();
		$('.reader-tooltip').addClass('hide');
	});

// assign wheelzoom
wheelzoom(document.querySelectorAll('img'), {maxZoom: 4, zoom: 0.05});


})(); //close the whole thing
