let $lastActive;

$(document).ready(function () {
	let $questionWrapper = $('#question-wrapper'); // This variable explains to jquery what to look for in the HTML selectors. i.e. our question wrapper
	const $container = $('#question-wrapper');
	const filename = $container.data('question-file');

	loadQuestionsInto($container, filename); // This loads the question from the JSON file (called elsewhere), into our wrapper.

	$('.special-character').on('click', function (event) {
		event.preventDefault();                                 //this stops the button reloading the page
		if ($lastActive) { 						   			    // This Boolean checks to see if the last active input
			$lastActive											// was from .question-item (thus making it our user input).
				// If it is, this becomes a 'truthy' variable meaning it executes.
				.val($lastActive.val() + $(this).attr('data-char'))
				.focus();			   							// This is a predefined jquery command which gives the focus back
			// to the same element selected prior to the 'on click command'.
		}  														// in this case, the 'char' button press.
	});

	$questionWrapper.on('focus', '.question-item input', function () {
		$lastActive = $(this);									// This marks which input is the last selected before 'char' click
	});
});

$('#hide-submit').click(function () {
	$('.table-hide').toggle();                              // This adds a jquery class to 'toggle' the visibility of an element.
	$(this).find('span').toggleClass('hide');
});

//This is the tooltip toggle. It also closes other open tooltips.
$('.tooltip-header').each(function () {
	$(this).click(function () {

		$(this).closest('.grammar-tooltip')
			.siblings('.grammar-tooltip')
			.find('.card-body')
			.addClass('hide');
		$(this).next('.card-body').toggleClass('hide');
	});
});


//The code for the Check button
$('#submit').click(function () {
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
				.removeClass('hide')
				.parent()
				.removeClass('hide');
		} else {
			$(this).siblings('.answer')
				.removeClass('hide');
		}
	});
});

// The below code is for the Try Again? button
$('#again').click(function () {
	event.preventDefault();

	let filename;
	const $container = $('#question-wrapper');

	if ($('#additionalbutton').hasClass('active')) {
		filename = $('#additionalbutton').data('new-questions');
	} else {
		filename = $container.data('question-file');
	}

	$(this).addClass('hidden');
	$('#submit').removeClass('hidden');

	loadQuestionsInto($container, filename);
});

function loadQuestionsInto($container, filename) {                 // Now container=questionWrapper (where the questions are stored on the page)
	// if no params, don't load
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
                        <div class="common-mistakes hide">
                            ${createCommonMistakesHtml(question.commonMistakes)}
                        </div>
                        <div class="answer generic hide">
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
		output += `<div class="answer hide" data-answer="${mistake.badAnswer}">${mistake.explanation}</div>`;
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

//code for the quiz button
function tableQuizCreate($container, filename) {
	// don't do anything, if parameters not provided.
	if (!$container || !filename) {
		return;
	}

	$container.empty(); //empties the container of whatever was in it before

	// contains multiple tables worth of items
	$.getJSON(filename).then(quizData => {
		//This selects a random object from the array
		const randomQuestion = quizData.splice(Math.random() * quizData.length | 0, 1)[0];

		//This creates our table and gives it the classes we need
		const $table = $('<table class="quiz-table table-striped"/>');

		// This appends the top-most row to the table and sets the colspan to the length of the property
		$table.append(`<tr><th colspan="${randomQuestion.headerRow.length}"><strong> ${randomQuestion.word} </strong></th></tr>`);

		// We initialize an empty variable we can enter content into
		let tableQuizContent = '';

		//We create a table row
		tableQuizContent += '<tr>';
		randomQuestion.headerRow.forEach(cell => {
			tableQuizContent += `<td><strong>${cell}</strong></td>`;
		});
		tableQuizContent += '</tr>\n'; // the \n adds a linebreak at the end (this is just cosmetic for reading the code later)

		randomQuestion.rows.forEach(row => {

			tableQuizContent += '<tr>';     //Creates a table row

			row.forEach((item, idx) => {
				if (idx === 0) {            //This if statement makes the first item the table header and the rest, generic cells
					tableQuizContent += `<th><strong>${item}</strong></th>`;
				} else {
					tableQuizContent += `<td><input type="text" class="user-input form-control" placeholder="answer" data-answer="${item}"></td>`;
				}
			});

			tableQuizContent += '</tr>';    //Closes the table row
		});

		$table.append(tableQuizContent);    //This populates the table
		$container.append($table);          //This adds our table into the page

		$('small').replaceWith('<small>In the table below, fill out the fully declined version of the word in the header</small>');
		$('#submit').replaceWith('<button class="solid-button button" id="check-table">Check</button>');
		$('#again').replaceWith('<button class="solid-button button hide" id="again-table">Check</button>');
	});
}

$('.table-quiz-button').click(function () {
	event.preventDefault();
	const $container = $('#question-wrapper');

	tableQuizCreate($container, 'data/table_test.json');
});