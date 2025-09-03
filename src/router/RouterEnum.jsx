
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
    EditOrder: 'edit-order/:order_id/:cub_id',

    //Entregas
    SearchUserForDeliveries: 'search-user-for-deliveries',
    Deliveries: 'deliveries/:id',
    EditDeliveryOrder: 'edit-delivery-order/:id',

    //Productos
    Products: 'products',
    CreateProducts: 'create-products',
    EditProduct: 'edit-product',
    ListProductsByConvocation: 'list-products-by-convocation', //Nuevo proceso de listado de productos
    ProductUpload: 'product-upload', //Nuevo proceso de cargue de productos
    ProductPriceQuotes: 'product-price-quotes', //

    //Users
    Users: 'users',
    CreateUsers: 'create-users',

    //payments
    Payments: 'payments',
    PaymentsRole: 'payments/:role',
    ReviewPaymentsBeneficiaryId: 'payments-beneficiary/:id/:role',
    PaymentsSuppliersList: 'payments-suppliers',
    CreateCollectionAccount: 'payments-suppliers/create-collection-account',

    //Fiduciary
    ListAccountOfSuppliers: 'fiduciary/list-account-suppliers',
    CollectionAccountDetails: 'fiduciary/collection-account-details/:id',

    //Suppliers
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
