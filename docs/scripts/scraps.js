// //Code for features we dropped or aren't happy with
// $('#questionnaire-button').on('click', function (event) {
//     event.preventDefault();

//     const $container = $('#question-wrapper');
//     let filename = $container.data('question-file');

//     $(this).removeClass('light-button').addClass('solid-button');
//     $('#table-quiz-button').removeClass('solid-button').addClass('light-button');

//     loadQuestionsInto($container, filename);

//     $('small').replaceWith('<small>In the textboxes below, fill out the fully declined version of the word in brackets.</small>');
//     $('#table-submit').replaceWith('<button class="solid-button button" id="submit">Check</button>');
//     $('#table-try-again').replaceWith('<button class="solid-button button hidden" id="again">Try Again?</button>');
// });

// //This is the code which replaces the fill-in-the-blank with the table quiz
// $('#table-quiz-button').on('click', function (event) {
//     event.preventDefault();

//     const $container = $('#question-wrapper');
//     let filename = $container.data('table-file');

//     $(this).removeClass('light-button').addClass('solid-button');
//     $('#questionnaire-button').removeClass('solid-button').addClass('light-button');

//     tableQuizCreate($container, filename);

//     $('small').replaceWith('<small>In the table below, fill out the fully declined version of the word in the header</small>');
//     $('#submit').replaceWith('<button class="solid-button button" id="table-submit">Check</button>');
//     $('#again').replaceWith('<button class="solid-button button hidden" id="table-try-again">Try Again?</button>');
// });

// // The below code is for the Submit button on a table quiz

// $('.test-container').on('click', '#table-submit', function (event) {
//     event.preventDefault();

//     $('.user-input').each(function () {
//         let correctAnswerArray = $(this).attr('data-answer').split('|');
//         let userAnswer = $(this).val().trim(); //.trim removes whitespace before and after text so it doesn't flag a false negative because of spaces

//         let wasCorrect = checkAnswer(correctAnswerArray, userAnswer);

//         if (wasCorrect) {  //Adds CSS to show green/red indicator around the input box.
//             $(this).addClass('table-success').removeClass('table-error');
//         } else {
//             $(this).removeClass('table-success').addClass('table-error');
//         }
//     });

//     $(this).addClass('hidden');
//     $('#table-try-again').removeClass('hidden');

// });

// // The below code is for the Try Again? button on a table quiz
// $('.test-container').on('click', '#table-try-again', function (event) {
//     event.preventDefault();

//     //let filename; <- need to fix this later
//     const $container = $('#question-wrapper');
//     let filename = $container.data('table-file');


//     $(this).addClass('hidden');
//     $('#table-submit').removeClass('hidden');

//     tableQuizCreate($container, filename);
// });

// });


// function loadQuestionsInto($container, filename) {                 // Now container=questionWrapper (where the questions are stored on the page)
// // exit if we don't have all params
// if (!$container || !filename) {
//     return;
// }

// $.getJSON(`data/${filename}?cache=` + Date.now())      // This is a slight modification to cause 'cache-busting'. Basically, it appends a number to the url to prevent the browser caching this file.

//     //If the file is successfully loaded this method is called
//     .done(function (data) {
//         $container.empty();
//         let selectedQuestionsArray = [];
//         for (let i = 0; i < 5; i++) {
//             let question = data.splice(Math.random() * data.length | 0, 1);
//             selectedQuestionsArray.push(question[0]);
//         }

//         selectedQuestionsArray.forEach(function (question) { //What follows is what creates the template for our questions.
//             let questionSplit = question.question.split('####');
//             // This splits a string at the #### delimiter and allows the input field to be placed in the middle of the sentence

//             let questionLine = `<span class="question-line">${questionSplit[0]}</span>
//                             <input type="text" class="user-input form-control" placeholder="answer">
//                             <span class="question-line">${questionSplit[1]}</span>`;

//             let questionItem = `<div class="question-item form-group">
//                 <div class="question" data-answer="${question.correctAnswer}">
//                     ${questionLine}
//                 </div>
//                 <div class="common-mistakes hidden">
//                     ${createCommonMistakesHtml(question.commonMistakes)}
//                 </div>
//                 <div class="answer generic hidden">
//                     ${question.explanation}
//                 </div>
//             </div>`; //The backticks (`) allow for 'template literals'. These are string templates which allow embedded expressions.

//             $container.append(questionItem);
//         });
//     })
//     //If the file is NOT successfully loaded this method is called to aid my debugging
//     .fail(function (jqxhr, textStatus, error) {
//         console.log(textStatus, error);
//     });
// }

// //This function generated the HTML for the mistake feedback
// function createCommonMistakesHtml(mistakesArray) {
// let output = '';
// mistakesArray.forEach(function (mistake) {
//     output += `<div class="answer hidden" data-answer="${mistake.incorrectAnswer}">${mistake.explanation}</div>`;
// });
// return output;
// }

// //This function checks if the answer is correct
// function checkAnswer(answerArray, userAnswer) {
// let wasUserCorrect = false;

// answerArray.forEach(function (answer) {
//     if (answer.toUpperCase() == userAnswer.toUpperCase()) {
//         wasUserCorrect = true;
//     }
// });

// return wasUserCorrect;
// }


// //code for the quiz button
// function tableQuizCreate($container, filename) {
// // exit if we don't have all params
// if (!$container || !filename) {
//     return;
// }

// $container.empty(); //empties the container of whatever was in it before

// // contains multiple tables worth of items
// $.getJSON(`data/${filename}`).then(quizData => {
//     //This selects a random object from the array
//     const randomQuestion = quizData.splice(Math.random() * quizData.length | 0, 1)[0];

//     //This creates our table and gives it the classes we need
//     const $table = $('<table class="quiz-table table-striped"/>');

//     // This appends the top-most row to the table and sets the colspan to the length of the property
//     $table.append(`<tr><th colspan="${randomQuestion.headerRow.length}"><strong> ${randomQuestion.word} </strong></th></tr>`);

//     // We initialize an empty variable we can enter content into
//     let tableQuizContent = '';

//     //We create a table row
//     tableQuizContent += '<tr>';
//     randomQuestion.headerRow.forEach(cell => {
//         tableQuizContent += `<td><strong>${cell}</strong></td>`;
//     });
//     tableQuizContent += '</tr>\n'; // the \n adds a line break at the end (this is just cosmetic for reading the code later)

//     randomQuestion.rows.forEach(row => {

//         tableQuizContent += '<tr class="quiz-table-line">';     //Creates a table row

//         row.forEach((item, idx) => {
//             if (idx === 0) {            //This if statement makes the first item the table header and the rest, generic cells
//                 tableQuizContent += `<th><strong>${item}</strong></th>`;
//             } else {
//                 tableQuizContent += `<td><input type="text" class="user-input form-control" placeholder="answer" data-answer="${item}"></td>`;
//             }
//         });

//         tableQuizContent += '</tr>';    //Closes the table row
//     });

//     $table.append(tableQuizContent);    //This populates the table
//     $container.append($table);          //This adds our table into the page

//     $('small').replaceWith('<small>In the table below, fill out the fully declined version of the word in the header.</small>');
//     $('#submit').replaceWith('<button class="solid-button button" id="table-submit">Submit</button>');
//     $('#again').replaceWith('<button class="solid-button button hidden" id="table-try-again">Try Again?</button>');
// });
// }