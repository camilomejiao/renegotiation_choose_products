
export const RouterEnum = {

    RouterAdmin: '/admin',

    //Ordenes de compra
    CreateOrder: 'create_order/:id',
    EditOrder: 'edit_order/:order_id/:cub_id',

    //Entregas
    SearchUserForDeliveries: 'search-user-for-deliveries',
    Deliveries: 'deliveries/:id',
    EditDeliveryOrder: 'edit-delivery-order/:id',

    //Productos
    Products: 'products',
    CreateProducts: 'create-products',

    //Users
    Users: 'users',
    CreateUsers: 'create-users',

    //Reportes
    Reports: 'reports/:id',
    CompanyReport: 'company-reports',
    OrderReport: 'order-report',

    //
    Logout: 'logout',
}
