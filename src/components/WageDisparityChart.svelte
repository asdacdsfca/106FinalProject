<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    let myChart;

    let jsonData;
    let filteredData;
    let averageEducByRace = {};

    onMount(async () => {
        const response = await fetch('data.json');
        jsonData = await response.json();
        if(jsonData) {
            filteredData = jsonData.filter(d => d.REGION === "SOUTH REGION");

            // Calculate the average EDUC for each RACE
            filteredData.forEach(item => {
                if (averageEducByRace[item.RACE]) {
                    averageEducByRace[item.RACE].total += parseInt(item.EDUC);
                    averageEducByRace[item.RACE].count += 1;
                } else {
                    averageEducByRace[item.RACE] = { total: parseInt(item.EDUC), count: 1 };
                }
            });

            for (let race in averageEducByRace) {
                averageEducByRace[race] = averageEducByRace[race].total / averageEducByRace[race].count;
            }

            // Create the chart after the component has been mounted and data is ready
            createChart();
        }
    });

    function createChart() {
        const ctx = document.getElementById('raceEducChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(averageEducByRace),
                datasets: [{
                    label: 'Average EDUC by RACE in SOUTH REGION',
                    data: Object.values(averageEducByRace),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
</script>

<div class="chart-container">
    <h2>Wage Disparity Chart</h2>
    <canvas id="raceEducChart"></canvas>
</div>
  
<style>
.chart-container {
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
}
</style>
