import { create } from 'zustand'
import { AccessToken } from '../interfaces/AccessTokenProps'


export const useTokenStore = create<AccessToken>()((set) => ({
  token: '',
  setToken: (new_token: string) => set(() => ({ token: new_token })),
}))
