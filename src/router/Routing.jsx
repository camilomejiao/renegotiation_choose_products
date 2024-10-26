import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "../components/layout/public/PublicLayout.jsx";
import { Login } from "../components/layout/public/auth/login/Login.jsx";
import { PrivateLayout } from "../components/layout/private/PrivateLayout.jsx";
import { Dashboard } from "../components/layout/private/dashboard/Dashboard.jsx";
import { PageNotFound } from "../components/layout/page404/PageNotFound";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../components/layout/public/auth/logout/Logout";
import {AddProducts} from "../components/layout/private/add-products/AddProducts";

import { RouterEnum } from "./RouterEnum";
import {ReportingSystem} from "../components/layout/private/reporting-system/ReportingSystem";
import {CompanyReport} from "../components/layout/private/ReportsCompany/CompanyReport";
import {OrderReport} from "../components/layout/private/order-report/OrderReport";
import {Deliveries} from "../components/layout/private/deliveries/Deliveries";

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={ <PublicLayout /> }>
                        <Route index element={ <Login /> } />
                        <Route path="login" element={ <Login /> } />
                    </Route>

                    <Route path={ RouterEnum.RouterAdmin } element={<PrivateLayout /> }>
                        <Route index element={ <Dashboard /> } />

                        <Route path={ RouterEnum.AddProducts }  element={ <AddProducts /> }  />
                        <Route path={ RouterEnum.deliveries }  element={ <Deliveries /> }  />

                        <Route path={ RouterEnum.Reports }  element={ <ReportingSystem /> }  />
                        <Route path={ RouterEnum.CompanyReport }  element={ <CompanyReport /> }  />
                        <Route path={ RouterEnum.OrderReport }  element={ <OrderReport /> }  />

                        <Route path={ RouterEnum.Logout } element={ <Logout /> }         />
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
