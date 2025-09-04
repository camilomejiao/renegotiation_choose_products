import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Components */
import { Conex } from "../components/layout/public/conex/Conex";

//Public
import { PublicLayout } from "../components/layout/public/PublicLayout.jsx";
import { Login } from "../components/layout/public/auth/login/Login.jsx";
import { SupplierRegistration } from "../components/layout/public/suppliers/SupplierRegistration";

//Enum
import { RouterEnum } from "./RouterEnum";

//Private
import { PrivateLayout } from "../components/layout/private/PrivateLayout.jsx";
import { SearchUser } from "../components/layout/private/search_user/SearchUser.jsx";
import { PageNotFound } from "../components/layout/page404/PageNotFound";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../components/layout/public/auth/logout/Logout";
import { CreateOrder } from "../components/layout/private/purchase_orders/create_order/CreateOrder";
import { EditOrder } from "../components/layout/private/purchase_orders/edit_order_products/EditOrder";
import { UserManagement } from "../components/layout/private/user_management/UserManagement";
import { CompanyReport } from "../components/layout/private/reports/report_company/CompanyReport";
import { OrderReport } from "../components/layout/private/purchase_orders/order_report/OrderReport";
import { Deliveries } from "../components/layout/private/deliveries/Deliveries";
import { SearchUserForDeliveries } from "../components/layout/private/deliveries/SearchUserForDeliveries";
import { EditDeliveryOrder } from "../components/layout/private/deliveries/EditDeliveryOrder";
import { ValidationSupervision } from "../components/layout/private/products/new_process/validation_supervision/ValidationSupervision";
//import { EditProduct } from "../components/layout/private/products/old_process/edit_products/EditProduct";
//import { AddProducts } from "../components/layout/private/products/old_process/create_products/AddProducts";
import { UserList } from "../components/layout/private/Users/UserList";
import { CreateUser } from "../components/layout/private/Users/CreateUser";
import { SearchUserForRenegociation } from "../components/layout/private/renegociation/SearchUserForRenegociation";
import { Renegociation } from "../components/layout/private/renegociation/Renegociation";
import { PaymentsMenu } from "../components/layout/private/payments/dsci-review/payments-menu/PaymentsMenu";
import { PaySuppliers } from "../components/layout/private/payments/suppliers/pay-suppliers/PaySuppliers";
import { BeneficiaryDeliveryReview } from "../components/layout/private/payments/dsci-review/beneficiary-review.jsx/BeneficiaryDeliveryReview";
import { CreateCallSuppliers } from "../components/layout/private/suppliers/calls_suppliers/CreateCallSuppliers";
import { SupplierValidation } from "../components/layout/private/suppliers/supplier_validation/SupplierValidation";
import {ReviewDocuments} from "../components/layout/private/payments/dsci-review/review-documents/ReviewDocuments";
import {
    CreateCollectionAccount
} from "../components/layout/private/payments/suppliers/create-collection-account/CreateCollectionAccount";
import {ListAccountOfSuppliers} from "../components/layout/private/payments/fiduciary/list-account-suppliers/ListAccountOfSuppliers";
import {
    CollectionAccountDetails
} from "../components/layout/private/payments/fiduciary/collection-account-details/CollectionAccountDetails";
import { Dashboard } from "../components/layout/private/dashboard/Dashboard";
import { ProductUpload } from "../components/layout/private/products/new_process/product_upload/ProductUpload";
import { ProductPriceQuotes } from "../components/layout/private/products/new_process/product_price_quotes/ProductPriceQuotes";
import {
    ListProductsByConvocation
} from "../components/layout/private/products/new_process/list_products_by_convocation/ListProductsByConvocation";
import {
    ValidationEnvironmental
} from "../components/layout/private/products/new_process/validation_environmental/ValidationEnvironmental";

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    <Route path={RouterEnum.Conex } element={ <Conex /> } />

                    <Route path="/" element={ <PublicLayout /> }>
                        <Route index element={ <Login /> } />
                        <Route path={ RouterEnum.Login } element={ <Login /> } />
                        <Route path={ RouterEnum.SupplierRegistration } element={ <SupplierRegistration /> } />
                    </Route>

                    <Route path={ RouterEnum.RouterAdmin } element={<PrivateLayout /> }>
                        {/* Dashboard */}
                        <Route index element={ <Dashboard /> } />

                        {/* Buscar usuario */}
                        <Route path={ RouterEnum.SearchUser }  element={ <SearchUser /> }  />

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
                        <Route path={ RouterEnum.ProductsEnviromental }  element={ <ValidationEnvironmental /> }  />
                        <Route path={ RouterEnum.ProductsSupervision }  element={ <ValidationSupervision /> }  />
                        {/*<Route path={ RouterEnum.CreateProducts }  element={ <AddProducts /> }  />*/}
                        {/*<Route path={ RouterEnum.EditProduct }  element={ <EditProduct /> }  />*/}
                        <Route path={ RouterEnum.ListProductsByConvocation }  element={ <ListProductsByConvocation /> }  />
                        <Route path={ RouterEnum.ProductUpload }  element={ <ProductUpload /> }  />
                        <Route path={ RouterEnum.ProductPriceQuotes }  element={ <ProductPriceQuotes /> }  />

                        {/* Payments */}
                        <Route path={ RouterEnum.Payments }  element={ <PaymentsMenu /> }  />
                        <Route path={ RouterEnum.PaymentsRole }  element={ <BeneficiaryDeliveryReview /> }  />
                        <Route path={ RouterEnum.ReviewPaymentsBeneficiaryId }  element={ <ReviewDocuments /> }  />
                        <Route path={ RouterEnum.PaymentsSuppliersList }  element={ <PaySuppliers /> }  />
                        <Route path={ RouterEnum.CreateCollectionAccount }  element={ <CreateCollectionAccount /> }  />

                        {/* Fiduciary */}
                        <Route path={ RouterEnum.ListAccountOfSuppliers }  element={ <ListAccountOfSuppliers /> }  />
                        <Route path={ RouterEnum.CollectionAccountDetails }  element={ <CollectionAccountDetails /> }  />

                        {/* Users */}
                        <Route path={ RouterEnum.Users }  element={ <UserList /> }  />
                        <Route path={ RouterEnum.CreateUsers }  element={ <CreateUser /> }  />

                        {/* Suppliers */}
                        <Route path={ RouterEnum.CreateCallsSuppliers }  element={ <CreateCallSuppliers /> }  />
                        <Route path={ RouterEnum.SupplierValidation }  element={ <SupplierValidation /> }  />

                        {/* Reportes */}
                        <Route path={ RouterEnum.Reports }  element={ <UserManagement /> }  />
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
