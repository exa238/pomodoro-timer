fetch("/api/stats")
  .then(res => res.json())
  .then(data => {
    new Chart(document.getElementById("weeklyChart"), {
      type: "bar",
      data: {
        labels: data.weekDays,
        datasets: [{
          label: "Pomodoros",
          data: data.weekCounts,
          backgroundColor: "#105666"
        }]
      }
    });

    new Chart(document.getElementById("categoryChart"), {
      type: "pie",
      data: {
        labels: Object.keys(data.categories),
        datasets: [{
          data: Object.values(data.categories),
          backgroundColor: ["#839958", "#D3968C", "#105666"]
        }]
      }
    });
  });
