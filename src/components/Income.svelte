<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    import { base } from '$app/paths';


    let myChart;

    let jsonData;
    let filteredData;
    let averageIncomeByRace = {};

    onMount(async () => {
        const response = await fetch(`${base}/data.json`);
        jsonData = await response.json();
        if(jsonData) {

            // Calculate the average EDUC for each RACE
            jsonData.forEach(item => {
                if (averageIncomeByRace[item.RACE]) {
                    averageIncomeByRace[item.RACE].total += parseInt(item.HOURWAGE);
                    averageIncomeByRace[item.RACE].count += 1;
                } else {
                    averageIncomeByRace[item.RACE] = { total: parseInt(item.HOURWAGE), count: 1 };
                }
            });

            for (let race in averageIncomeByRace) {
                averageIncomeByRace[race] = averageIncomeByRace[race].total / averageIncomeByRace[race].count;
            }

            // Create the chart after the component has been mounted and data is ready
            createChart();
        }
    });

    function createChart() {
        const ctx = document.getElementById('raceIncomeChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(averageIncomeByRace),
                datasets: [{
                    label: 'Average Hourly Wage by RACE in U.S.',
                    data: Object.values(averageIncomeByRace),
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
    <canvas id="raceIncomeChart"></canvas>
</div>
  
<style>
.chart-container {
    display: flex;
    flex-direction: column; /* Stack children vertically */
    align-items: center; /* Center children horizontally */
    justify-content: center; /* Center children vertically, useful if the container is taller than the sum of its children */
    padding: 20px 20px 40px 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
    height: 70vh;
}

.chart-title {
    margin-bottom: 20px; /* Adjust spacing between title and chart as needed */
}
</style>
