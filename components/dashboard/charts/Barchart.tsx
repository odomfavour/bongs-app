import React from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';



function Barchart() {
    const data = [
        {
          name: 'Engine',
          amt: 2400,
        },
        {
          name: 'Laundry',
          amt: 220,
        },
        {
            name: 'En',
         
            amt: 2900,
          },
          {
            name: 'store',
            amt: 3410,
        },
        {
            name: 'Engine',
         
            amt: 2400,
          },
          {
            name: 'Page B',
            amt: 2210,
          }
      ];
      
  return (
      <div className='px-4 justify-center items-center flex'>
          <ResponsiveContainer width="100%" height={400}>
              
              <BarChart data={data}
                  barSize={100}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                  
              >
                  <CartesianGrid strokeDasharray="3 3" />
                  
                  <XAxis dataKey="name"
                    label={{ value: 'Counts', position: 'bottom', offset: 0 }}
                     
                  />
             
            
                  <YAxis label={{ value: 'Counts', angle: -90, position: 'insideLeft' }} />
                
               
                      
                    
             
          <Tooltip />
     {/*      <Legend /> */}
                  <Bar
                      dataKey="amt" fill="green"
                      radius={[10, 10, 0, 0]}
                  />
        </BarChart>

      </ResponsiveContainer>
    </div>
  )
}

export default Barchart