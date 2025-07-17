import api from '../../api/axios';
export const fetchNewAccessToken = async () => {
  try {
    const res = await api.post('/auth/refresh');
    const { accessToken } = res.data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    }
    throw new Error('No access token returned');
  } catch (err) {
    localStorage.removeItem('accessToken');
    throw err;
  }
};
