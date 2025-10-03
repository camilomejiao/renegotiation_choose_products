export const RouterEnum = {

    //Public
    Login: 'login',
    SupplierRegistration: 'supplier-registration',

    //Private
    RouterAdmin: '/admin',

    //Renegociacion
    SearchUserForRenegociation: 'search-user-for-renegociation',
    Renegociation: 'Renegociation/:cub_id',

    //Ordenes de compra
    SearchUser: 'search-user',
    CreateOrder: 'create-order/:id',

    //Entregas
    SearchUserForDeliveries: 'search-user-for-deliveries',
    Deliveries: 'deliveries/:id',
    EditDeliveryOrder: 'edit-delivery-order/:id',
    CorrectionDeliveries: 'correction-deliveries',

    //Productos
    Products: 'products',
    ProductsEnviromental: 'products-enviromental',
    ProductsSupervision: 'products-supervision',
    //CreateProducts: 'create-products',
    //EditProduct: 'edit-product',
    ListProductsByConvocation: 'list-products-by-convocation', //Nuevo proceso de listado de productos
    EditProductsByConvocation: 'edit-products-by-convocation/:id',
    ProductUpload: 'product-upload', //Nuevo proceso de cargue de productos
    ProductPriceQuotes: 'product-price-quotes',
    ReportByConvocation: 'report-by-convocation',

    //Managment
    Management: 'management',
    CreateUsers: 'create-users',
    EditUsers: 'edit-users/:id',
    CreateSuppliers: 'create-suppliers',
    EditSuppliers: 'edit-suppliers/:id',
    ConvocationList: 'list-convocation',
    CreateConvocation: 'create-convocation',
    CreateConvocationEdit: "create-convocation/:id",

    //payments
    Payments: 'payments',
    PaymentsRole: 'payments/:role',
    ReviewPaymentsBeneficiaryId: 'payments-beneficiary/:id/:role',
    PaymentsSuppliersList: 'payments-suppliers',
    CreateCollectionAccount: 'payments-suppliers/create-collection-account',

    //Fiduciary
    ListAccountOfSuppliers: 'fiduciary/list-account-suppliers',
    CollectionAccountDetails: 'fiduciary/collection-account-details/:id',

    //Conciliation
    ListConciliation: 'conciliation/list-conciliation',
    ConciliationDetail: 'conciliation/conciliation-detail/:id',

    //Managment Convocation Suppliers
    CreateCallsSuppliers: 'create-calls-suppliers',
    SupplierValidation: 'supplier-validation',

    //Reportes
    Reports: 'reports/:id',
    CompanyReport: 'company-reports',
    OrderReport: 'order-report',

    //
    Logout: 'logout',

    //
    Conex: 'conex',
}
