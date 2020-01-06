(() => {

	$(document).ready(function () {
		let $lastActive;
		let $questionWrapper = $('#question-wrapper'); // This variable explains to jquery what to look for in the HTML selectors. i.e. our question wrapper
		const $container = $('#question-wrapper');
		let filename = $container.data('question-file');

		loadQuestionsInto($container, filename); // This loads the question from the JSON file (called elsewhere), into our wrapper.

		// TODO: remove buttons from the page, when enabling these injected buttons
		//Adds the text for the fill-in-the-blank-quizzes
		// $('.test-header').append('<small>In the textboxes below, fill out the fully declined version of the word in brackets.</small>');
		//This adds the buttons to check the fill-in-the-blank-quiz
		// $('.form-group').append(`<button class="solid-button button" id="submit">Check</button>
		// <button class="solid-button button hidden" id="again">Try Again?</button>`);

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

		$('.flashcard-row').on('focus', 'input', function() {
			$lastActive = $(this);			//This does the same as the above function, but in the modal instead of in the quiz
		});

		// This is the code that makes the audio elements play
		$('.audio-button').on('click', function () {
			let audioElement = $(this).next('.audio-link').get(0);
			audioElement.play();
		});

		//The code for the Variant Noun button in the Strong Nouns module
		$('#additionalbutton').on('click', function () {
			const $container = $('#question-wrapper');
			const filename = $(this).data('new-questions');
			loadQuestionsInto($container, filename);

			$(this).removeClass('light-button').addClass('solid-button');
			$('#basicbutton').removeClass('solid-button').addClass('light-button active');

			$('#again').data('new-questions');
		});

		$('#basicbutton').on('click', function () {
			const $container = $('#question-wrapper');
			const filename = $(this).data('new-questions');
			loadQuestionsInto($container, filename);

			$(this).removeClass('light-button').addClass('solid-button');
			$('#additionalbutton').removeClass('solid-button').addClass('light-button active');

			$('#again').data('new-questions');
		});

		$('#hide-submit').on('click', function () {
			$('.table-hide').toggle();                              // This adds a jquery class to 'toggle' the visibility of an element.
			$(this).find('span').toggleClass('hide');
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
				filename = $('#additionalbutton').data('new-questions');
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

	//This function checks if the answer is correct
	function checkAnswer(answerArray, userAnswer) {
		let wasUserCorrect = false;

		answerArray.forEach(function (answer) {
			if (answer.toUpperCase() == userAnswer.toUpperCase()) {
				wasUserCorrect = true;
			}
		});

		return wasUserCorrect;
	}

	//code for the vocabulary test modal
	function flashcardCreate($mContainer, fFilename) {
		// exit if we don't have all params
		if (!$mContainer || !fFilename) {
			return;
		}
		//This gets the json with the vocab array in it and chooses one object to display once it's loaded
		$.getJSON(`data/${fFilename}?cache=` + Date.now())
			.done(function (data) {
				let flashcard = data.splice(Math.random() * data.length | 0, 1);
				
				let dataLanguage = $('.translation-button').attr('data-language');
		
		//This determines whether you want to translate from or to Old English
		if (dataLanguage=='old') {
				$('.flashcard').html(`<h2>${flashcard[0].oldEnglish}</h2>`);
				$('.flashcard').data('flashcardAnswer', flashcard[0].modernEnglish);
				$('.flashcard').data('partOfSpeech', flashcard[0].partOfSpeech);
			} else {
				$('.flashcard').html(`<h2>${flashcard[0].modernEnglish}</h2>`);
				$('.flashcard').data('flashcardAnswer', flashcard[0].oldEnglish);
				$('.flashcard').data('partOfSpeech', flashcard[0].partOfSpeech);
			}
			});

		//resets flashcard state to default
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
		let userAnswer = $('.flashcard-row').find('input').val().trim(); //.trim removes whitespace before and after text so it doesn't flag a false negative because of spaces
		let correctAnswer = $('.flashcard').data('flashcardAnswer');
		let partOfSpeech = $('.flashcard').data('partOfSpeech');

		//These lines add the 'part of speech' and correct answer to the flash card
		$('.flashcard').append('<h3>' + partOfSpeech + '</h3>');
		$('.flashcard').find('h2').append(' — ' + correctAnswer);

		//This changes the array content and user input to all upper case so that capitals won't affect if it's correct or not
		if (correctAnswer.toUpperCase() == userAnswer.toUpperCase()) {
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
	$('.flashcard-answer').on('keydown', function(event) {
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
		flashcardCreate($modalContainer, flashcardFilename);

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

		if (dataLanguage=='old') {
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

})(); //close the whole thing