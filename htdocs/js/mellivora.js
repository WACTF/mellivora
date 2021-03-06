$(document).ready(function () {
  highlightSelectedMenuItem();
  highlightLoggedOnTeamName();

  initialiseDialogs();
  initialiseTooltips();
  initialiseCountdowns();

  setFormSubmissionBehaviour();
});

function initialiseDialogs() {
  initialiseLoginDialog();
  showPageLoadModalDialogs();
}

function initialiseLoginDialog() {
  $("#login-dialog").on("shown.bs.modal", function (e) {
    $("#login-dialog").find("input").first().focus();
  });
}

function showPageLoadModalDialogs() {
  $(".modal.on-page-load").modal();
}

function highlightSelectedMenuItem() {
  var path = window.location.pathname;
  var activeMenuItems = document.querySelectorAll(
    '.nav a[href$="' + path + '"]'
  );

  for (var i = 0; i < activeMenuItems.length; i++) {
    if (activeMenuItems[i] && activeMenuItems[i].parentNode) {
      activeMenuItems[i].parentNode.className = "active";
    }
  }
}

function highlightLoggedOnTeamName() {
  $(".team_" + global_dict["user_id"]).addClass("label label-info");
}

function initialiseCountdowns() {
  var $countdowns = $("[data-countdown]");
  var countdownsOnPage = $("[data-countdown]").length;

  if (countdownsOnPage) {
    setInterval(function () {
      $countdowns.each(function () {
        var $countdown = $(this);
        var availableUntil = $countdown.data("countdown");
        var availableUntilDate = new Date(availableUntil * 1000);
        var secondsLeft = Math.floor(
          (availableUntilDate.getTime() - Date.now()) / 1000
        );

        var doneMessage =
          $countdown.attr("data-countdown-done") || "No time remaining";
        var countdownMessage =
          secondsLeft <= 0 ? doneMessage : prettyPrintTime(secondsLeft);
        $countdown.text(countdownMessage);
      });
    }, 1000);
  }
}

function initialiseTooltips() {
  $(".has-tooltip").tooltip();
}

/**
 * Disable all buttons on page on form submit
 */
function setFormSubmissionBehaviour() {
  $("form").on("submit", function (e) {
    $("button").prop("disabled", true);
  });
}

function pluralise(number, name) {
  if (!number) {
    return "";
  }

  return number + " " + name + (number > 1 ? "s" : "");
}

function prettyPrintTime(seconds) {
  seconds = Math.floor(seconds);

  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);

  var daysWords = pluralise(days, "day");
  var hoursWords = pluralise(hours % 24, "hour");
  var minutesWords = pluralise(minutes % 60, "minute");
  var secondsWords = pluralise(seconds % 60, "second");

  var timeParts = [];
  if (daysWords) timeParts.push(daysWords);
  if (hoursWords) timeParts.push(hoursWords);
  if (minutesWords) timeParts.push(minutesWords);
  if (secondsWords) timeParts.push(secondsWords);

  return timeParts.join(", ") + " remaining";
}

function winningTeamsToChart(ii, max_points, hours, values1, values2) {
  let ctx = $("#winning_chart_" + ii);

  let better_hours = [];
  // let now = new Date("2020-12-12 14:00:00");
  let now = new Date(new Date().getTime() + 60 * 60 * 1000);

  let stop = null;
  ii = 0;
  hours.forEach((time) => {
    let date = new Date(time);

    if (stop === null && date > now) {
      stop = ii;
    }

    label = "AM";

    let str = date.getHours() % 24;

    if (str > 12) {
      label = "PM";
      str -= 12;
    }
    better_hours.push(`${str} ${label}`);
    ii++;
  });

  let colors = [
    "#C3FACC",
    "#59EFBC",
    "#2E7296",
    "#E667B1",
    "#E59446",
    "#2FAE6B",
    "#88AA9D",
    "#B48657",
    "#6A9FF0",
    "#61D6FC",
  ];

  let datasets = [];
  for (let ii = 0; ii < values1.length; ii++) {
    let item = values1[ii];
    let points = item.points;
    if (stop !== null) {
      points = points.slice(0, stop);
    }

    datasets.push({
      label: item.team,
      data: points,
      fill: false,
      borderColor: colors[ii],
      pointBackgroundColor: colors[ii],
    });
    // }
  }

  // console.log(datasets);

  new Chart(ctx, {
    type: "line",
    data: {
      labels: better_hours,
      datasets,
    },
    options: {
      responsive: true,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "index",
        intersect: false,
      },
      // Can't just just `stacked: true` like the docs say
      legend: { labels: { fontColor: "white" } },
      scales: {
        yAxes: [
          {
            // stacked: true,
            ticks: {
              fontColor: "white",
              min: 0,
              // max: max_points,
            },
          },
        ],
        xAxes: [
          {
            // stacked: true,
            ticks: {
              fontColor: "white",
              // min: 0,
              // max: max_points,
            },
          },
        ],
      },
      animation: {
        duration: 750,
      },
    },
  });
}
