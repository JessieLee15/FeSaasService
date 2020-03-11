module.exports = {
  damageThead: [{
      caption: '客户名称',
      type: 'string',
      dataKey: 'user.market_name',
      width: 15
    },
    {
      caption: '内部货损单号',
      type: 'string',
      dataKey: 'id',
      width: 25
    },
    {
      caption: '客户订单号',
      type: 'string',
      dataKey: 'order.id',
      width: 75
    },
    {
      caption: '下单时间',
      type: 'string',
      dataKey: 'order.ordered_at',
      width: 75
    },
    {
      caption: '下单账号',
      type: 'string',
      dataKey: 'user.username',
      width: 75
    },
    {
      caption: '账户类型',
      type: 'string',
      dataKey: 'user.user_type',
      width: 75
    },
    {
      caption: '定损人',
      type: 'string',
      dataKey: 'check_by',
      width: 75
    },
    {
      caption: '成本责任人',
      type: 'string',
      dataKey: 'take_responsibility.by',
      width: 75
    },
    {
      caption: '承担金额',
      type: 'string',
      dataKey: 'amount',
      width: 75
    },
    {
      caption: '相关司机',
      type: 'string',
      dataKey: 'deliveryman.deliveryman_name',
      width: 75
    },
    {
      caption: '司机是否支付',
      type: 'string',
      dataKey: 'payment.status',
      width: 75
    },
    /* {
      caption: '仓库',
      type: 'string',
      dataKey: 'warehouse.id',
      width: 75
    }, */
    {
      caption: '货损单状态',
      dataKey: 'status',
      type: 'string'
    },
    {
      caption: '最近状态时间',
      dataKey: 'updated_at',
      type: 'string'
    }
  ]
}