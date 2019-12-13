import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import { message } from 'antd'
import * as urls from '@constant/urls'
import token from 'util/token.js'

class User {
	@observable
	currUser = undefined

  @action
  async login(params) {
    const r = await axios.post(urls.API_USER_LOGIN, params)
    if (r && r.status === 200) {
      runInAction(() => {
        token.saveUser(r.data.data)
        this.currUser = r.data.data
      })
      return r.data
    } else {
      message.error('网络错误', 0.7)
    }
  }

  @action
  logout() {
    token.removeUser()
    this.currUser = null
  }

  @action
  async getProjList(params) {
    const r = await axios.post(urls.API_PROJ_LIST,params)
    if (r && r.status === 200) {
      return r.data
    } else {
      message.error('网络错误', 0.7)
    }
  }

  @action
  async getMark(params) {
    const r = await axios.post(urls.API_MARK,params)
    if (r && r.status === 200) {
      return r.data
    } else {
      message.error('网络错误', 0.7)
    }
  }

  @action
  async markProj(params) {
    const r = await axios.post(urls.API_MARK_PROJ,params)
    if (r && r.status === 200) {
      console.log(r.data)
      this.currUser = r.data.data.user[0]
      return r.data
    } else {
      message.error('网络错误', 0.7)
    }
  }


  
  

}

export default new User()
