/*********************************   Global   *******************************************************/
var counterIdk = 0;
var jsonArray; // json file with questions
var answerTypeArray = ['skala','prozent','jaNein', 'hoch', 'inkrementell']; 
var reverseHandler = false;
var saveForReverse = 0;
var bereichForResults = '';
var areas = ['Ökologie','Ökonomie','Soziales','Governance'];

/*********************************   index.html   *******************************************************/
function auswahlTestart(testName) {
	// check if browser supports web storage
	if(typeof(Storage) !== 'undefined'){		
		// check test type
		if(testName === 'AusftestButton') {
			// detailed test was choosen
			localStorage.setItem('stateTest','12');
			localStorage.setItem('idkMaxCounter','4');
			} else {
				// quick test was choosen
				localStorage.setItem('stateTest','6');
				localStorage.setItem('idkMaxCounter','2');	
			}
	} else {
		// browser doesn't support web storage
		alert('Ihr Browser unterstützt einige Funktionalitäten nicht.\nBitte nutzen Sie einen anderen Browser oder aktualisieren Sie Ihren aktuellen.');
	}	
}
/*********************************   010_Introduction.html   *******************************************************/



/*********************************   020_Weighting.html      *******************************************************/

// get the weighting from last evaluation
function getLastWeighting(){
	var i = 1;
	areas.forEach(function(item) {
		if(localStorage.getItem('weighting' + item)) {
			var inputValue = parseInt(localStorage.getItem('weighting' + item));
			document.getElementById('volume'+i).value = inputValue;
			var outputValue = parseInt(localStorage.getItem('weighting' + item));
			document.getElementById('output'+i).innerHTML = outputValue;
			console.log(inputValue);
			console.log(document.getElementById('volume'+i).value);
			i++;
		}
	});
}

// 02_Wighting: Schieberegler und Anzeige synchronisieren
function anzeige(varinput, varoutput, varinput2, varinput3, varinput4){
	var output = document.getElementById(varoutput);
	var input = document.getElementById(varinput);
	output.innerHTML = input.value;
	
	// Berrechnung Gesamtwert
	var summe = sumOf(varinput, varinput2, varinput3, varinput4);
}

// 02_Wighting: Berrechnung Gesamtgewichtung & ColorChange
function sumOf(input, input1, input2, input3) {
	// Berrechnung Gesamtwert
	var x1 = parseInt(document.getElementById(input).value);
	var x2 = parseInt(document.getElementById(input1).value);
	var x3 = parseInt(document.getElementById(input2).value);
	var x4 = parseInt(document.getElementById(input3).value);
	var gesamt = parseInt(x1 + x2 + x3 + x4);
	
	// Dynamische Gesamtwertanzeige
	var gesamtWertAnzeige = document.getElementById('gesamtwert');
	gesamtWertAnzeige.innerHTML = gesamt +'%';
	
	// 0% - Check
	if(x1 == 0 || x2 == 0 || x3 == 0 || x4 == 0) {
		gesamtWertAnzeige.style.color = "red";
		return "1";
	}
	// 100% - Check	
	else if(gesamt > "100" || gesamt < "100"){
		gesamtWertAnzeige.style.color = "red";
		return "2";
	}	
	// Weiter
	else {
		gesamtWertAnzeige.style.color = "black";
	}
}

// 02_Wighting: Gesamtwert Alerts
function checkGesamtwert(summe){
	// 0% - Check
	if(summe == "1") {
		alert("Kein Bereich darf mit 0% bewertet werden.\nBitte versuchen Sie es erneut.\n");
	}	
	// 100% - Check
	else if(summe == "2"){
		alert("Die Summe aller Werte muss 100% ergeben.\nBitte versuchen Sie es erneut.\nTipp: Orientieren Sie sich an dem gegebenen Zahlenwert.");
	}	
	// Weiter
	else {
		var anker = document.getElementById("anker");
		if(confirm("Sind Sie sich sicher?\nBedingt durch die Vergleichbarkeit können die Einstellungen später zwar geändert, jedoch nicht mit früheren Auswertungen verglichen werden.")) {
			// save weigthings in storage for later
			localStorage.setItem('weightingÖkologie', document.getElementById('output1').innerHTML.replace('%', ''));
			localStorage.setItem('weightingÖkonomie', document.getElementById('output2').innerHTML.replace('%', ''));
			localStorage.setItem('weightingSoziales', document.getElementById('output3').innerHTML.replace('%', ''));
			localStorage.setItem('weightingGovernance', document.getElementById('output4').innerHTML.replace('%', ''));
			anker.href = "030_QuestionArea.html";
		}else {
			anker.href = "javascript:void(0)";
		}		
	}
}


/*********************************   030_QuestionArea.html   *******************************************************/

// Fragen laden
function loadQuestion(bereich, indikator){
	// Überprüfen ob Schnelltest oder Ausführlicher Test zu beginn gewählt
	var stateTest = localStorage.getItem("stateTest");
	//alert(stateTest);
	// TODO: Je nach Testart: andere Anzahl Indikatoren

	console.log('loadQuestion, bereich: ' + bereich);
	
	// Bereichsprüfung
	switch(bereich){
		case "Ökologie":
			// Change CSS probertys for progess arrows
			changeCSSproberties('pointer1', 'areaImg1', reverseHandler);

			// aus JSON file alle Fragen aus Bereich Ökologie filtern
			readJsonFile(bereich, indikator, 'Ökonomie');
			break;
		case "Ökonomie":
			// Change CSS probertys for progess arrows
			changeCSSproberties('pointer2', 'areaImg2', reverseHandler);
			
			// aus JSON file alle Fragen aus Bereich Ökonomie filtern
			readJsonFile(bereich, indikator, 'Soziales');
			break;
		case "Soziales":
			// Change CSS probertys for progess arrows
			changeCSSproberties('pointer3', 'areaImg3', reverseHandler);
			
			// aus JSON file alle Fragen aus Bereich Soziales filtern
			readJsonFile(bereich, indikator, 'Governance');
			break;
		case "Governance":
			// Change CSS probertys for progess arrows
			changeCSSproberties('pointer4', 'areaImg4', reverseHandler);
			
			// aus JSON file alle Fragen aus Bereich Governance filtern
			readJsonFile(bereich, indikator, false);
			break;
	}
}

function changeCSSproberties(elementId, imgId, bool) {
	var allPointerIds = ['pointer1', 'pointer2', 'pointer3', 'pointer4'];
	
	allPointerIds.forEach(function(item){
		var pointer = document.getElementById(item);
		if(item === elementId && bool === false){
			// Weiter Button erzeugt Bereichswechsel
			pointer.style.color ="white";
			pointer.style.backgroundColor ="orange";
			pointer.style.fontWeight ="bold";
			
			// Change area icons
			changeAreaIcons(imgId);			
			
		} else if (item !== elementId && bool === true) {
			// Zurück Button erzeugt Bereichswechsel
			if(allPointerIds.indexOf(item) > allPointerIds.indexOf(elementId) && sessionStorage.getItem('lastItemId') !== elementId){
				pointer.style.color ="black";
				pointer.style.backgroundColor ="white";
				pointer.style.fontWeight ="normal";
				
				// Change area icons
				changeAreaIcons(imgId);
			}
		}
	});
	// save last state for reference
	sessionStorage.setItem('lastItemId', elementId);
}

function changeAreaIcons(imgId){
	var allImgIds = ['areaImg1', 'areaImg2', 'areaImg3', 'areaImg4'];
	
	allImgIds.forEach(function(item) {
		if(item !== imgId) {
			document.getElementById(item).style.display = "none";
		} else {
			document.getElementById(item).style.display = "block";
		}		
	});
}

// Get json files from server
function readJsonFile(bereich, indikator, nextBereich){
	
	var xmlhttp = new XMLHttpRequest();
	var url = "";
	
	// Choose question json file
	if(JSON.parse(localStorage.getItem('stateTest')) === 6) {
		// Quicktest
		url ="database/questions_quickTest.json";
	} else {
		// Detailed test
		url ="database/questions_detailedTest.json";
	}	
	// Connect to server
	xmlhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200) {
			jsonArray = JSON.parse(this.responseText); // in JS Objekte umwandeln
			questionFilterByArea(jsonArray, bereich, indikator, nextBereich); // Fragen nach Bereich XY filtern
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();	
}

// Fragen nach Bereich filter
function questionFilterByArea(jsonArray, bereich, indikator, nextBereich){	
	
	var singleAreaArray = new Array();
	// Iteriert durch alle Einträge des JSON Files durch
	jsonArray.forEach(function (item, index, array){
		
		// Wählt alle Fragen aus Bereich XY aus
		if( item.bereich === bereich ){
			singleAreaArray.push(item);
		}		
		// Wenn letztes Element des Files erreicht
		if ( index === array.length - 1 ){
			frageHandler(singleAreaArray, bereich, indikator, nextBereich);
		}
	});	
}

function frageHandler(singleAreaArray, bereich, indikator, nextBereich) {
	
	// checken ob "Zurück Button" oder "Weiter button" vorher gedrückt wurde
	if(reverseHandler){
		singleAreaArray = singleAreaArray.filter(e => e.id >= saveForReverse-1);
	}
	
	var frage = filterIndikator(singleAreaArray, bereich, indikator); // Enthält eine Fragen aus aktuellem Indikator 
	var weiterButton = document.getElementById("weiterButton");
	saveForReverse = parseInt(frage.id);
	document.getElementById("questionField").innerHTML = frage.frage;	
	headlineChange(indikator, frage.indikator);
	reverseHandler = false;
	weiterButton.addEventListener("click", clickEvent);
	
	// Wird beim drücken des WeiterButtons ausgeführt
	function clickEvent() {
		var antwort = getInput();
		console.log('Frage ID: ' + frage.id + ', Antwort: ' + antwort);
		var newAreaArray = singleAreaArray.filter( e => e.id !== frage.id ); // löscht aktuelle Frage aus Array
		
		
		// Checken ob eine Antwort gesetzt wurde
		if ( antwort ){
			// Es wurde eine Antwort gesetzt
			if(antwort === 'f'){
				counterIdk++;
			}
			if(!checkIdkCounter()) {
				// Es darf noch "Ich weiß nicht" ausgewählt werden
				var questionValueArray = addQuestionToStorage(frage.id, antwort, frage.bereich, frage.indikator); // Antwortwert im lokalen Web Storage hinterlegen
				weiterButton.removeEventListener("click", clickEvent);			
				getCheckedRadioButton().checked = false; // Radio Button resetten
				// Checken ob noch eine Frage verfügbar ist
				if ( newAreaArray.length ){
					// Es ist noch eine Frage verfügbar
					frageHandler(newAreaArray, frage.bereich, frage.indikator, nextBereich);
				} else {
					// Es ist keine Frage mehr verfügbar
					if (nextBereich){
						// Es sind noch Bereiche verfügbar
						loadQuestion(nextBereich, frage.indikator);
					} else {
						// Es sind keine Bereiche mehr verfügbar
						var date = new Date();
						var weightingArray = {};
						// set date
						localStorage.setItem('date', ((date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear()));
												
						// set reference values for next evaluation
						localStorage.setItem('stateTestReference', localStorage.getItem('stateTest'));						
						var reformattedArray = areas.map(bereich => {
							console.log(bereich);
							console.log(getWeighting(bereich));
							return getWeighting(bereich)*100;
						});
						localStorage.setItem('weightingReference', JSON.stringify(reformattedArray));
						
						// calculate average values
						arithmeticMean();
						
						// go to next page
						var anker = document.getElementById("anker");
						anker.href = "060_EvaluationOverview.html";
					}
				}				
			} else {
				// Es darf nicht mehr "Ich weiß nicht" ausgewählt werden
				alert ('Sie haben die maximale Anzahl an "Ich weiß" nicht Angaben überschritten. Sie können keine weiteren Antworten mit "Ich weiß" nicht bewerten.');
				counterIdk--;
			}			
		} else {
			// Es wurde keine Antwort ausgewählt
			alert ("Bitte wählen Sie eine Antwortmöglichkeiten aus oder geben Sie einen Wert an. Danke!");
		}
	}
	
}

function checkIdkCounter() {
	if(counterIdk > parseInt(localStorage.getItem('idkMaxCounter'))) {
		// "I don't know" - values exceeds the maximum number
		return true;		
	} else {
		// "I don't know" - values doesn't exceed the maximum number
		return false;
	}
}

// Iteriert durch alle Indikatoren des jeweiligen Bereichs hindurch
function filterIndikator(singleAreaArray, bereich, indikator) {
	var question = singleAreaArray.find(e => e.indikator === indikator && e.bereich === bereich); // Erstes Element mit aktuellem Indikator suchen	
	if (!question) {
		// Keine Fragen im aktuellen Indikator vorhanden
		question = singleAreaArray[0]; // Erstes Element des Arrays auswählen
	}	
	answerTypeArray.forEach(checkAnswerType, question);	// Antworttyp überprüfen
	return question;
}

// Antworttyp überprüfen und Ansicht anpassen
function checkAnswerType(item){
	// item = antworttypen
	if(item.toLowerCase() == this.antworttyp.toLowerCase()){
		document.getElementById(item).style.display = "inline-table";
	} else {
		document.getElementById(item).style.display = "none";
	}	 
}	

// Bereich / Indikator in Überschrift wechseln
function headlineChange(oldString, nextString){	
	var old = document.getElementById("startHeading").innerHTML;
	
	
	if( reverseHandler ) {
		// Überschrift aus sessionStorage einlesen
		var newstring = old.replace(sessionStorage.getItem('nextHeadlineString'), nextString);
		document.getElementById("startHeading").innerHTML = newstring;	
	} else {
		// Überschrift anpassen
		var newstring = old.replace(oldString, nextString);
		document.getElementById("startHeading").innerHTML = newstring;		
	}
	sessionStorage.setItem('nextHeadlineString', nextString);
}

// Ausgewählte Radiobuttons filtern
function getCheckedRadioButton() {
	return document.querySelector('input[name="radio"]:checked');
}

// Radio Button Input überprüfen
function getInput() {
	var element = getCheckedRadioButton();
	if ( element === null ) {
		return null;
	} else {
		return element.value;
	}
}

// Question Array to localStorage
function addQuestionToStorage(id, value, bereich, indikator) {
	var questions = JSON.parse(localStorage.getItem('questions')) || [];
	
	// check if question with same id already exists
	var filterId = questions.findIndex(x => x.id == id);
	if(filterId != -1){
		// question id already exists
		questions.splice(filterId, 1); // delete old element
		questions = questions.filter(x => x.id-1 < filterId); // delete all elements with higher index
	}
	questions.push({'id':id, 'value': value, 'bereich': bereich, 'indikator': indikator});
	localStorage.setItem('questions', JSON.stringify(questions));
}

function reverseClick() {
	var resultArray = JSON.parse(localStorage.getItem('questions'));
	var anker = document.getElementById("ankerBack");
	reverseHandler = true;
	
	// check about questions in storage 
	if( resultArray ) {
		// questions available
		var result = resultArray.find(x=> x.id == saveForReverse-1); // Vorgänger-Eintrag finden
		// check if very first question is reached
		if( result ) {
			// still questions available
			if ( result.value === 'f' ) {
				counterIdk--;
			}			
			var weiterButton = document.getElementById('weiterButton');
			weiterButton.parentNode.innerHTML += ''; // remove Event Listener
			console.log(result.indikator);
			loadQuestion(result.bereich, result.indikator);
		} else {
			// very first question reached
			alert('Leider können Sie nicht zurück zur Gewichtung. \nNach Beginn der Beantwortung müssen alle Fragen beantwortet werden, da es sonst zu Fehlern in der Auswertung kommt.');
		}
	} else {
		// no questions available
		anker.href = "020_Weighting.html";
	}
}

// Get the weighting for each area
function arithmeticMean(question=null) {
	var jsonIndicatorArray;
	var xmlhttp = new XMLHttpRequest();
	var url = "";
	
	// Choose weighting json file
	if(JSON.parse(localStorage.getItem('stateTest')) === 6) {
		// Quicktest
		url ="database/indicatorWeighting_quickTest.json";
	} else {
		// Detailed test
		url ="database/indicatorWeighting_detailedTest.json";
	}
	console.log(url);
	// Connect to Server
	xmlhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200) {
			jsonIndicatorArray = JSON.parse(this.responseText); // contains each indicator with weighting
			var result = {};
			var value;
			jsonIndicatorArray.forEach(function (item) {
				if( question == null) {
					value = Math.round(averageValueIndikator(item.bereich, item.indikator) * item.gewichtung / 100);
				} else {
					value = Math.round(averageValueIndikator(item.bereich, item.indikator, question) * item.gewichtung / 100);
				}
				if( !result[item.bereich] ){
					// no value in array
					result[item.bereich] = value;
				} else {
					// value in array
					result[item.bereich] += value;
				}				 
				console.log(result);
				console.log(item.indikator);
			});
			localStorage.setItem('averageAreaValue', JSON.stringify(result));
		}
	};
	xmlhttp.open("GET", url, false);
	xmlhttp.send();	
} 

// Average value over all areas with area and indicator weighting
function averageValue() {
	var questions = JSON.parse(localStorage.getItem('questions')) || []; // wenn null dann leeres Array
	var questionsFiltered = questions.filter(x => x.value != "f"); // Alle Einträge außer "ich weiß nicht"
	var areaValues = [];
	var averageAreaValue = JSON.parse(localStorage.getItem('averageAreaValue')); // includes average values for each area
	var dividerArray = [];
	
	areas.forEach(function (item) {
		var multiplier = getWeighting(item);
		dividerArray.push(multiplier);
		areaValues.push(averageAreaValue[item]*multiplier); // average value of area multiplied with its weighting
	});
	var sum = areaValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0); // summiert alle Antwort-Werte auf
	var divider = dividerArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
	document.getElementById('averageValueField').innerHTML = '<font color="SeaGreen">' + Math.round((sum / divider)) + ' von 100% </font>';
	return Math.round((sum / divider));
}

// Average value of each indicators for a single area without weighting
function averageValueIndikator(bereich, indikator, questions=null){
	if ( questions == null ) {
		var questions = JSON.parse(localStorage.getItem('questions')) || []; // wenn null dann leeres Array
	}
	var questionsFiltered = questions.filter(x => x.value != "f"); // Alle Einträge außer "ich weiß nicht"

	var questionsBereich = questionsFiltered.filter(x => x.bereich === bereich); // nach Bereich filtern
	var questionsIndikator = questionsBereich.filter(x => x.indikator === indikator); // nach Indikator filtern
	var sum = questionsIndikator.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.value), 0); // je Indikator Werte aufsummieren
	return Math.round(20 *(sum / questionsIndikator.length));
}

// Indicator per area filter
function getIndikatorenFromBereich(bereich) {
	var questions = JSON.parse(localStorage.getItem('questions')) || []; // wenn null dann leeres Array
	var questionsFiltered = questions.filter(x => x.value != "f"); // Alle Einträge außer "ich weiß nicht"

	var questionsBereich = questionsFiltered.filter(x => x.bereich === bereich);  // Filter questions for given area
	
	return [... new Set(questionsBereich.map(data => data.indikator))] // Return all indicators from the given area
}

// get weighting in percent
function getWeighting(bereich) {
	return (parseInt(localStorage.getItem('weighting'+bereich))/100);
}

// export latest Data to File
function exportData() {
	if(confirm('Möchten Sie Ihre aktuelle Auswertung speichern?')) {
		areas = ['Ökologie', 'Ökonomie', 'Soziales', 'Governance'];
	var dataArray = [];
	var textTestart;
	areas.forEach(x=> dataArray.push(getWeighting(x)));
	var data = {
		stateTest: localStorage.getItem('stateTest'),
		date: localStorage.getItem('date'),
		weighting: dataArray,
		averageAreaValues: localStorage.getItem('averageAreaValue'),
		questions: JSON.parse(localStorage.getItem('questions'))
	}
	if( parseInt(localStorage.getItem('stateTest')) === 12) {
		textTestart = 'detailedTest';
	} else {
		textTestart = 'quickTest';
	}
	download(data.date + '_' + textTestart + '_export.json', JSON.stringify(data));
	}	
}

// download Textfile with Results
function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

/************************* Evaluation Overview ***************************************/
function getBestBereich(){
	var averageAreaValue = JSON.parse(localStorage.getItem('averageAreaValue'));
	var strenghtsString = document.getElementById('overviewStrenghts').innerHTML;
	var potentialString = document.getElementById('overviewPotential').innerHTML;
	
	// sortiert die durschnittlichen Werte der einzelnen Bereiche
	var bestValueStringList= areas.sort((a,b) => averageAreaValue[b] - averageAreaValue[a]); 
	console.log(bestValueStringList);
		
	// display best Value
	var newStringStrenghts = strenghtsString.replace('z/t', averageAreaValue[bestValueStringList[0]]);
	document.getElementById('overviewStrenghts').innerHTML = newStringStrenghts;
	// display best Area
	strenghtsString = document.getElementById('overviewStrenghts').innerHTML;
	newStringStrenghts = strenghtsString.replace('Bereich', bestValueStringList[0]);
	document.getElementById('overviewStrenghts').innerHTML = newStringStrenghts;
	
	// display worst Value
	var newStringStrenghts = potentialString.replace('z/t', averageAreaValue[bestValueStringList[bestValueStringList.length-1]]);
	document.getElementById('overviewPotential').innerHTML = newStringStrenghts;
	// display worst Area
	potentialString = document.getElementById('overviewPotential').innerHTML;
	newStringStrenghts = potentialString.replace('Bereich', bestValueStringList[bestValueStringList.length-1]);
	document.getElementById('overviewPotential').innerHTML = newStringStrenghts;	
}
/********************** SingleAreaOverview **********************************/
function getBereichForResults(bereich){
	localStorage.setItem('AreaForResults',bereich);
	console.log(bereich);
}


