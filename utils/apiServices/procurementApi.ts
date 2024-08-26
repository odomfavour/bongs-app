import axios from 'axios';
const baseUrl = process.env.BASEURL;

export const fetchProcurementChartDataApi = async (params: {
  year?: string;
}) => {
  const { year } = params;
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url;
  if (year) {
    url = url = `${baseUrl}/procurement/analytics?year=${year}`;
  } else {
    url = `${baseUrl}/procurement/analytics`;
  }

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllRfqDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/procurement/rfq`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllBidDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/procurement/bid`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllMemoDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/procurement/memo`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllPurchaseOrderDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/procurement/purchase-order`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllQualityAssuranceDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/procurement/quality-assurance`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllProjectDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/getProjects`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllVendorCategoryDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/getVendorCategories`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllVendorDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/getVendors`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllDepartmentDataApi = async () => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);

  let url = `${baseUrl}/getDepartments`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//
export const updateRFQDataApi = async (uploadData: {
  id: number;
  rfqUpdateData: any;
}) => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);
  const { id, rfqUpdateData } = uploadData;

  let url = `${baseUrl}/procurement/rfq/${id}`;

  console.log('final data sent', rfqUpdateData, 'id sent', id);

  const response = await axios.put(`${url}`, rfqUpdateData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// bid api starts
export const fetchBidForRfqDataApi = async (id: string) => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);
  let url = `${baseUrl}/procurement/bid/evaluation/${id}`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const verifyBidAccessDataApi = async (id: number) => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);
  // id of the bid
  let url = `${baseUrl}/procurement/bid/verify-access/${id}`;

  const response = await axios.post(
    `${url}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const awardBidRfqDataApi = async (id: number, isAwarded: string) => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);
  // id of the bid

  // https://devbongsapi.dpanalyticsolution.com/api/v1/procurement/bid/award-bid/{id}
  let url = `${baseUrl}/procurement/bid/award-bid/${id}`;

  const response = await axios.post(
    `${url}`,
    {
      is_awarded: isAwarded,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const showSingleBidRfqDataApi = async (id: string) => {
  const data = localStorage.getItem('bongsUser');
  const { token } = data && JSON.parse(data);
  // id of the bid
  let url = `${baseUrl}/procurement/bid/${id}`;

  const response = await axios.get(`${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const verifyBidAccessTokenApi = async (accessToken: string) => {
  console.log('this is the access_code', accessToken);
  let url = `${baseUrl}/procurement/bid/verify-access`;
  const response = await axios.post(`${url}`, {
    access_code: accessToken,
  });
  return response.data;
};
