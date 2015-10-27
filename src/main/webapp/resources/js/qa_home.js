/*jslint browser: true, unparam: true, todo: true */
/*global $, jQuery, console, alert, OAuth */
/*global APP_PASSWORD_ID, APP_SECURE_PORT, APP_ROOT, GAMES_FRAMEWORK_ROOT, GAMES_FRAMEWORK_SECURE_ROOT, GF_RESOURCES_PATH, RESOURCES_PATH*/
/*global getAbsoluteURL, storeCredentials, eraseCredentials, makeSecureURL, redirectToLogout, logout, redirectToFrameworkLogout, checkCredentials, retrieveCredentials, makeAbsolute, getIdFromUrl, updateUsernameField, handleError*/
/*global LEVEL_NAMES*/

function QuandaHome() {
    "use strict";

    /**
     * @const
     * @type {string}
     */
    this.API_BASE = "webapi/";
    /**
     * @const
     * @type {string}
     */
    this.API_QUESTION = "question";
    /**
     * @const
     * @type {string}
     */
    this.API_ANSWER = "answer";
    /**
     * @const
     * @type {string}
     */
    this.PATH_CHALLENGE = "#challenge";
    /**
     * word currently in the answer box, array of cells
     * @type {Array.<object>}
     */
    this.answerWord = null;
    /**
     * index of the selected letter in the answer box
     * @type {number}
     */
    this.selectedAnswerIndex = -1;
    /**
     * container for the answer image
     * @type {object}
     */
    this.answerPreview = null;
    /**
     * input under the answer box
     * @type {object}
     */
    this.inputAnswer = null;
    /**
     * Change topic flag.
     * @type {boolean}
     */
    this.changeTopic = false;
}

var QA;

$(window).load(function documentReadyCallback() {
    "use strict";

    /***** INIT FUNCTIONS ******/
    QuandaHome.prototype.init = function () {
        $("#play_button").click(QA.playClick);
        $("#answer_button").click(QA.answerClick);
        $("#skip_button").click(QA.playClick);
        $("#topic_switch").bind("click", QA.topicSwitchClick);
        QA.initAnswer();

        QA.answerPreview = $("#answerPreview");
        QA.inputAnswer = $("<input>", {
            type: "text",
            "class": "input_element"
        }).appendTo(QA.answerPreview);
        QA.inputAnswer.bind("keydown", QA.inputAnswerKeyDown);



        if (checkCredentials()) {
            $("#login_button").remove();
            $("#login_links").append("<input type='submit' value='Logout' onclick='logout()'><span id='username' class='h'></span>");
            updateUsernameField("#username");

            if (0 < window.location.href.indexOf("#challenge")) {
                QA.playClick();
            }
        } else {
            $("#login_button").click(function loginButtonClick() {
                retrieveCredentials();
            });
        }
    };

    QuandaHome.prototype.playClick = function (ignored) {
        if (!checkCredentials()) {
            retrieveCredentials(makeAbsolute(QA.PATH_CHALLENGE));
        } else {
            QA.getChallenge();
        }
    };

    QuandaHome.prototype.answerClick = function answerClick(ignored) {
        var roundDiv = $("#round_quanda"),
            questionId = roundDiv.data("questionId"),
            answer = QA.getAnswer();

        QA.postRequest(QA.API_ANSWER, [["questionId", questionId],["answer", answer]], function postAnswerSuccess(response) {
            var startTitle = document.getElementById("start_title"),
                playButton = document.getElementById("play_button"),
                checkTopic = $("#switches"),
                startDiv = $("#start_quanda");

            if (response) {
                startTitle.textContent = "You won!";
                playButton.textContent = "Win more";
            } else {
                startTitle.textContent = "You've lost!";
                playButton.textContent = "Try again";
            }

            QA.changeTopic = false;
            $("#topic_switch").css("background", "url('" + GF_RESOURCES_PATH + "images/unchecked_dark_checkbox.png') no-repeat left center");

            checkTopic.show();

            roundDiv.hide();
            startDiv.show();
        });
    };

    QuandaHome.prototype.getRequest = function (url, successCallback, errorCallback, parameters) {
        $.jOauth({
            urlId: url,
            dataType: "json",
            onSuccess: function (xhr) {
                if (successCallback) {
                    successCallback(JSON.parse(xhr.responseText), xhr.status);
                }
            },
            onError: function (xhr, status) {
                if (errorCallback) {
                    errorCallback(xhr, status);
                }
            },
            parameters: parameters,
            baseURL: QA.API_BASE,
            method: "GET"
        });
    };

    QuandaHome.prototype.postRequest = function (url, parameters, successCallback) {
        $.jOauth({
            contentType: "application/json",
            urlId: url,
            dataType: "json",
            onSuccess: function postRequestSuccessCallback(xhr) {
                if (successCallback) {
                    if (xhr.responseText) {
                        successCallback(JSON.parse(xhr.responseText));
                    } else {
                        successCallback();
                    }
                }
            },
            parameters: parameters,
            baseURL: QA.API_BASE,
            method: "POST",
            error: this.error
        });
    };

    QuandaHome.prototype.getChallenge = function () {
        QA.getRequest(QA.API_QUESTION, function getQuestionSuccess(response) {
            var roundDiv = $("#round_quanda");

            roundDiv.data("questionId", response.id);
            document.getElementById("q_text").textContent = response.content;

            QA.recreateAnswerWord(response.answerLength);

            $("#start_quanda").hide();
            roundDiv.show();
        }, null, [["changeTopic", QA.changeTopic]]);
        QA.changeTopic = false;
    };

    /**
     * Compiles answer from answer box.
     * @returns {string} answer
     */
    QuandaHome.prototype.getAnswer = function getAnswer() {
        var answer = "";

        QA.answerWord.forEach(function (d) {
            answer = answer + d.letter;
        });
        return answer.toLowerCase();
    };

    QuandaHome.prototype.inputAnswerKeyDown = function inputAnswerKeyDown(e) {
        var character,
            re1;
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            switch (e.keyCode) {
                case 27: //ESC - reset the word
                    QA.answerWord.forEach(function (d, i) {
                        d.letter = " ";
                        d.mask = false;
                    });
                    break;
                case 46: // delete
                    QA.clearAnswerLetter();
                    break;
                case 8: // backspace
                    QA.clearAnswerLetter();
                    if (0 < QA.selectedAnswerIndex) {
                        QA.selectedAnswerIndex = QA.selectedAnswerIndex - 1;
                    }
                    break;
                case 32: //space
                    QA.clearAnswerLetter();
                    if (QA.selectedAnswerIndex < QA.answerWord.length - 1) {
                        QA.selectedAnswerIndex = QA.selectedAnswerIndex + 1;
                    }
                    break;
                case 39: //right
                    if (QA.selectedAnswerIndex < QA.answerWord.length - 1) {
                        QA.selectedAnswerIndex = QA.selectedAnswerIndex + 1;
                    }
                    break;
                case 40://down
                case 38://up
                    return;
                case 37: //left
                    if (0 < QA.selectedAnswerIndex) {
                        QA.selectedAnswerIndex = QA.selectedAnswerIndex - 1;
                    }
                    break;
                default: //a letter
                    // TODO internationalization problem
                    if (e.keyCode > 111 && e.keyCode < 124) {
                        return;
                    }
                    character = String.fromCharCode(e.keyCode);
                    re1 = /^[a-zA-Z]$/;
                    if (re1.test(character)) {
                        QA.updateAnswerLetter(character.toUpperCase());
                        if (QA.selectedAnswerIndex < QA.answerWord.length - 1) {
                            QA.selectedAnswerIndex = QA.selectedAnswerIndex + 1;
                        }
                    }
                    break;
            }
            QA.answerPreview.crosswordImage("changeSelected", QA.selectedAnswerIndex);
            QA.answerPreview.crosswordImage("drawCells");
        }
    };

    /**
     * Clears currently selected answer letter.
     */
    QuandaHome.prototype.clearAnswerLetter = function () {
        var cell = QA.answerWord[QA.selectedAnswerIndex];
        cell.letter = " ";
    };

    /**
     * Updates currently selected answer letter.
     * @param {string} letter new letter
     */
    QuandaHome.prototype.updateAnswerLetter = function (letter) {
        var cell = QA.answerWord[QA.selectedAnswerIndex];
            letter = letter.toUpperCase();
            if (cell.letter.toUpperCase() !== letter) {
                cell.letter = letter;
            }
    };

    QuandaHome.prototype.initAnswer = function () {
        this.answerWord = null;
        this.selectedAnswerIndex = -1;
    };

    /**
     * Recreates answer word.
     * @param {number} answerLength number of characters in the answer
     */
    QuandaHome.prototype.recreateAnswerWord = function (answerLength) {
        QA.answerWord = [];

        for (var i = 0; i < answerLength; i++) {
            QA.answerWord.push({
                "cellNo": QA.answerWord.length,
                "white": true,
                "letter": " ",
                "mask": false
            });
        }

        QA.recreateAnswerImage();
    };

    QuandaHome.prototype.recreateAnswerImage = function () {
        QA.answerPreview.find("svg").remove();
        QA.answerPreview.crosswordImage({
            width: QA.answerWord.length * 35,
            height: 35,
            numCols: QA.answerWord.length,
            numRows: 1,
            callback: function (selectedIndex) {
                QA.selectedAnswerIndex = selectedIndex;
                QA.inputAnswer.focus();
                QA.inputAnswer.click();
                QA.inputAnswer.val(" ");
            },
            inputElement: QA.inputAnswer,
            clipContent: false,
            blackIsSelectable: false,
            selectable: true,
            cells: QA.answerWord
        });
    };

    QuandaHome.prototype.topicSwitchClick = function topicSwitchClick() {
        QA.changeTopic = !QA.changeTopic;
        if (QA.changeTopic) {
            $("#topic_switch").css("background", "url('" + GF_RESOURCES_PATH + "images/checked_dark_checkbox.png') no-repeat left center");
        } else {
            $("#topic_switch").css("background", "url('" + GF_RESOURCES_PATH + "images/unchecked_dark_checkbox.png') no-repeat left center");
        }
    };

    QA = new QuandaHome();
    QA.init();
});