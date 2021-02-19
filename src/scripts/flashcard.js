$(function () {
    
    let flashcardArray = [];

function loadFlashcardData(flashcardFilename) {

    return $.getJSON(`data/${flashcardFilename}?cache=` + Date.now()).done(function (data) {

        flashcardArray = [...data]
    }).fail(error=>console.error(error));
       
} 

function flashcardCreate() {
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
};

function checkFlashcardAnswer(){
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
}

function nextCard() {

};

function resetCard() {
    let dataText = $('.explanatory-text').attr('data-text');
		$('.flashcard').empty().removeClass('correct-flashcard incorrect-flashcard');
		$('.explanatory-text').removeClass('darkorange-text darkgreen-text').html(dataText);
		$('.flashcard-row').find('input').val('');
}

function showSummary(){
    
};

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

//Code which executes when you click the modal button 'Test Your Vocab'
$('.modal-button').on('click', function () {
    const $modalContainer = $('.modal-body');
    const flashcardFilename = $modalContainer.data('question-file');

    loadFlashcardData(flashcardFilename).then(()=>{
        flashcardCreate($modalContainer, flashcardFilename);
    });
});

$('.flashcard-check').on('click', function () {
    checkFlashcardAnswer();
});

});