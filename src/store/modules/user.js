import api  from '@/utils/api'
import { getToken, setToken, removeToken, setAccount, removeAccount } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      api.ADMIN.login({ account: username.trim(), password: password }).then(response => {
        const { data } = {code:"20000",data:{token:"admin-token"}}
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setAccount(username.trim())
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      api.ADMIN.getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('登录身份过期，请重新登录。')
        }
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      removeAccount()
      resetRouter()
      commit('RESET_STATE')
      resolve()
      /* api.ADMIN.logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeAccount()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      }) */
    })
  },
  // user modify
  modify({ commit }, userInfo) {
    const { UserAccount, OldPassword, NewPassword } = userInfo
    return new Promise((resolve, reject) => {
      api.ADMIN.modify({ UserAccount:UserAccount.trim(),OldPassword:OldPassword,NewPassword:NewPassword }).then(response => {
        if(response.Code=="1"){
          reject(response.Result)
        }else{
          const { data } = {code:"20000",data:{token:"admin-token"}}
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          setAccount(UserAccount.trim())
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeAccount() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

