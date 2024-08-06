import axios from "axios"
const baseUrl = "https://devbongsapi.dpanalyticsolution.com/api/v1"


export const fetchDashboardDataApi = async() => { 
    const data = localStorage.getItem("bongsUser")
    const { token } = data && JSON.parse(data)

    console.log("toke", token)
    const response = await axios.get(`${baseUrl}/dashboard-analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
    
      })
    return response.data
}