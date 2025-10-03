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
import { SearchUser } from "../components/layout/private/search_user_module/SearchUser.jsx";
import { PageNotFound } from "../components/layout/page404/PageNotFound";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../components/layout/public/auth/logout/Logout";
import { CreateOrder } from "../components/layout/private/purchase_orders_module/create_order/CreateOrder";
import { BeneficiariesManagement } from "../components/layout/private/beneficiaries_management_module/BeneficiariesManagement";
import { CompanyReport } from "../components/layout/private/reports_module/report_company/CompanyReport";
import { OrderReport } from "../components/layout/private/purchase_orders_module/order_report/OrderReport";
import { Deliveries } from "../components/layout/private/deliveries_module/Deliveries";
import { SearchUserForDeliveries } from "../components/layout/private/deliveries_module/SearchUserForDeliveries";
import { EditDeliveryOrder } from "../components/layout/private/deliveries_module/EditDeliveryOrder";
import { ValidationSupervision } from "../components/layout/private/products_module/validation_supervision/ValidationSupervision";
//import { EditProduct } from "../components/layout/private/products/old_process/edit_products/EditProduct";
//import { AddProducts } from "../components/layout/private/products/old_process/create_products/AddProducts";
import { MenuTab } from "../components/layout/private/management_module/MenuTab";
import { CreateUser } from "../components/layout/private/management_module/user/CreateUser";
import { SearchUserForRenegociation } from "../components/layout/private/renegociation_module/SearchUserForRenegociation";
import { Renegociation } from "../components/layout/private/renegociation_module/Renegociation";
import { PaymentsMenu } from "../components/layout/private/payments_module/dsci-review/payments-menu/PaymentsMenu";
import { PaySuppliers } from "../components/layout/private/payments_module/suppliers/pay-suppliers/PaySuppliers";
import { BeneficiaryDeliveryReview } from "../components/layout/private/payments_module/dsci-review/beneficiary-review.jsx/BeneficiaryDeliveryReview";
import { CreateCallSuppliers } from "../components/layout/private/suppliers_module/convocation_suppliers/CreateCallSuppliers";
import { SupplierValidation } from "../components/layout/private/suppliers_module/supplier_validation/SupplierValidation";
import { ReviewDocuments } from "../components/layout/private/payments_module/dsci-review/review-documents/ReviewDocuments";
import {
    CreateCollectionAccount
} from "../components/layout/private/payments_module/suppliers/create-collection-account/CreateCollectionAccount";
import {ListAccountOfSuppliers} from "../components/layout/private/payments_module/fiduciary/list-account-suppliers/ListAccountOfSuppliers";
import {
    CollectionAccountDetails
} from "../components/layout/private/payments_module/fiduciary/collection-account-details/CollectionAccountDetails";
import { Dashboard } from "../components/layout/private/dashboard/Dashboard";
import { ProductUploadTechnical } from "../components/layout/private/products_module/product_upload_technical/ProductUploadTechnical";
import { ProductPriceQuotesBySupplier } from "../components/layout/private/products_module/product_price_quotes_by_supplier/ProductPriceQuotesBySupplier";
import {
    ListProductsByConvocation
} from "../components/layout/private/products_module/list_products_by_convocation/ListProductsByConvocation";
import {
    ValidationEnvironmental
} from "../components/layout/private/products_module/validation_environmental/ValidationEnvironmental";
import {
    EditProductsByConvocation
} from "../components/layout/private/products_module/edit_products_by_convocation/EditProductsByConvocation";
import { ReportByConvocation } from "../components/layout/private/products_module/report/ReportByConvocation";
import { CreateSuppliers } from "../components/layout/private/management_module/suppliers/CreateSuppliers";
import { ConvocationList } from "../components/layout/private/management_module/convocation/ConvocationList";
import { ConvocationMenuTab } from "../components/layout/private/management_module/convocation/ConvocationMenuTab";
import {
    ListConciliation
} from "../components/layout/private/payments_module/conciliation/list-conciliation/ListConciliation";
import {
    DeliveriesCorrection
} from "../components/layout/private/deliveries_module/deliveries-correction/DeliveriesCorrection";

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

                        {/* Entregas */}
                        <Route path={ RouterEnum.SearchUserForDeliveries }  element={ <SearchUserForDeliveries /> }  />
                        <Route path={ RouterEnum.Deliveries }  element={ <Deliveries /> }  />
                        <Route path={ RouterEnum.EditDeliveryOrder }  element={ <EditDeliveryOrder /> }  />
                        <Route path={ RouterEnum.CorrectionDeliveries }  element={ <DeliveriesCorrection /> }  />

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

                        {/* Conciliation */}
                        <Route path={ RouterEnum.ListConciliation }  element={ <ListConciliation /> }  />

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
