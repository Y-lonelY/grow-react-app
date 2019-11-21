import React from 'react';
import config from './config';
import { Route, Switch } from 'react-router-dom';

function Router(props) {
    /**
     * defaultConfig 代表默认配置
     * 根据路由对象来生成不同的 Route
     */
    let routeData = config.routeConfig;

    // 筛选出没有重定向的
    let paths = routeData.filter(function (item) {
        return !item.redirect;
    });

    return (
        <Switch>
            {
                paths && paths.map(item => {
                    return <Route path={item.path} component={item.component} key={"key" + item.key} exact={item.exact}></Route>
                })
            }
        </Switch>
    );
}

export default Router