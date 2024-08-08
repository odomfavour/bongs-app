import axios from "axios"
const baseUrl = process.env.BASEURL


export const fetchDashboardDataApi = async (params: {
  month?: string,
  year?: string
}) => { 



  const { year , month} = params
    const data = localStorage.getItem("bongsUser")
  const { token } = data && JSON.parse(data)
  

  console.log("month", month, "year", year)
    let url
    if (year && month) {
    url = `${baseUrl}/dashboard-analytics?year=${year}&month=${month}`
    } else if (year) {
       url =     url = `${baseUrl}/dashboard-analytics?year=${year}`
    } else if (month) {
         url = `${baseUrl}/dashboard-analytics?month=${month}`
    } else { 
        url = `${baseUrl}/dashboard-analytics`
    }
  

    const response = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
    
      })
    return response.data
}