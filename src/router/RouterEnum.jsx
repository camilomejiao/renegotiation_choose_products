
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


    //Reportes
    Reports: 'reports/:id',
    CompanyReport: 'company-reports',
    OrderReport: 'order-report',

    //
    Logout: 'logout',
}
