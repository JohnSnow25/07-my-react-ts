

import React from 'react';
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Button } from 'antd';
import "./style.css";

interface IState {
    isLogin: boolean,
    loginLoading: boolean,
}

class Home extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLogin: true,
            loginLoading: true,
        };
        
    }
    handleLogoutClick = () => {
        axios.get("/api/logout").then(res => {
            if (res.data?.data) {
                this.setState({
                    isLogin: false,
                    loginLoading: false,
                })
            }
        })
    }
    componentDidMount() {
        axios.get("/api/islogin").then(res => {
            if (!res.data?.data) {
                this.setState({
                    isLogin: false,
                    loginLoading: false,
                });
            } else {
                this.setState({
                    loginLoading: false,
                });
            }
        });
    }
    render() {
        let { isLogin, loginLoading } = this.state;
        if (isLogin) {
            if (!loginLoading) {
                return (
                    <div className="home-page">
                        <Button type="primary">爬取内容</Button>
                        <Button type="primary">展示内容</Button>
                        <Button type="primary" onClick={this.handleLogoutClick}>退出</Button>
                    </div>
                )
            } else {
                return null;
            }
        } else {
            return <Redirect to="/login"/>
        }
    }
}

export default Home;