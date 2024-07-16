// import { useCallback, useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export const fetchData = async (user, path, setUsers, setRoles, setLoading) => {
//   setLoading(true);
//   try {
//     const response = await axios.get(`${process.env.BASEURL}${path}`, {
//       headers: {
//         Authorization: `Bearer ${user?.token}`,
//       },
//     });

//     console.log('response', response);
//     setUsers(response?.data?.data?.data);
//     setRoles(response?.data?.data?.roles);
//   } catch (error) {
//     console.error('Error:', error);

//     const errorMessage =
//       error?.response?.data?.message ||
//       error?.response?.data?.errors ||
//       error?.message ||
//       'Unknown error';
//     toast.error(`${errorMessage}`);
//   } finally {
//     setLoading(false);
//   }
// };
// const useFetchRolePermission = (user, path) => {
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       fetchData(user, path, setUsers, setRoles, setLoading);
//     }
//   }, [path, user]);
//   const refetch = () => {
//     console.log('refetch');
//     fetchData(user, path, setUsers, setRoles, setLoading);
//   };

//   return { users, roles, loading, refetch };
// };

// export default useFetchRolePermission;
