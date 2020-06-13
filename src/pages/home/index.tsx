

import React from 'react';
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Button, message } from 'antd';
import ReactEcharts from 'echarts-for-react';

import "./style.css";

interface CouseItem {
    title: string;
    count: number;
}

interface CouseSerie {
    name: string;
    type: string;
    data: number[];
}

interface TempCourse {
    [key: string]: number[];
}

interface IState {
    isLogin: boolean,
    loginLoading: boolean,
    data: {
        [key: string]: CouseItem[]
    }
}

function timestampToTime (timestamp: string): string {
    const dateObj = new Date(+timestamp) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
    const year = dateObj.getFullYear() // 获取年，
    const month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的
    const date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
    const hours = pad(dateObj.getHours())  // 获取时, pad函数用来补0
    const minutes =  pad(dateObj.getMinutes()) // 获取分
    const seconds =  pad(dateObj.getSeconds()) // 获取秒
    return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
}

function pad(str: string | number): string | number {
    return +str >= 10 ? str : '0' + str
}

class Home extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLogin: true,
            loginLoading: true,
            data: {}
        };
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

        axios.get("/api/showdata").then(res => {
            if (res.data?.data) {
                console.log(res.data.data);
                this.setState({
                    data: res.data.data
                });
            }
        })
    }
    handleCrowllerClick = () => {
        axios.get("/api/getdata").then(res => {
            if (res.data?.data) {
                message.success("爬取数据成功!");
            }
        })
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
    getOption: () => echarts.EChartOption = () => {
        const { data } = this.state;
        console.log("getOption -> data: ", data);
        const courseLegend: string[] = [];
        const timeStampArr: string[] = [];
        const courseSeriesArr: CouseSerie[] = [];
        const tempCourseObj: TempCourse = {};
        for (let timeStamp in data) {
            const stampItem = data[timeStamp];
            stampItem.forEach(item => {
                const { title, count } = item;
                if (courseLegend.indexOf(title) === -1) {
                    courseLegend.push(title);
                }
                tempCourseObj[title] ? tempCourseObj[title].push(count) : (tempCourseObj[title] = [count]);
            });
            timeStampArr.push(timestampToTime(timeStamp));
        }

        for (let courseName in tempCourseObj) {
            courseSeriesArr.push({
                name: courseName,
                type: "line",
                data: tempCourseObj[courseName],
            });
        }

        return {
            title: {
                text: '课程分析'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: courseLegend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: timeStampArr
            },
            yAxis: {
                type: 'value'
            },
            series: courseSeriesArr,
        };
    }
    render() {
        let { isLogin, loginLoading } = this.state;
        if (isLogin) {
            if (!loginLoading) {
                return (
                    <div className="opt-con">
                        <div className="btn-con">
                            <Button type="primary" onClick={this.handleCrowllerClick}>爬取内容</Button>
                            <Button type="primary" onClick={this.handleLogoutClick}>退出</Button>
                        </div>
                        <ReactEcharts option={this.getOption()} />
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