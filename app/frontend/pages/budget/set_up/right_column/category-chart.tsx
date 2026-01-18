import { useEffect, useRef } from "react";
import * as d3 from "d3";

type MonthlyData = {
  month: number;
  year: number;
  budgeted: number;
  transactionsTotal: number;
};

const MonthlyDataChart = (props: { data: Array<MonthlyData> }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const fontSizes = { sm: "8px", md: "9px", lg: "12px" }

  useEffect(() => {
    if (!props.data || props.data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set dimensions and margins
    const margin = {
      top: 30,
      right: 40,
      bottom: 17,
      left: 40
    };
    const containerWidth = 288; // w-72 = 18rem = 288px
    const width = containerWidth - margin.left - margin.right;
    const height = Math.max(100, props.data.length * 30) - margin.top - margin.bottom;

    // Create the main group
    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data
    const data = props.data.map((d) => ({
      ...d,
      monthYear: `${d.month}/${d.year}`,
      monthLabel: `${d.month}/${d.year.toString().slice(-2)}`
    }));

    // Set up scales - horizontal bars
    const y = d3.scaleBand()
      .domain(data.map(d => d.monthYear))
      .range([0, height])
      .padding(0.1);

    const maxValue = d3.max(data, (d) => Math.max(Math.abs(d.budgeted), Math.abs(d.transactionsTotal)) / 100) || 0;
    const x = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, width]);

    const x1 = d3.scaleBand()
      .domain(['budgeted', 'transactionsTotal'])
      .range([0, y.bandwidth()])
      .padding(0.1);

    const chartRed = 'hsl(352, 80%, 68%)';
    const chartBudgetedColor = 'hsl(232, 100%, 73%)';

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(['transactionsTotal', 'budgeted'])
      .range([chartRed, chartBudgetedColor]);

    // Create bars
    const barGroup = g.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(0,${y(d.monthYear)})`);

    // Add budgeted bars (amount)
    barGroup.append('rect')
      .attr('x', 0)
      .attr('y', x1('budgeted') || 0)
      .attr('width', (d) => x(Math.abs(d.budgeted) / 100))
      .attr('height', x1.bandwidth())
      .attr('fill', color('budgeted') as string)
      .attr('class', 'bar budgeted');

    // Add transactions total bars (spent)
    barGroup.append('rect')
      .attr('x', 0)
      .attr('y', x1('transactionsTotal') || 0)
      .attr('width', (d) => x(Math.abs(d.transactionsTotal) / 100))
      .attr('height', x1.bandwidth())
      .attr('fill', color('transactionsTotal') as string)
      .attr('class', 'bar transactions');

    // Add Y axis (month/years)
    g.append('g')
      .call(d3.axisLeft(y).tickFormat((d: any) => {
        const item = data.find(item => item.monthYear === d);
        return item ? item.monthLabel : d;
      }))
      .selectAll('text')
      .style('font-size', fontSizes.sm);

    // Add X axis (amount) on top
    g.append('g')
      .attr('transform', `translate(0,0)`)
      .call(d3.axisTop(x).tickValues([0, maxValue]).tickFormat(d3.format('$,.0f')))
      .selectAll('text')
      .style('font-size', fontSizes.md);

    // Add axis labels
    g.append('text')
      .attr('transform', `translate(${width / 2}, -10)`)
      .style('text-anchor', 'middle')
      .style('font-size', fontSizes.md)
      .text('($)');

  }, [props.data]);

  if (!props.data || props.data.length === 0) return null;

  return (
    <div className="w-full mt-2 overflow-x-auto">
      <svg ref={svgRef} className="border rounded-lg bg-blue-60"></svg>
    </div>
  );
};

export { MonthlyDataChart };
