
page1 = document.getElementById('page-one');
// page2 = document.getElementById('page-two');
page3 = document.getElementById('page-three');

// hide patient info screen to start
page3.style.display = 'none';
// page1.style.display = 'none';

// Get the <span> element that closes the modal
var closeBtn = document.getElementsByClassName("close");
// console.log(closeBtn);

// display DDx options
// load ddx options from json
d3.json("data/ddx.json").then(function (ddxList) {
  // Get the modal
  var ddxModal = document.getElementById("ddx");
  var ddxModalContent = ddxModal.firstElementChild;

  // add categories to modal
  // console.log(ddxList);
  var ddxCatList = [];
  ddxList.forEach(function(diagnosis) {
    // console.log(diagnosis);
    if (!ddxCatList.includes(diagnosis['Category'])) {
      ddxCatList.push(diagnosis['Category']);
    }
  });
  // console.log(ddxCatList);
  var ddxModalCat = null;
  ddxCatList.forEach(function (category) {
    // add collapsible list headers for each category
    // add button
    var ddxCatBtn = document.createElement("button");
    ddxCatBtn.className = "collapsible";
    ddxCatBtn.setAttribute("type","button");
    ddxCatBtn.innerHTML = category;
    ddxModalContent.appendChild(ddxCatBtn);

    // add divs for buttons
    var content = document.createElement("div");
    content.className = "content";
    content.style.display = "block";  // temp fix for collapsible buttons not working
    ddxModalContent.appendChild(content);
    var row = document.createElement("div");
    row.className = "row";
    content.appendChild(row);

    // add diagnosis buttons
    ddxList.filter(function (item) {
      if (item["Category"] == category) {
        // console.log(item["Diagnosis"]);
        var diagBtn = document.createElement("button");
        diagBtn.className = "button-primary";
        diagBtn.setAttribute("type","button");
        diagBtn.setAttribute("id",item["Diagnosis"]);
        diagBtn.innerHTML = item["Diagnosis"];
        diagBtn.onclick = function() {
          // add to DDx section and summary statements
          var ddxDiv = document.getElementById("ddx-list");
          var ddxDivItem = document.createElement("div");
          ddxDivItem.innerHTML = item["Category"]+": "+item["Diagnosis"]+"<span class='removeDDx'>&times;</span>";
          ddxDiv.appendChild(ddxDivItem);

          // remove DDx on click
          var removeDDxBtns = document.getElementsByClassName('removeDDx');
          // console.log(removeDDxBtns);
          for (var i = 0; i < removeDDxBtns.length; i++) {
            removeDDxBtns[i].onclick = function () {
              var DDx = this.parentNode;
              DDx.parentNode.removeChild(DDx);

            };
          };

          var statement = document.createElement("div")
          statement.innerHTML = "DDx: "+item["Diagnosis"];
          // create <br> element
          var br = document.createElement('br')
          document.getElementById('ed-course').append(item["Diagnosis"], br);

          //close ddx modal
          ddx.style.display = "none";
        };

        row.appendChild(diagBtn);
      }
    });

  })

  // Get the button that opens the modal
  var ddxBtn = document.getElementById("ddx-btn");

  // When the user clicks on the button, open the modal
  ddxBtn.onclick = function() {
    ddxModal.style.display = "block";
  }

  // When the user clicks on (x), close the modal
  // change from hard-coding [2] value - seems error-prone
  closeBtn[2].onclick = function() {
    // console.log("close");
    ddxModal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == ddxModal) {
      ddxModal.style.display = "none";
    }
  }
});

// collapsible areas
var coll = document.getElementsByClassName("collapsible");
// console.log(coll);
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    // console.log("clicked");
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}



// Get the modal
var patientEncModal = document.getElementById("patient-enc");

// Get the button that opens the modal
var btn = document.getElementById("patient-enc-btn");

// When the user clicks on the button, open the modal
btn.onclick = function() {
  patientEncModal.style.display = "block";
}

// When the user clicks on (x), close the modal
closeBtn[1].onclick = function() {
  // console.log("close");
  patientEncModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == patientEncModal) {
    patientEncModal.style.display = "none";
  }
}

d3.json("data/case-desc.json").then(function(casesJson) {
  displayCases(casesJson);
});

function displayCases(cases) {
  // console.log("displayCases");
  // console.log(cases);
  // Case List Selection
  // Get the modal
  var caseListModal = document.getElementById("case-list");

  // Get the button that opens the modal
  var caseListBtn = document.getElementById("case-list-btn");

  // Get the <span> element that closes the modal
  // var closeBtn = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  caseListBtn.onclick = function() {
    caseListModal.style.display = "block";
  }

  // When the user clicks on (x), close the modal
  closeBtn[0].onclick = function() {
    caseListModal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == caseListModal) {
      caseListModal.style.display = "none";
    }
  }

  var caseSelection = document.getElementById("case-selection");


  // empty case list
  // caseSelection.empty();
  while(caseSelection.firstChild) {
    caseSelection.removeChild(caseSelection.firstChild);
  }

  // loop through cases to build list
  cases.forEach(function (item) {
    var caseItem = caseSelection.appendChild(document.createElement("option"));
    // console.log(caseItem);
    caseItem.value = item['CaseNumber'];
    caseItem.innerHTML = item["PatientName"]+" - "+item["Age"]+item["Gender"]+" - "+
        item["ChiefComplaint"];
  });

  // button selects case
  document.getElementById("select-btn").addEventListener("click", function (e) {
    console.log(caseSelection.value);
    // document.getElementById("case-list").modal("hide");

    // select case with selected ID number
    // console.log(document.getElementById("case-selection").children);
    var caseNumber = caseSelection.value;
    var caseDetails = [];
    cases.forEach(function (item) {
      if (item["CaseNumber"] == caseNumber) {
        caseDetails = item;
      }
    });

    // hide modal
    caseListModal.style.display = "none";

    // hide case selection area and show case details
    page1.style.display = 'none';
    page3.style.display = 'block';

    // build case details page
    // console.log(caseDetails);
    showCase(caseDetails);
  }, false);

} //end displayCases

function showCase(details) {
  document.getElementById("patient-name").append(details["PatientName"]);
  // console.log(details["History1"] + details["History2"]);
  document.getElementById("HPI").append(details["History1"] +" "+ details["History2"]);
  var VSRhythm = document.getElementById("VSRhythm");
  VSRhythm.innerHTML = "<img src='images/VRhythm_NSR.png' width=50%>"

  // list of vitals
  var vitalsList = ["VSPulse", "VSSBP", "VSDBP", "VSO2Sat", "VSTemperature", "VSRespiratoryRate"];
  // loop over array to print on screen
  vitalsList.forEach(function (item, index) {
    var el = document.getElementById(item);
    el.innerHTML = details[item];

  });

  // patient encounter
  var ROSList = ["ROSGeneral", "ROSHEENT", "ROSRespiratory", "ROSCardiovascular", "ROSGastrointestinal", "ROSGenitoruinary", "ROSMusculoskeletal", "ROSNeurologic", "ROSBehavioral", "ROSSkin"];
  ROSList.forEach(function (item, index) {
    var el = document.getElementById(item);
    // console.log(el);
    var elBtn = document.getElementById(item+"Btn");
    if (elBtn == null) {
      console.log(item);
    }
    elBtn.onclick = function() {
      el.innerHTML = item+": "+details[item];
      el.style.display = "inline";
      el.style["padding-left"] = "10px";
      var statement = document.createElement("div")
      statement.innerHTML = item+": "+details[item];
      // create <br> element
      var br = document.createElement('br')
      document.getElementById('ed-course').append("Performed "+item, br);

      //close patient-enc modal
      patientEncModal.style.display = "none";
    };
  });

  // physical exam
  var PEList = ["PEGeneralAppearance", "PEHEENT", "PENeck", "PECardiovascular", "PERespiratory", "PEMusculoskeletal", "PEGastrointestinal", "PEGenitourinary", "PESkin", "PENeurologic", "PEBehavioral"];
  PEList.forEach(function (item, index) {
    var el = document.getElementById(item);
    var elBtn = document.getElementById(item+"Btn");
    // if (elBtn == null) {
    //   console.log(item);
    //   console.log(details[item]);
    // }
    elBtn.onclick = function() {
      el.innerHTML = item+": "+details[item];
      el.style.display = "inline";
      el.style["padding-left"] = "10px";
      var statement = document.createElement("div")
      statement.innerHTML = item+": "+details[item];
      // create <br> element
      var br = document.createElement('br')
      document.getElementById('ed-course').append(item, br);

      //close patient-enc modal
      patientEncModal.style.display = "none";
    };
  });

} //end showCase
