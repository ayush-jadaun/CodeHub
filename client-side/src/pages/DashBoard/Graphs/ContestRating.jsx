/**
 * @fileoverview Contest Rating Graph component.
 */
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

export default function RatingChangesGraph({ ratingdata }) {
  const isSmallScreen = window.innerWidth < 768;

  //collect new rating data for the graph.
  const RatingChangeData = ratingdata
    .map((elt, index) => ({
      name: elt.contestName,
      uv: elt.newRating,
      amt: elt.newRating,
    }))
    .filter((_, index) => (isSmallScreen ? index % 2 === 0 : true)); // Reduce points for smaller screens

    // Function to get the axis tick with ellipsis for long labels.
  const getAxisTick = (label) => {
    const maxLength = isSmallScreen ? 6 : 12;
    return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
  };

  return (
    <div className="w-full h-[400px] mt-4 mb-20 rounded-lg p-4  lg:h-[400px] md:h-[300px] sm:h-[250px] xs:h-[200px] xxs:h-[150px]">

      {/* Heading */}
      <h4 className="text-3xl md:text-5xl font-bold text-[#05CBDC] text-center mb-6">
        Contest Ratings
      </h4>

        {/* Graph container: make the graph responsive */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={RatingChangeData}
          margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
        >

            {/* Grid lines with dashed pattern */}
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />

            {/* X-Axis configuration */}
            <XAxis
            dataKey="name"
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y + 10}
                fill="#05CBDC" // Neon cyan for tick marks
                fontSize={isSmallScreen ? 10 : 12}
                textAnchor="middle"
              >
                {getAxisTick(payload.value)}
              </text>
            )}
            interval="preserveStartEnd"
          />

            {/* Y-Axis configuration */}
          <YAxis tick={{ fill: '#EA7BB0' }} />

            {/* To display the rating  */}
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(32, 0, 66, 0.9)', // Dark purple
              borderRadius: '8px',
              color: 'white',
              border: '1px solid #05CBDC',
            }}
          />

            {/* Legend configuration */}
          <Legend
            verticalAlign="top"
            wrapperStyle={{ color: '#EA7BB0' }} // Pink for the legend
          />

            {/* Line configuration */}
          <Line
            name="New Rating"
            type="monotone"
            dataKey="uv"
            stroke="#05CBDC" // Cyan accent
            strokeWidth={3}
            dot={{ stroke: '#EA7BB0', strokeWidth: 2 }} // Pink dots
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
