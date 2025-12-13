import type { ProjectStat } from '~/types/project/projectStat'

export const calculateProjectStats = (
  totalProjects: number,
  totalAppropriation: number,
  uniqueYears: number,
  uniqueUnits: number
): ProjectStat[] => {
  const appropriationInMillions = totalAppropriation / 1000000
  const formattedAppropriation = appropriationInMillions >= 1 
    ? `₱${appropriationInMillions.toFixed(2)}M`
    : `₱${(totalAppropriation / 1000).toFixed(2)}K`

  return [
    {
      title: 'Total Projects',
      value: totalProjects.toString(),
      change: `${totalProjects} projects`,
      changeType: 'neutral',
      iconColor: 'text-brand-blue',
      color: 'blue'
    },
    {
      title: 'Total Appropriation',
      value: formattedAppropriation,
      change: `${totalProjects} projects`,
      changeType: 'positive',
      iconColor: 'text-brand-green',
      color: 'green'
    },
    {
      title: 'Active Years',
      value: uniqueYears.toString(),
      change: `${uniqueYears} years`,
      changeType: 'neutral',
      iconColor: 'text-orange-600',
      color: 'orange'
    },
    {
      title: 'Implementing Units',
      value: uniqueUnits.toString(),
      change: `${uniqueUnits} units`,
      changeType: 'neutral',
      iconColor: 'text-purple-600',
      color: 'purple'
    }
  ]
}

