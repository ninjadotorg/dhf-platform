require("../configs/configuration")
const Promise = require('bluebird')
var Gateway = require('./Exchanges/gateway');
let OrderDB = require("../common/models/orders")
let ExchangeDB = require("../common/models/exchanges")

const GatewayList = {}
let isRunning = false
const interval = 1000 * 10 // 10 seconds

async function getGateway(project) {
    try {
        let gateway = GatewayList[project]
        if (!gateway) {
            gateway = new Gateway(null, null, project)
            await gateway.init()

            GatewayList[project] = gateway
        }

        if (!gateway.exchange) {
            throw new Error('Exchange name incorrect')
        }

        return gateway
    } catch (e) {
        console.log('could not get gateway for project', project, e)
        throw e
    }
}

async function updateOrder(gateway, order) {
    const detail = await gateway.action('getOrder', { symbol: order.symbol, clientOrderId: order.orderKey })
    const json = JSON.parse(detail)
    return await OrderDB.updateOne({ orderId: order.orderId }, { status: json.status, fillQty: json.executedQty })
}

async function getOrders(gateway) {
    // get all open orders
    const orders = await gateway.action('openOrders')
    const json = JSON.parse(orders)
    const orderIds = []
    json.forEach(o => orderIds.push(o.orderId))

    return await OrderDB.find({ status: { $nin: ['FILLED', 'CANCELED'] }, exchangeOrderID: { $nin: orderIds } })
}

async function updateOrders(project) {
    try {
        const gateway = await getGateway(project)
        const orders = await getOrders(gateway)
        if (!orders.length) {
            console.log('project', project, 'doesn\'t have any open orders')
            return
        }

        await Promise.each(orders, o => updateOrder(gateway, o))
    } catch (e) {
        console.log(e)
    }
}

async function getProjects() {
    return await ExchangeDB.find({ isLock: true })
}

async function run() {
    if (isRunning) {
        console.log('previous job is still running, skipping...')
        return
    }

    isRunning = true
    try {
        const projects = await getProjects()
        if (!projects.length) {
            return
        }

        await Promise.each(projects, p => updateOrders(p.lock.project))
    } catch (e) {
        console.log(e)
    } finally {
        isRunning = false
    }
}

module.exports = function() {
    console.log('Running update service...')

    setInterval(function() {
        run()
    }, interval)
}
