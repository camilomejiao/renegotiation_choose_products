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
import { BeneficiariesManagement } from "../components/layout/private/beneficiaries_management/BeneficiariesManagement";
import { CompanyReport } from "../components/layout/private/reports/report_company/CompanyReport";
import { OrderReport } from "../components/layout/private/purchase_orders/order_report/OrderReport";
import { Deliveries } from "../components/layout/private/deliveries/Deliveries";
import { SearchUserForDeliveries } from "../components/layout/private/deliveries/SearchUserForDeliveries";
import { EditDeliveryOrder } from "../components/layout/private/deliveries/EditDeliveryOrder";
import { ValidationSupervision } from "../components/layout/private/products/new_process/validation_supervision/ValidationSupervision";
//import { EditProduct } from "../components/layout/private/products/old_process/edit_products/EditProduct";
//import { AddProducts } from "../components/layout/private/products/old_process/create_products/AddProducts";
import { MenuTab } from "../components/layout/private/management/MenuTab";
import { CreateUser } from "../components/layout/private/management/user/CreateUser";
import { SearchUserForRenegociation } from "../components/layout/private/renegociation/SearchUserForRenegociation";
import { Renegociation } from "../components/layout/private/renegociation/Renegociation";
import { PaymentsMenu } from "../components/layout/private/payments/dsci-review/payments-menu/PaymentsMenu";
import { PaySuppliers } from "../components/layout/private/payments/suppliers/pay-suppliers/PaySuppliers";
import { BeneficiaryDeliveryReview } from "../components/layout/private/payments/dsci-review/beneficiary-review.jsx/BeneficiaryDeliveryReview";
import { CreateCallSuppliers } from "../components/layout/private/suppliers/calls_suppliers/CreateCallSuppliers";
import { SupplierValidation } from "../components/layout/private/suppliers/supplier_validation/SupplierValidation";
import { ReviewDocuments } from "../components/layout/private/payments/dsci-review/review-documents/ReviewDocuments";
import {
    CreateCollectionAccount
} from "../components/layout/private/payments/suppliers/create-collection-account/CreateCollectionAccount";
import {ListAccountOfSuppliers} from "../components/layout/private/payments/fiduciary/list-account-suppliers/ListAccountOfSuppliers";
import {
    CollectionAccountDetails
} from "../components/layout/private/payments/fiduciary/collection-account-details/CollectionAccountDetails";
import { Dashboard } from "../components/layout/private/dashboard/Dashboard";
import { ProductUploadTechnical } from "../components/layout/private/products/new_process/product_upload_technical/ProductUploadTechnical";
import { ProductPriceQuotesBySupplier } from "../components/layout/private/products/new_process/product_price_quotes_by_supplier/ProductPriceQuotesBySupplier";
import {
    ListProductsByConvocation
} from "../components/layout/private/products/new_process/list_products_by_convocation/ListProductsByConvocation";
import {
    ValidationEnvironmental
} from "../components/layout/private/products/new_process/validation_environmental/ValidationEnvironmental";
import {
    EditProductsByConvocation
} from "../components/layout/private/products/new_process/edit_products_by_convocation/EditProductsByConvocation";
import { ReportByConvocation } from "../components/layout/private/products/new_process/report/ReportByConvocation";
import { CreateSuppliers } from "../components/layout/private/management/suppliers/CreateSuppliers";
import { ConvocationList } from "../components/layout/private/management/convocation/ConvocationList";
import { ConvocationMenuTab } from "../components/layout/private/management/convocation/ConvocationMenuTab";

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
                        {/*<Route path={ RouterEnum.CreateProducts }  element={ <AddProducts /> }  />*/}
                        {/*<Route path={ RouterEnum.EditProduct }  element={ <EditProduct /> }  />*/}
                        <Route path={ RouterEnum.ListProductsByConvocation }  element={ <ListProductsByConvocation /> }  />
                        <Route path={ RouterEnum.ProductUpload }  element={ <ProductUploadTechnical /> }  />
                        <Route path={ RouterEnum.ProductsEnviromental }  element={ <ValidationEnvironmental /> }  />
                        <Route path={ RouterEnum.ProductPriceQuotes }  element={ <ProductPriceQuotesBySupplier /> }  />
                        <Route path={ RouterEnum.ProductsSupervision }  element={ <ValidationSupervision /> }  />
                        <Route path={ RouterEnum.EditProductsByConvocation }  element={ <EditProductsByConvocation /> }  />
                        <Route path={ RouterEnum.ReportByConvocation }  element={ <ReportByConvocation /> }  />

                        {/* Payments */}
                        <Route path={ RouterEnum.Payments }  element={ <PaymentsMenu /> }  />
                        <Route path={ RouterEnum.PaymentsRole }  element={ <BeneficiaryDeliveryReview /> }  />
                        <Route path={ RouterEnum.ReviewPaymentsBeneficiaryId }  element={ <ReviewDocuments /> }  />
                        <Route path={ RouterEnum.PaymentsSuppliersList }  element={ <PaySuppliers /> }  />
                        <Route path={ RouterEnum.CreateCollectionAccount }  element={ <CreateCollectionAccount /> }  />

                        {/* Fiduciary */}
                        <Route path={ RouterEnum.ListAccountOfSuppliers }  element={ <ListAccountOfSuppliers /> }  />
                        <Route path={ RouterEnum.CollectionAccountDetails }  element={ <CollectionAccountDetails /> }  />

                        {/* Management */}
                        <Route path={ RouterEnum.Management } element={ <MenuTab /> }  />
                        <Route path={ RouterEnum.CreateUsers }  element={ <CreateUser /> }  />
                        <Route path={ RouterEnum.EditUsers }  element={ <CreateUser /> }  />
                        <Route path={ RouterEnum.CreateSuppliers }  element={ <CreateSuppliers /> }  />
                        <Route path={ RouterEnum.EditSuppliers }  element={ <CreateSuppliers /> }  />
                        <Route path={ RouterEnum.ConvocationList }  element={ <ConvocationList /> }  />
                        <Route path={ RouterEnum.CreateConvocation }  element={ <ConvocationMenuTab /> }  />
                        <Route path={ RouterEnum.CreateConvocationEdit }  element={ <ConvocationMenuTab /> }  />

                        {/* Convocation Suppliers */}
                        <Route path={ RouterEnum.CreateCallsSuppliers }  element={ <CreateCallSuppliers /> }  />
                        <Route path={ RouterEnum.SupplierValidation }  element={ <SupplierValidation /> }  />

                        {/* Reportes */}
                        <Route path={ RouterEnum.Reports }  element={ <BeneficiariesManagement /> }  />
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
