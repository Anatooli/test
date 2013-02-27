var pairs; // List of employees parsed from the JSON
var chosenEmployees; // List of the selected employees

//Parse the JSON-file to an array
function getEmployees() {
	pairs = [];
	chosenEmployees = [];

	$.getJSON('data/employees.json',function(data){
		var employees = [];
		$.each(data, function(index,value){
			var pair = value.split(' ');
			employees.push(pair);
		});
		// Call the main part of the algorithm
		main(employees);
	});
};

function main(employees) {
	pairs = employees;
	
	$.each(pairs,function comparePair(index,value){

		var left = value[0];
		var right = value[1];

		// Occurrences of employees in the input list
		var leftCount = countString(left, pairs);
		var rightCount = countString(right, pairs);

		// Indexes of employees in the selectees-list
		var leftIndex = chosenEmployees.indexOf(left);
		var rightIndex = chosenEmployees.indexOf(right);

		// choose the employee that is in more pairs
		if (leftCount > rightCount) {
			if (leftIndex == -1) {
				chosenEmployees.push(left);
			}
		} else if (leftCount < rightCount) {
			if (rightIndex == -1) {
				chosenEmployees.push(right);
			}
			// both employees in equal amount of pairs:
		} else {
			if (leftIndex !== -1 || rightIndex !== -1) {
				// at least one employee from this pair has already
				// been chosen --> do nothing
			} else {
				chosenEmployees.push(left);
			}
		}
	});

	if (chosenEmployees.indexOf("1009")== -1) {
		promoteVIP();		
	}
	minimizeList();
	// Write the selectees to the <ul>-element and we're done
	selecteesToList(chosenEmployees); 
};

//If VIP's pair has only chosen employees as pairs
//replace that person with the VIP
function promoteVIP() {

	for ( var i = 0; i < pairs.length; i++) {
		var vip = pairs[i][0];
		var pair = pairs[i][1];

		if (vip == "1009" && chosenEmployees.indexOf(pair) !== -1) {
			var promote = false;

			for ( var j = 0; j < pairs.length; j++) {
				var pairsPair = pairs[j][0];
				if (pairs[j][1] == pair) {
					if (pairsPair !== vip && 
							chosenEmployees.indexOf(pairsPair) !== -1) {
						promote = true;
						break;
					} else {
						promote = false;
					}
				}
			}
			if (promote) {
				chosenEmployees[chosenEmployees.indexOf(pair)] = "1009";
				return true;
			}
		}
	}
}

//Remove employees that have only selected employees as pairs
function minimizeList() {

	var newList = [];
	for ( var i = 0; i < chosenEmployees.length; i++) {
		var employee = chosenEmployees[i];

		// Check if employee's pairs have only chosen employees as pairs.
		for ( var j = 0; j < pairs.length; j++) {
			var left = pairs[j][0];
			var right = pairs[j][1]; 

			if (left == employee || right == employee) {
				var pair = right;
				if (right == employee) {
					pair = left;
				}
				//Check if pair is chosen
				if (chosenEmployees.indexOf(pair) !== -1) {
					continue;
				} else {
					newList.push(employee);
					break;
				}
			}
		}
	}
	chosenEmployees = newList;
}

//Add given employees to "selectees" <ul> element
function selecteesToList(selectees){
	var ul = document.getElementById("selectees");
	$('#selectees').empty();
	for ( var int = 0; int < selectees.length; int++) {
		var li = document.createElement("LI");
		ul.appendChild(li);
		li.innerHTML = selectees[int];
	}
}

//Count the occurrences of a string in an array
function countString(string,array) {
	var count = 0;
	for ( var int = 0; int < array.length; int++) {
		if (array[int].indexOf(string) !== -1) {
			count++;
		}
	}
	return count;
}