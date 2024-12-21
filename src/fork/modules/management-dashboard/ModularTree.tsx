"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import './styles.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface MarketSegment {
  id: string
  name: string
  marketSize: string
  growthRate: string
  keyMetric: string
  profitMargin: string
  customerAcquisitionCost: string
  lifetimeValue: string
  revenuePerEmployee: string
  projectedGrowth: number[]
  children?: MarketSegment[]
}

// Sample market data
const marketData: MarketSegment = {
  id: "global-market",
  name: "Global Cannabinoid Market",
  marketSize: "$500B",
  growthRate: "7.5% CAGR",
  keyMetric: "25% YoY Revenue Growth",
  profitMargin: "35%",
  customerAcquisitionCost: "$2.5M",
  lifetimeValue: "$50M",
  revenuePerEmployee: "$800K",
  projectedGrowth: [500, 537.5, 577.8, 621.1, 667.7],
  children: [
    {
      id: "chronic-pain",
      name: "Chronic Pain",
      marketSize: "$80B",
      growthRate: "9.5% CAGR",
      keyMetric: "30% Reduction in Opioid Prescriptions",
      profitMargin: "40%",
      customerAcquisitionCost: "$2,000",
      lifetimeValue: "$50,000",
      revenuePerEmployee: "$600,000",
      projectedGrowth: [80, 87.6, 96.0, 105.1, 115.0],
    },
    {
      id: "anxiety",
      name: "Anxiety",
      marketSize: "$60B",
      growthRate: "10.0% CAGR",
      keyMetric: "$900 Savings on Benzodiazepines per Patient",
      profitMargin: "38%",
      customerAcquisitionCost: "$1,500",
      lifetimeValue: "$40,000",
      revenuePerEmployee: "$500,000",
      projectedGrowth: [60, 66.0, 72.6, 79.9, 87.9],
    },
    {
      id: "sleep-disorders",
      name: "Sleep Disorders",
      marketSize: "$50B",
      growthRate: "9.0% CAGR",
      keyMetric: "15% Reduction in Prescription Sleep Aid Usage",
      profitMargin: "37%",
      customerAcquisitionCost: "$1,200",
      lifetimeValue: "$30,000",
      revenuePerEmployee: "$450,000",
      projectedGrowth: [50, 54.5, 59.4, 64.8, 70.6],
    }
  ]
}

interface ModularTreeProps {
  data?: MarketSegment
}

export default function ModularTree({ data = marketData }: ModularTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([data.id]))
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment | null>(null)
  const [comparisonSegments, setComparisonSegments] = useState<MarketSegment[]>([])

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const addToComparison = (segment: MarketSegment) => {
    if (comparisonSegments.length < 3 && !comparisonSegments.some(s => s.id === segment.id)) {
      setComparisonSegments([...comparisonSegments, segment])
    }
  }

  const removeFromComparison = (segmentId: string) => {
    setComparisonSegments(comparisonSegments.filter(s => s.id !== segmentId))
  }

  const getColorClass = (growthRate: string) => {
    const rate = parseFloat(growthRate)
    if (rate > 10) return "bg-green-100 border-green-500 text-green-700"
    if (rate > 5) return "bg-yellow-100 border-yellow-500 text-yellow-700"
    return "bg-red-100 border-red-500 text-red-700"
  }

  const renderNode = (node: MarketSegment, depth: number = 0) => {
    const isExpanded = expanded.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const colorClass = getColorClass(node.growthRate)
    
    return (
      <div className="flex flex-col items-center" key={node.id}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-72 m-2"
        >
          <button
            onClick={() => {
              toggleExpand(node.id)
              setSelectedSegment(node)
            }}
            className={`
              w-full p-4 rounded-lg border-2 
              ${colorClass}
              ${hasChildren ? "cursor-pointer" : "cursor-default"}
              hover:opacity-80 transition-colors
              flex flex-col items-start justify-between
            `}
          >
            <div className="flex flex-col items-start w-full">
              <span className="font-semibold text-lg">{node.name}</span>
              <span className="text-sm mt-1">Market Size: {node.marketSize}</span>
              <span className="text-sm font-bold">Growth: {node.growthRate}</span>
              <span className="text-sm mt-2">Key Metric: {node.keyMetric}</span>
            </div>
            {hasChildren && (
              <div className="absolute bottom-2 right-2">
                <span className="text-xl">
                  {isExpanded ? "−" : "+"}
                </span>
              </div>
            )}
          </button>
          <button
            onClick={() => addToComparison(node)}
            className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-blue-600"
          >
            +
          </button>
        </motion.div>
        
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              flex flex-wrap justify-center items-start
              relative pt-4 mt-2
              before:absolute before:top-0 before:w-px before:h-4 before:bg-gray-300
            `}
          >
            {node.children?.map((child, index) => (
              <div key={child.id} className="relative">
                {renderNode(child, depth + 1)}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  const renderComparisonChart = () => {
    if (comparisonSegments.length === 0) return null

    const data = {
      labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      datasets: comparisonSegments.map((segment, index) => ({
        label: segment.name,
        data: segment.projectedGrowth,
        borderColor: `hsl(${index * 120}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 120}, 70%, 50%, 0.5)`,
      })),
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Projected Growth Comparison',
        },
      },
    }

    return (
      <div className="mt-8 p-4 bg-white rounded-lg shadow-lg">
        <Line data={data} options={options} />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-indigo-100 opacity-50" />
      
      {/* Tree Content */}
      <div className="relative flex flex-col items-center">
        <h1 className="text-3xl font-bold text-indigo-900 mb-8">Market Segmentation Analysis</h1>
        {renderNode(data)}
      </div>

      {/* Comparison Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">Segment Comparison</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          {comparisonSegments.map(segment => (
            <div key={segment.id} className="bg-white p-2 rounded-lg shadow flex items-center">
              <span>{segment.name}</span>
              <button
                onClick={() => removeFromComparison(segment.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {renderComparisonChart()}
      </div>

      {/* Selected Segment Details */}
      <AnimatePresence>
        {selectedSegment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg border-t-2 border-indigo-200"
          >
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">{selectedSegment.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Market Size</h3>
                <p className="text-2xl font-bold text-indigo-900">{selectedSegment.marketSize}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Growth Rate</h3>
                <p className="text-2xl font-bold text-indigo-900">{selectedSegment.growthRate}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">Key Metric</h3>
                <p className="text-2xl font-bold text-green-700">{selectedSegment.keyMetric}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Profit Margin</h3>
                <p className="text-2xl font-bold text-indigo-900">{selectedSegment.profitMargin}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Customer Acquisition Cost</h3>
                <p className="text-2xl font-bold text-indigo-900">{selectedSegment.customerAcquisitionCost}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Lifetime Value</h3>
                <p className="text-2xl font-bold text-indigo-900">{selectedSegment.lifetimeValue}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Revenue per Employee</h3>
                <p className="text-2xl font-bold text-indigo-900">{selectedSegment.revenuePerEmployee}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
