import axios from "axios"
const baseUrl = process.env.BASEURL


export const fetchProcurementChartDataApi = async (params: {
  year?: string
}) => { 
  const { year } = params
    const data = localStorage.getItem("bongsUser")
  const { token } = data && JSON.parse(data)
  
    let url
 if (year) {
       url =     url = `${baseUrl}/procurement/analytics?year=${year}`
    }  else { 
        url = `${baseUrl}/procurement/analytics`
    }
  

    const response = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
    
      })
    return response.data
}





export const fetchAllRfqDataApi = async () => { 
    const data = localStorage.getItem("bongsUser")
  const { token } = data && JSON.parse(data)
  
    let url = `${baseUrl}/procurement/rfq`

    const response = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
    
      })
    return response.data
}




export const fetchAllBidDataApi = async () => { 
  const data = localStorage.getItem("bongsUser")
const { token } = data && JSON.parse(data)

  let url = `${baseUrl}/procurement/bid`

  const response = await axios.get(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
  
    })
  return response.data
}


