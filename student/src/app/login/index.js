import React from 'react'
import { Icon, Form, Input, Button, Divider, message } from 'antd'
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import './index.less'
import { computed } from 'mobx'
import token from 'util/token.js'

@inject('userStore')
@observer
class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
		}

		let user = token.getUser()
		if (user) {
			let values = {  usr: user.usr, pwd: user.pwd }
			this.props.userStore.login(user)
				.then(r => {
					if (r && r.code === 200) {
						message.success(r.msg)
					} else if (r && r.code === 301) {
						message.error(r.msg)
					}
				})
		}
	}



	@computed
	get currUser() {
		return this.props.userStore.currUser
	}

	doLogin = () => {
		this.props.form.validateFields(async (err, values) => {
			if (err) {
				return
			}

			this.props.userStore.login(values)
				.then(r => {
					if (r && r.code === 200) {
						message.success(r.msg)
					} else if (r && r.code === 301) {
						message.error(r.msg)
					}
				})
		})
	}

	render() {
		const {getFieldDecorator} = this.props.form
		
		return (
				<div className='g-login'>
					{this.currUser && <Redirect to='/'/>}

					<div className="m-tl">
						MarkSys
					</div>
					<div className='m-login'>
						<Form >
							<Form.Item>
								{getFieldDecorator('usr', {
									rules: [{required: true, message: ' 学号！'}],
									initialValue: ''
								})(
									<Input
										icon="search"
										size='large'
										className="input-pwd input-center"
										placeholder="学号"
										allowClear
										prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
									/>)}
							</Form.Item>
							<Form.Item>
								{getFieldDecorator('pwd', {
									rules: [{required: true, message: '请输入密码！'}],
								})(
									<Input.Password
										size='large'
										className="input-pwd input-center"
										placeholder="密码"
										prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
									/>)}
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									className="input-btn"
									onClick={this.doLogin}
									block
								>
									登 录
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
		)
	}
}

export default Form.create()(Login)
