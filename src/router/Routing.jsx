import { BrowserRouter, Routes, Route } from "react-router-dom";

//Components
import { Conex } from "../components/layout/public/conex/Conex";
import { PublicLayout } from "../components/layout/public/PublicLayout.jsx";
import { Login } from "../components/layout/public/auth/login/Login.jsx";
import { PrivateLayout } from "../components/layout/private/PrivateLayout.jsx";
import { Dashboard } from "../components/layout/private/dashboard/Dashboard.jsx";
import { PageNotFound } from "../components/layout/page404/PageNotFound";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../components/layout/public/auth/logout/Logout";
import { CreateOrder } from "../components/layout/private/purchase-orders/create-order/CreateOrder";
import { EditOrder } from "../components/layout/private/purchase-orders/edit-order-products/EditOrder";
import { ReportingSystem } from "../components/layout/private/reporting-system/ReportingSystem";
import { CompanyReport } from "../components/layout/private/ReportsCompany/CompanyReport";
import { OrderReport } from "../components/layout/private/purchase-orders/order-report/OrderReport";
import { Deliveries } from "../components/layout/private/deliveries/Deliveries";
import { SearchUserForDeliveries } from "../components/layout/private/deliveries/SearchUserForDeliveries";
import { EditDeliveryOrder } from "../components/layout/private/deliveries/EditDeliveryOrder";
import { ProductList } from "../components/layout/private/products/ProductList";
import { EditProduct } from "../components/layout/private/products/EditProduct";
import { AddProducts } from "../components/layout/private/products/AddProducts";
import { UserList } from "../components/layout/private/Users/UserList";
import { CreateUser } from "../components/layout/private/Users/CreateUser";
import { SearchUserForRenegociation } from "../components/layout/private/renegociation/SearchUserForRenegociation";
import { Renegociation } from "../components/layout/private/renegociation/Renegociation";
import { Payments } from "../components/layout/private/payments/Payments";
import { PaySuppliers } from "../components/layout/private/payments/suppliers/PaySuppliers";

//Enum
import { RouterEnum } from "./RouterEnum";

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route path={RouterEnum.Conex } element={ <Conex /> } />

                    <Route path="/" element={ <PublicLayout /> }>
                        <Route index element={ <Login /> } />
                        <Route path="login" element={ <Login /> } />
                    </Route>

                    <Route path={ RouterEnum.RouterAdmin } element={<PrivateLayout /> }>
                        <Route index element={ <Dashboard /> } />

                        {/* Renegociacion */}
                        <Route path={ RouterEnum.SearchUserForRenegociation }  element={ <SearchUserForRenegociation /> }  />
                        <Route path={ RouterEnum.Renegociation }  element={ <Renegociation /> }  />

                        {/* Ordenes */}
                        <Route path={ RouterEnum.CreateOrder }  element={ <CreateOrder /> }  />
                        <Route path={ RouterEnum.EditOrder }  element={ <EditOrder /> }  />

                        {/* Entregas */}
                        <Route path={ RouterEnum.SearchUserForDeliveries }  element={ <SearchUserForDeliveries /> }  />
                        <Route path={ RouterEnum.Deliveries }  element={ <Deliveries /> }  />
                        <Route path={ RouterEnum.EditDeliveryOrder }  element={ <EditDeliveryOrder /> }  />

                        {/* Productos */}
                        <Route path={ RouterEnum.Products }  element={ <ProductList /> }  />
                        <Route path={ RouterEnum.CreateProducts }  element={ <AddProducts /> }  />
                        <Route path={ RouterEnum.EditProduct }  element={ <EditProduct /> }  />

                        {/* Payments */}
                        <Route path={ RouterEnum.Payments }  element={ <Payments /> }  />
                        <Route path={ RouterEnum.Payments_Suppliers }  element={ <PaySuppliers /> }  />

                        {/* Users */}
                        <Route path={ RouterEnum.Users }  element={ <UserList /> }  />
                        <Route path={ RouterEnum.CreateUsers }  element={ <CreateUser /> }  />

                        {/* Reportes */}
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
