import React from 'react';
import axios from 'axios';
import qs from 'qs';
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from "react-router-dom";
import { WrappedFormUtils } from "antd/lib/form/Form";

import './style.css';

interface FormState {
    isLogin: boolean
}

interface FormFields {
    password: string,
}

interface Props {
    form: WrappedFormUtils<FormFields>;
}

class LoginForm extends React.Component<Props, FormState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLogin: false,
        };
    }
    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("values.password: ", values.password);
                axios.post("/api/login", qs.stringify({
                    password: values.password
                }), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(res => {
                    if (res.data?.data) {
                        message.success("登录成功");
                        this.setState({
                            isLogin: true,
                        });
                    } else {
                        message.error("登录失败");
                        this.setState({
                            isLogin: false,
                        });
                    }
                    
                })
            }
        });
    };

    render() {
        const { isLogin } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            isLogin ? <Redirect to="/"/> : (<div className="login-con">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ],
                        })(
                            <Input
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="password"
                                placeholder="Password"
                            />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>)
        );
    }
}

const WrappedLoginForm = Form.create({ name: 'loginForm' })(LoginForm);
export default WrappedLoginForm;
