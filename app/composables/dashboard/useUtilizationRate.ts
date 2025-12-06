import { ref, computed } from 'vue'

export interface UtilizationRateData {
  label: string
  value: number
  color: string
}

export const useUtilizationRate = () => {
  const utilizationData = ref<UtilizationRateData[]>([
    { label: 'Active', value: 65, color: '#2563EB' },
    { label: 'Idle', value: 25, color: '#22C98D' },
    { label: 'Maintenance', value: 10, color: '#F59E0B' }
  ])

  const chartOptions = computed(() => ({
    chart: {
      type: 'donut',
      height: 350
    },
    labels: utilizationData.value.map(item => item.label),
    colors: utilizationData.value.map(item => item.color),
    legend: {
      position: 'bottom',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#1F2937'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#2563EB',
              formatter: (val: string) => `${val}%`
            },
            total: {
              show: true,
              label: 'Utilization',
              fontSize: '14px',
              fontWeight: 500,
              color: '#6B7280',
              formatter: () => '100%'
            }
          }
        }
      }
    }
  }))

  const chartSeries = computed(() => 
    utilizationData.value.map(item => item.value)
  )

  const totalUtilization = computed(() => 
    utilizationData.value.reduce((sum, item) => sum + item.value, 0)
  )

  return {
    utilizationData,
    chartOptions,
    chartSeries,
    totalUtilization
  }
}

