import Cookies from 'js-cookie'
import defaultSettings from '@/settings'

const TokenKey = (defaultSettings.title).toLowerCase()+'_admin_token'
export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7, path: '' })
}
export function removeToken() {
  return Cookies.remove(TokenKey,{ path: '' })
}

const AccountKey = (defaultSettings.title).toLowerCase()+'_admin_account'
export function getAccount() {
  return Cookies.get(AccountKey)
}
export function setAccount(account) {
  return Cookies.set(AccountKey, account, { expires: 7, path: '' })
}
export function removeAccount() {
  return Cookies.remove(AccountKey,{ path: '' })
}