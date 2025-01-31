
export const RouterEnum = {

    RouterAdmin: '/admin',

    //Renegociacion
    SearchUserForRenegociation: 'search-user-for-renegociation',
    Renegociation: 'Renegociation/:cub_id',

    //Ordenes de compra
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

    //Users
    Users: 'users',
    CreateUsers: 'create-users',

    //payments
    Payments: 'payments',

    //Reportes
    Reports: 'reports/:id',
    CompanyReport: 'company-reports',
    OrderReport: 'order-report',

    //
    Logout: 'logout',

    //
    Conex: 'conex',
}
