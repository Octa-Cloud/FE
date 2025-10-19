import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 기본 설정
const API_BASE_URL = 'https://api.mong.live';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 모든 API 요청 로그 (토큰 제외)
    console.log('🌐 API 요청:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      params: config.params,
      data: config.data,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 50) + '...' : '없음',
      headers: {
        Authorization: config.headers.Authorization ? 'Bearer [토큰있음]' : '없음',
        'Content-Type': config.headers['Content-Type']
      }
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 모든 API 응답 로그
    console.log('🌐 API 응답:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 에러 응답 로그
    console.log('🌐 API 에러:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔑 401 에러 감지: 토큰 재발급 프로세스 시작');
      console.log('📍 원본 요청 정보:', {
        method: originalRequest.method?.toUpperCase(),
        url: originalRequest.url,
        baseURL: originalRequest.baseURL,
        fullURL: originalRequest.baseURL + originalRequest.url,
        headers: originalRequest.headers
      });
      
      originalRequest._retry = true;

      try {
        // 토큰 재발급 시도
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('🔍 리프레시 토큰 확인:', {
          hasRefreshToken: !!refreshToken,
          tokenLength: refreshToken ? refreshToken.length : 0,
          tokenPreview: refreshToken ? refreshToken.substring(0, 50) + '...' : '없음'
        });
        
        if (refreshToken) {
          console.log('🔄 토큰 재발급 요청 시작:', `${API_BASE_URL}/api/auth/reissue`);
          
          const response = await axios.post(`${API_BASE_URL}/api/auth/reissue`, {
            refreshToken,
          });

          console.log('✅ 토큰 재발급 성공:', {
            status: response.status,
            data: response.data
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.result;
          
          console.log('💾 새로운 토큰 저장:', {
            newAccessTokenLength: accessToken ? accessToken.length : 0,
            newAccessTokenPreview: accessToken ? accessToken.substring(0, 50) + '...' : '없음',
            newRefreshTokenLength: newRefreshToken ? newRefreshToken.length : 0,
            newRefreshTokenPreview: newRefreshToken ? newRefreshToken.substring(0, 50) + '...' : '없음'
          });
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // 원래 요청 재시도
          console.log('🔄 원본 요청 재시도 시작:', {
            method: originalRequest.method?.toUpperCase(),
            url: originalRequest.url,
            newAuthorization: `Bearer ${accessToken.substring(0, 50)}...`
          });
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          const retryResponse = await apiClient(originalRequest);
          
          console.log('✅ 원본 요청 재시도 성공:', {
            status: retryResponse.status,
            url: retryResponse.config.url
          });
          
          return retryResponse;
        } else {
          console.log('❌ 리프레시 토큰이 없습니다. 로그인 페이지로 이동');
        }
      } catch (refreshError: any) {
        console.error('❌ 토큰 재발급 실패:', {
          status: refreshError.response?.status,
          statusText: refreshError.response?.statusText,
          data: refreshError.response?.data,
          message: refreshError.message
        });
        
        console.log('🚪 토큰 재발급 실패로 인한 로그아웃 처리 시작');
        
        // 토큰 재발급 실패 시 로그아웃
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        console.log('🧹 로컬 스토리지 토큰 제거 완료');
        console.log('🔄 로그인 페이지로 리다이렉트');
        
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;