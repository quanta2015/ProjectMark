import React from 'react'
import { Icon, Form, Table,  Drawer, Input, Button,Skeleton, Modal, Tag, Divider, message } from 'antd'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import './index.less'
import { computed } from 'mobx'
import token from 'util/token.js'
import get from 'util/getValue'
import { toJS } from "mobx";

@inject('userStore')
@observer
class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
      curUser: toJS(this.props.userStore.currUser),
      markList: ['90-100','80-89','70-79','60-69'],
			loading: false,
			projlist: [],
      visible: false,
      curProj: null,
      curName: null,
      markRet: [{ name: "CODE",data: [0,0,0,0] },
                { name: "FUNC",data: [0,0,0,0] },
                { name: "MEMY",data: [0,0,0,0] },
                { name: "RESP",data: [0,0,0,0] },
                { name: "PPT", data: [0,0,0,0] }],
		}
	}


  logout = ()=>{
    this.props.userStore.logout()
    window.location.replace(`/#/login`)
  }

  initMark = () =>{
    let {markRet} = this.state
    markRet.map((item,index)=>{
      markRet[index].data=[0,0,0,0]
    })
  }


	async componentWillMount() {
    let usr = toJS(this.props.userStore.currUser)
    console.log(usr)

    if (typeof(usr)==='undefined') {
      window.location.replace(`/#/login`)
    }else{
      let params = { uid: usr.id }
      this.setState({ loading: true })
      let r = await this.props.userStore.getProjList(params)
      this.setState({ loading: false, projlist:r.data })
    }
    
  }

  showDrawer = async (pid,pname) => {
    let uid = toJS(this.props.userStore.currUser).id
    let params = {
      uid: uid,
      pid: pid,
    }
    
    this.setState({ loading: true })
    let r = await this.props.userStore.getMark(params)
    let {markRet} = this.state
    
    if (r.data !== null) {
      let d = r.data[0]
      this.initMark()
      markRet[0].data[parseInt(d.mark_code)]=1
      markRet[1].data[parseInt(d.mark_fun)]=1
      markRet[2].data[parseInt(d.mark_mem)]=1
      markRet[3].data[parseInt(d.mark_res)]=1
      markRet[4].data[parseInt(d.mark_ppt)]=1
    }else{
      this.initMark()
    }
    
    this.setState({
      loading: false,
      visible: true,
      curProj: pid,
      curName: pname,
      markRet: markRet,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      curUser: toJS(this.props.userStore.currUser),
    });
  };

  returnCard = (sel, user) =>{
    if (typeof(sel)!=='undefined') {
      if (sel==0) user.c9++;
      if (sel==1) user.c8++;
      if (sel==2) user.c7++;
      if (sel==3) user.c6++;
    }
  }

  setSelect = (row,col)=>{
    let u = this.state.curUser
    let markRet = this.state.markRet
    let preSel

    markRet[row].data.map((item,index)=>{
      if (item==1) {
        preSel = index
      }
    })
    // console.log(`pre: ${preSel}`)

    if ((col==0)&&(u.c9<=0)) {
      message.error('票已经用完！', 0.5);return;
    }else if ((col==0)&&(u.c9>0)) {
      u.c9--
      this.returnCard(preSel,u)
    }else if ((col==1)&&(u.c8<=0)) {
      message.error('票已经用完！', 0.5);return;
    }else if ((col==1)&&(u.c8>0)) {
      u.c8--
      this.returnCard(preSel,u)
    }else if ((col==2)&&(u.c7<=0)) {
      message.error('票已经用完！', 0.5);return;
    }else if ((col==2)&&(u.c7>0)) {
      u.c7--
      this.returnCard(preSel,u)
    }else if ((col==3)&&(u.c6<=0)) {
      message.error('票已经用完！', 0.5);return;
    }else if ((col==3)&&(u.c6>0)) {
      u.c6--
      this.returnCard(preSel,u)
    }

    markRet[row].data.map((item,index)=>{
      markRet[row].data[index]=(index===col)?1:0
    })
    this.setState({ markRet: markRet, curUser:u })
  }

  markProj = async () =>{
    let {markRet} = this.state
    let mark = [0,0,0,0,0]
    let marked = true
    markRet.map((item,index)=>{
      let ret = false
      item.data.map((mk,j)=>{
        if (mk===1) {
          mark[index]=j
          ret = true
        }
      })
      marked = marked && ret
    })

    if (!marked) {
      Modal.error({
        title: '评分错误',
        content: '您没有选择全部项目...',
      })
    }else{
      let params = {
        uid:  toJS(this.props.userStore.currUser).id,
        pid:  this.state.curProj,
        mark_code: mark[0],
        mark_fun: mark[1],
        mark_mem: mark[2],
        mark_res: mark[3],
        mark_ppt: mark[4],
        c9: this.state.curUser.c9,
        c8: this.state.curUser.c8,
        c7: this.state.curUser.c7,
        c6: this.state.curUser.c6,
      }
      this.setState({ loading: true })
      let r = await this.props.userStore.markProj(params)
      if (r.code===200) {
        message.info(r.msg, 0.5)
        this.setState({ 
          loading: false, 
          visible: false, 
          projlist:r.data.proj
        })
      }else{
        this.setState({ 
          loading: false, 
          visible: false, 
        })
      }
    }
  }

  
	render() {
		let {projlist, curName, curProj, markRet, markList, curUser} = this.state
    
		return (
			<div className='g-user'>
        <Skeleton active loading={this.state.loading}>
          <div className="m-header">
            <div className="m-card">
              <li>
                <label className="c-red">90-100</label>
                <span>{typeof(curUser)!=='undefined'?curUser.c9:0}</span>
              </li>
              <li>
                <label className="c-blue">80-89</label>
                <span>{typeof(curUser)!=='undefined'?curUser.c8:0}</span>
              </li>
              <li>
                <label className="c-green">70-79</label>
                <span>{typeof(curUser)!=='undefined'?curUser.c7:0}</span>
              </li>
              <li>
                <label className="c-yell">60-69</label>
                <span>{typeof(curUser)!=='undefined'?curUser.c6:0}</span>
              </li>
            </div>
            <Icon type="poweroff" className="m-btn" onClick={this.logout}/>
          </div>
          
          <div className="m-user">
            {projlist.map((item,index)=>
              <div className="m-project" key={index} onClick={this.showDrawer.bind(this,item.id,item.proj_name)}>
                <i>{item.ret}</i>
                <label>G{item.id}</label>
                <span>{item.proj_name}</span>
              </div>
            )}
          </div>
        </Skeleton>

        <Drawer
          title=<div className="m-tl">
              <label>G{curProj}</label>
              <span> {curName}</span>
              <Button onClick={this.markProj}>评分</Button>
            </div>
          placement="bottom"
          closable={false}
          height = {260}
          onClose={this.onClose}
          visible={this.state.visible}
        >

          <div className="m-mark">
            <div className="m-ct">
              {markRet.map((item,index)=>
                <div className="m-tp m-code" key={index}>
                  <label>{item.name}</label>
                  {item.data.map((sitem,j)=>
                    <span key={j} className={`m-active${sitem}`} onClick={this.setSelect.bind(this,index,j)}>{markList[j]}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Drawer>
			</div>
		)
	}
}

export default Login
