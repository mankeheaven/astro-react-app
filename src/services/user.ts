  import request from '../utils/request';
  import type { CreateUserInput, User, UserList, UserStats } from '../types/user';  


export const getUsersService = () :Promise<UserList>=> {
  return request<UserList>('/users', {
    method: 'GET',
  })
};

export const createUserService = (data: CreateUserInput) :Promise<User>=> {
  return request<User>('/users', {
    method: 'POST',
    data,
  });
};

export const deleteUserService = (id: string) :Promise<User>=> {
  return request<User>(`/users?id=${id}`, {
    method: 'DELETE',
  });
};


export const updateUserService = (id: string, data: Partial<CreateUserInput>) :Promise<User>=> {
  return request<User>(`/users?id=${id}`, {
    method: 'PUT',
    data,
  });
};  

export const checkEmailAvailabilityService = (email: string) :Promise<boolean>=> {
  return request<boolean>(`/users/check-email`, {
    method: 'GET',
    params: { email },
  });
};

export const getUserStatsService = () :Promise<UserStats>=> {
  return request<UserStats>(`/users/stats`, {
    method: 'GET',
  });
};

export const searchUsersService = (query: string) : Promise<UserList> => {
  return request<UserList>(`/users/search`, {
    method: 'GET',
    params: { query },
  });
};    
