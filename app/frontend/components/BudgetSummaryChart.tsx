import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BudgetSummary {
  transactionsTotal: number;
  budgeted: number;
  month: number;
  year: number;
}

interface BudgetSummaryChartProps {
  summaries: BudgetSummary[];
}

const BudgetSummaryChart: React.FC<BudgetSummaryChartProps> = ({ summaries }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!summaries || summaries.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create the main group
    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data for grouped bars
    const data = summaries.map((d: BudgetSummary) => ({
      ...d,
      monthYear: `${d.month}/${d.year}`,
      monthName: new Date(d.year, d.month - 1).toLocaleDateString('en-US', { month: 'short' })
    }));

    // Set up scales
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.monthYear))
      .range([0, width])
      .padding(0.1);

    const x1 = d3.scaleBand()
      .domain(['budgeted', 'transactionsTotal'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: any) => Math.max(d.budgeted, d.transactionsTotal)) || 0])
      .nice()
      .range([height, 0]);

    const chartBlue = '#001ddb'
    const chartGreen = '#619d58'

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(['budgeted', 'transactionsTotal'])
      .range([chartBlue, chartGreen]); // Blue for budgeted, red for transactions

    // Create bars
    const barGroup = g.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d: any) => `translate(${x0(d.monthYear)},0)`);

    // Add budgeted bars
    barGroup.append('rect')
      .attr('x', x1('budgeted') || 0)
      .attr('y', (d: any) => y(d.budgeted))
      .attr('width', x1.bandwidth())
      .attr('height', (d: any) => height - y(d.budgeted))
      .attr('fill', color('budgeted') as string)
      .attr('class', 'bar budgeted');

    // Add transactions total bars
    barGroup.append('rect')
      .attr('x', x1('transactionsTotal') || 0)
      .attr('y', (d: any) => y(d.transactionsTotal))
      .attr('width', x1.bandwidth())
      .attr('height', (d: any) => height - y(d.transactionsTotal))
      .attr('fill', color('transactionsTotal') as string)
      .attr('class', 'bar transactions');

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickFormat((d: any) => {
        const [month, year] = d.split('/');
        return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' })} ${year}`;
      }))
      .selectAll('text')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(y).tickFormat(d3.format('$,.0f')))
      .selectAll('text')
      .style('font-size', '12px');

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Amount ($)');

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    const legendItems = [
      { label: 'Budgeted', color: color('budgeted') },
      { label: 'Transactions', color: color('transactionsTotal') }
    ];

    legendItems.forEach((item, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', item.color as string);

      legendItem.append('text')
        .attr('x', 18)
        .attr('y', 9)
        .style('font-size', '12px')
        .text(item.label);
    });

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    barGroup.selectAll('.bar')
      .on('mouseover', function(this: any, event: any, d: any) {
        const barType = d3.select(this).classed('budgeted') ? 'budgeted' : 'transactions';
        const value = barType === 'budgeted' ? d.budgeted : d.transactionsTotal;
        const label = barType === 'budgeted' ? 'Budgeted' : 'Transactions';
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`${label}: ${d3.format('$,.0f')(value)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

  }, [summaries]);

  return (
    <div className="w-full">
      <div className="hidden">
        {summaries.map((s) => (
          <div>
            <div>month: {s.month} year: {s.year}</div>
            <div>budgeted: {s.budgeted}</div>
            <div>total: {s.transactionsTotal}</div>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-4">Budget Summary Chart</h3>
      <div className="flex justify-center">
        <svg ref={svgRef} className="border rounded-lg bg-white"></svg>
      </div>
    </div>
  );
};

export default BudgetSummaryChart;
