<script>
    import { onMount } from 'svelte';
    // Import your actual charting library here
    
    let chart;

    onMount(() => {
        const data = {
            // This is dummy data, replace it with your actual data
            labels: ['Technology', 'Healthcare', 'Education', 'Manufacturing'],
            datasets: [{
                label: 'Average Wage',
                data: [85000, 60000, 50000, 55000],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        };

        chart = new Chart(document.getElementById('wageDisparityChart'), { type: 'bar', data: data });
    });
</script>

<div class="chart-container">
    <h2>Wage Disparity Chart</h2>
    <canvas id="wageDisparityChart"></canvas>
  </div>
  
<style>
.chart-container {
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
}
</style>